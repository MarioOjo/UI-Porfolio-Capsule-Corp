require('dotenv').config();
const db = require('../src/config/database');

async function checkSchema() {
  try {
    await db.initialize();
    console.log('✅ Connected to database\n');
    
    // Show users table structure
    const cols = await db.executeQuery('DESCRIBE users');
    console.log('📋 users table columns:');
    cols.forEach(col => {
      console.log(`   ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `[${col.Key}]` : ''} ${col.Default !== null ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // Show all users
    const users = await db.executeQuery('SELECT * FROM users LIMIT 5');
    console.log(`\n👥 Users in database (${users.length}):`);
    users.forEach(u => {
      console.log(`   ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | RoleID: ${u.role_id}`);
    });
    
    await db.closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
