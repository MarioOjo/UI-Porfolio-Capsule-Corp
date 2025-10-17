const database = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

class DatabaseMigration {
  static async runMigrations() {
    try {
      console.log('🔄 Running database migrations...');
      
      // First, run user table migrations
      const userMigrations = [
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) NULL AFTER id`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS firstName VARCHAR(100) NULL AFTER password_hash`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS lastName VARCHAR(100) NULL AFTER firstName`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE AFTER lastName`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER is_active`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER last_login`
      ];

      for (const migration of userMigrations) {
        try {
          // Some MySQL versions do not support `ADD COLUMN IF NOT EXISTS`.
          // Detect that pattern and run a safe existence check via
          // INFORMATION_SCHEMA before issuing a plain ALTER.
          if (/ALTER\s+TABLE\s+.+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS/i.test(migration)) {
            const parsed = this._parseAddColumnStatement(migration);
            if (parsed) {
              const { table, column } = parsed;
              const existsQuery = `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`;
              const rows = await database.executeQuery(existsQuery, [database.getResolvedConfig().database, table, column]);
              if (!rows || rows.length === 0) {
                // Column missing — run ALTER without IF NOT EXISTS
                const safeAlter = migration.replace(/IF\s+NOT\s+EXISTS\s+/i, '');
                await database.executeQuery(safeAlter);
              } else {
                // Column already exists — skip
              }
              continue;
            }
          }

          // Default path: execute statement as-is
          await database.executeQuery(migration);
        } catch (error) {
          // Ignore errors for columns that already exist
          if (!error.message.includes('Duplicate column name')) {
            console.warn('Migration warning:', error.message);
          }
        }
      }

      // Run SQL file migrations
      await this.runSQLMigrations();

      // Ensure user_addresses table exists (lightweight, idempotent)
      try {
        const createAddr = `
          CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            line1 VARCHAR(255) NOT NULL,
            line2 VARCHAR(255),
            city VARCHAR(100),
            state VARCHAR(100),
            zip VARCHAR(50),
            country VARCHAR(100) DEFAULT 'USA',
            label VARCHAR(100) DEFAULT 'Home',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL,
            deleted_at TIMESTAMP NULL
          ) ENGINE=InnoDB;
        `;
        await database.executeQuery(createAddr);
        console.log('✅ Ensured user_addresses table exists');
      } catch (e) {
        console.warn('⚠️ Could not ensure user_addresses table:', e.message);
      }

      console.log('✅ Database migrations completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  // Very small parser to extract table and column names from simple
  // `ALTER TABLE <table> ADD COLUMN IF NOT EXISTS <column> ...` statements.
  static _parseAddColumnStatement(sql) {
    try {
      // Normalize whitespace
      const norm = sql.replace(/\s+/g, ' ').trim();
      // Match: ALTER TABLE <table> ADD COLUMN IF NOT EXISTS <column>
      const m = norm.match(/ALTER TABLE\s+`?([\w$]+)`?\s+ADD COLUMN\s+IF\s+NOT\s+EXISTS\s+`?([\w$]+)`?/i);
      if (m) {
        return { table: m[1], column: m[2] };
      }
      // Try without backticks and with simple names
      const m2 = norm.match(/ALTER TABLE\s+([\w$]+)\s+ADD COLUMN\s+IF\s+NOT\s+EXISTS\s+([\w$]+)/i);
      if (m2) return { table: m2[1], column: m2[2] };
    } catch (e) {
      // Ignore parse errors; fall back to default behavior
    }
    return null;
  }

  static async runSQLMigrations() {
    try {
      const sqlDir = path.join(__dirname, '../../sql');
      // Updated migration order: run initial schema first
      const migrationFiles = [
        '000_initial_schema.sql',      // new base schema (roles, users, categories, products, capsule_products)
        'capsule_db.sql',              // legacy base schema (safe to run after)
        '001_create_users_table.sql',
        '002_create_products_table.sql',
        '003_seed_products_data.sql',
        '004_add_capsule_products.sql',
        '005_create_contact_messages_table.sql',
        '006_create_orders_tables.sql'
      ];

      for (const file of migrationFiles) {
        const filePath = path.join(sqlDir, file);
        try {
          const raw = await fs.readFile(filePath, 'utf8');

          // Remove BOM if present and normalize line endings
          const sql = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');

          // Split SQL file by semicolons (simple split). We'll execute
          // statements in multiple passes to tolerate dependency ordering
          // (CREATE ... REFERENCES) without needing to reorder files.
          let statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length && !s.startsWith('--'))
            .filter(s => !s.match(/^USE\s+/i)); // skip USE commands

          const pending = new Set(statements);
          const executed = new Set();
          const fkStatements = [];
          const maxPasses = 6;

          for (let pass = 1; pass <= maxPasses && pending.size > 0; pass++) {
            const toAttempt = Array.from(pending);
            let progress = false;

            for (const statement of toAttempt) {
              try {
                // Handle ALTER ... ADD COLUMN IF NOT EXISTS patterns inside SQL files
                if (/ALTER\s+TABLE\s+.+ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS/i.test(statement)) {
                  const parsed = this._parseAddColumnStatement(statement);
                  if (parsed) {
                    const { table, column } = parsed;
                    const existsQuery = `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`;
                    const rows = await database.executeQuery(existsQuery, [database.getResolvedConfig().database, table, column]);
                    if (!rows || rows.length === 0) {
                      const safeAlter = statement.replace(/IF\s+NOT\s+EXISTS\s+/i, '');
                      await database.executeQuery(safeAlter);
                    }
                    pending.delete(statement);
                    executed.add(statement);
                    progress = true;
                    continue;
                  }
                }

                // Try executing the statement normally
                await database.executeQuery(statement);
                pending.delete(statement);
                executed.add(statement);
                progress = true;
              } catch (stmtErr) {
                const msg = (stmtErr && stmtErr.message) ? stmtErr.message : '';
                // benign errors: duplicates / already exists
                if (msg.includes('Duplicate') || msg.includes('already exists') || msg.includes('Duplicate entry')) {
                  pending.delete(statement);
                  executed.add(statement);
                  progress = true;
                  continue;
                }

                // If the error indicates a missing referenced table or similar,
                // defer to next pass (we'll retry after other statements run).
                if (msg.match(/referenced table|doesn't exist|Unknown table|Unknown column|cannot add|ER_NO_REFERENCED_TABLE/i)) {
                  // keep in pending for next pass
                  continue;
                }

                // If CREATE TABLE failed because referenced table missing, try creating
                // the table without FOREIGN KEY clauses and schedule FK additions.
                if (/^CREATE\s+TABLE/i.test(statement) && msg.match(/referenced table|doesn't exist|ER_NO_REFERENCED_TABLE/i)) {
                  try {
                    // Remove FOREIGN KEY (...) REFERENCES ... clauses (simple regex-based)
                    const cleaned = statement.replace(/,?\s*FOREIGN KEY\s*\([^\)]+\)\s*REFERENCES\s*[^,\)]+/gi, '');
                    await database.executeQuery(cleaned);
                    // Extract FK clauses to run later as ALTER TABLE statements
                    const fkMatches = [];
                    const fkRegex = /FOREIGN KEY\s*\(([^\)]+)\)\s*REFERENCES\s*([`\w$.]+)\s*\(([^\)]+)\)/gi;
                    let m;
                    while ((m = fkRegex.exec(statement)) !== null) {
                      // m[1]=columns, m[2]=ref table, m[3]=ref columns
                      // Build an ALTER TABLE ... ADD CONSTRAINT ... statement
                      // Use a generated constraint name
                      const cols = m[1].trim();
                      const refTable = m[2].trim();
                      const refCols = m[3].trim();
                      // Attempt to determine the base table name from the CREATE statement header
                      const headerMatch = statement.match(/CREATE\s+TABLE\s+`?([\w$]+)`?/i);
                      const baseTable = headerMatch ? headerMatch[1] : null;
                      if (baseTable) {
                        const constraintName = `fk_${baseTable}_${refTable}`.replace(/[`\.]/g, '_');
                        const alter = `ALTER TABLE ${baseTable} ADD CONSTRAINT ${constraintName} FOREIGN KEY (${cols}) REFERENCES ${refTable}(${refCols})`;
                        fkMatches.push(alter);
                      }
                    }
                    for (const fk of fkMatches) fkStatements.push(fk);

                    pending.delete(statement);
                    executed.add(statement);
                    progress = true;
                    continue;
                  } catch (fallbackErr) {
                    // If fallback failed, log and keep pending
                    console.warn('⚠️  Fallback create without FKs failed:', fallbackErr.message);
                    continue;
                  }
                }

                // For other errors, log a warning and drop the statement to avoid infinite loop
                console.warn(`⚠️  Migration statement warning (dropping): ${msg.slice(0,120)}`);
                pending.delete(statement);
                executed.add(statement);
                progress = true;
              }
            }

            if (!progress) {
              // No progress this pass — break to avoid infinite loop
              break;
            }
          }

          if (pending.size > 0) {
            console.warn('⚠️  Some migration statements could not be applied after retries:');
            for (const stmt of pending) {
              console.warn(' -', stmt.slice(0, 200));
            }
          }

          // Attempt to apply any collected FK ALTER statements now that base
          // tables may exist. These are best-effort; log warnings if they fail.
          if (fkStatements.length > 0) {
            for (const fk of fkStatements) {
              try {
                await database.executeQuery(fk);
                console.log('✅ Applied FK constraint:', fk.slice(0, 120));
              } catch (fkErr) {
                console.warn('⚠️  Could not apply FK constraint (non-fatal):', fkErr.message.slice(0, 150));
              }
            }
          }
          
          console.log(`✅ Executed migration: ${file}`);
        } catch (error) {
          // For data seeding or schema mismatches, log and continue
          const msg = error.message || '';
          if (msg.includes('Duplicate entry') || msg.includes('already exists')) {
            console.log(`ℹ️  Skipping ${file} - data already exists`);
          } else if (msg.includes('Unknown column') || msg.includes('ER_BAD_FIELD_ERROR')) {
            console.warn(`⚠️  Migration ${file} schema warning (non-fatal):`, msg.slice(0, 100));
          } else {
            console.warn(`⚠️  Migration ${file} warning:`, msg.slice(0, 150));
          }
        }
      }
    } catch (error) {
      console.error('❌ SQL migrations failed (outer):', error.message);
      // Don't throw—allow server to start even if some migrations have warnings
    }
  }
}

module.exports = DatabaseMigration;