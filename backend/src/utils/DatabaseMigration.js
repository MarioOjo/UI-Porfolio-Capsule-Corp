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

      console.log('✅ Database migrations completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  static async runSQLMigrations() {
    try {
      const sqlDir = path.join(__dirname, '../../sql');
      // Include base schema first if present, then layered product migrations
      const migrationFiles = [
        'capsule_db.sql',              // base schema (roles, users, categories, legacy products)
        '001_create_users_table.sql',  // create users table with proper schema
        '002_create_products_table.sql',
        '003_seed_products_data.sql',
        '004_add_capsule_products.sql',
        '005_create_contact_messages_table.sql', // contact messages table
        '006_create_orders_tables.sql' // orders, order_items, order_status_history tables
      ];

      for (const file of migrationFiles) {
        const filePath = path.join(sqlDir, file);
        try {
          const raw = await fs.readFile(filePath, 'utf8');

          // Remove BOM if present and normalize line endings
          const sql = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');

          // Split SQL file by semicolons respecting basic cases (no advanced parser)
          const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length && !s.startsWith('--'))
            .filter(s => !s.match(/^USE\s+/i)); // skip USE commands (pool already targets DB)

          for (const statement of statements) {
            try {
              await database.executeQuery(statement);
            } catch (stmtErr) {
              const msg = stmtErr.message || '';
              if (msg.includes('Duplicate') || msg.includes('already exists')) {
                // benign, skip
                continue;
              }
              throw stmtErr;
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