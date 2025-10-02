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
      const migrationFiles = [
        '002_create_products_table.sql',
        '003_seed_products_data.sql',
        '004_add_capsule_products.sql'
      ];

      for (const file of migrationFiles) {
        const filePath = path.join(sqlDir, file);
        try {
          const sql = await fs.readFile(filePath, 'utf8');
          
          // Split SQL file by semicolons and execute each statement
          const statements = sql.split(';').filter(stmt => stmt.trim());
          
          for (const statement of statements) {
            if (statement.trim()) {
              await database.executeQuery(statement.trim());
            }
          }
          
          console.log(`✅ Executed migration: ${file}`);
        } catch (error) {
          // For data seeding, ignore duplicate entry errors
          if (error.message.includes('Duplicate entry') || error.message.includes('already exists')) {
            console.log(`ℹ️  Skipping ${file} - data already exists`);
          } else {
            console.warn(`⚠️  Migration ${file} warning:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('❌ SQL migrations failed:', error);
      throw error;
    }
  }
}

module.exports = DatabaseMigration;

module.exports = DatabaseMigration;