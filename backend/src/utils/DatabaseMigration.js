const database = require('../config/database');

class DatabaseMigration {
  static async runMigrations() {
    try {
      console.log('🔄 Running database migrations...');
      
      // Migration to add missing columns to users table
      const migrations = [
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) NULL AFTER id`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS firstName VARCHAR(100) NULL AFTER password_hash`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS lastName VARCHAR(100) NULL AFTER firstName`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE AFTER lastName`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER is_active`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER last_login`
      ];

      for (const migration of migrations) {
        try {
          await database.executeQuery(migration);
        } catch (error) {
          // Ignore errors for columns that already exist
          if (!error.message.includes('Duplicate column name')) {
            console.warn('Migration warning:', error.message);
          }
        }
      }

      console.log('✅ Database migrations completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

module.exports = DatabaseMigration;