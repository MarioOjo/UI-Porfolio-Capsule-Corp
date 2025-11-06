#!/usr/bin/env node
// promote_to_admin.js
// Usage: node backend/scripts/promote_to_admin.js <email>

const db = require('../src/config/database');

async function run() {
  const email = (process.argv[2] || '').toLowerCase().trim();
  
  if (!email) {
    console.error('Usage: node promote_to_admin.js <email>');
    process.exit(1);
  }

  try {
    await db.initialize();
    
    // Check if user exists
    const users = await db.executeQuery('SELECT id, email, role FROM users WHERE LOWER(email) = ?', [email]);
    
    if (!users || users.length === 0) {
      console.error('❌ User not found:', email);
      process.exit(1);
    }
    
    const user = users[0];
    console.log('Found user:', user);
    
    // Update to admin role
    await db.executeQuery('UPDATE users SET role = ? WHERE id = ?', ['admin', user.id]);
    
    console.log('✅ Successfully promoted user to admin:', email);
    console.log('User can now access admin panel at: /admin');
    
  } catch (e) {
    console.error('❌ Error promoting user to admin:', e.message);
    process.exit(1);
  } finally {
    try { 
      await db.closeConnection(); 
    } catch (e) {}
    process.exit(0);
  }
}

run();
