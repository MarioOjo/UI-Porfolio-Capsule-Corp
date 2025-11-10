const fs = require('fs');
const path = require('path');
const database = require('../src/config/database');

async function runMigration() {
  try {
    // Initialize database
    await database.initialize();
    console.log('✅ Database connected');

    // Read migration file
    const migrationPath = path.join(__dirname, '../sql/016_add_address_fields.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      console.log(`Running: ${statement.substring(0, 60)}...`);
      await database.executeQuery(statement);
      console.log('✅ Success');
    }

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
