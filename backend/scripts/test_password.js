require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function testLogin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'capsule_db'
  });
  
  const testPasswords = ['Admin2025!', 'mario123', 'Admin123!', 'password', 'admin123', 'capsule123'];
  
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['mario@capsulecorp.com']);
    const user = rows[0];
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n🔐 Testing passwords for mario@capsulecorp.com...\n');
    
    for (const testPass of testPasswords) {
      const match = await bcrypt.compare(testPass, user.password_hash);
      console.log(`Password: "${testPass}" - ${match ? '✅ CORRECT' : '❌ Wrong'}`);
    }
    
    console.log('\n💡 If none match, the password was set differently.');
    console.log('   Check if there\'s a setup script that created the user.');
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testLogin();
