// This script connects to Railway production database and fixes the admin role
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixProductionAdmin() {
  let connection;
  
  try {
    console.log('🔗 Connecting to Railway production database...\n');
    
    // Railway database credentials
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'gondola.proxy.rlwy.net',
      port: process.env.DB_PORT || 38169,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'railway'
    });

    console.log('✅ Connected to Railway database\n');

    // Check current admin users
    const [users] = await connection.execute(
      "SELECT id, email, role, username FROM users WHERE email = 'admin@capsulecorp.com'"
    );

    console.log('📋 Current admin@capsulecorp.com users:');
    console.table(users);

    if (users.length === 0) {
      console.log('\n❌ No user found with email admin@capsulecorp.com');
      process.exit(1);
    }

    // Update ALL admin@capsulecorp.com users to have admin role
    console.log('\n🔧 Updating role to "admin" for all admin@capsulecorp.com users...');
    
    const [result] = await connection.execute(
      "UPDATE users SET role = 'admin' WHERE email = 'admin@capsulecorp.com'",
     []
    );

    console.log(`✅ Updated ${result.affectedRows} user(s)\n`);

    // Verify the fix
    const [updated] = await connection.execute(
      "SELECT id, email, role, username FROM users WHERE email = 'admin@capsulecorp.com'"
    );

    console.log('✅ Verified - Updated users:');
    console.table(updated);

    console.log('\n🎉 Production database fixed! Try logging in again.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Tip: Make sure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME are set in .env');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

fixProductionAdmin();
