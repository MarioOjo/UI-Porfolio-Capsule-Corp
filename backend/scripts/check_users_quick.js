require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'capsule_db'
  });
  
  try {
    // Check mario user
    const [marioRows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['mario@capsulecorp.com']);
    const mario = marioRows[0];
    console.log('\n=== MARIO USER ===');
    if (mario) {
      console.log('✅ User exists');
      console.log('ID:', mario.id);
      console.log('Email:', mario.email);
      console.log('Username:', mario.username);
      console.log('Role:', mario.role);
      console.log('Has password hash:', !!mario.password_hash);
      console.log('Password hash length:', mario.password_hash ? mario.password_hash.length : 0);
    } else {
      console.log('❌ User does NOT exist');
    }
    
    // Check admin user
    const [adminRows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['admin@capsulecorp.com']);
    const admin = adminRows[0];
    console.log('\n=== ADMIN USER ===');
    if (admin) {
      console.log('✅ User exists');
      console.log('ID:', admin.id);
      console.log('Email:', admin.email);
      console.log('Username:', admin.username);
      console.log('Role:', admin.role);
      console.log('Has password hash:', !!admin.password_hash);
      console.log('Password hash length:', admin.password_hash ? admin.password_hash.length : 0);
    } else {
      console.log('❌ User does NOT exist');
    }
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
