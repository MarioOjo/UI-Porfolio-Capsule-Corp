#!/usr/bin/env node
require('dotenv').config();
const db = require('../src/config/database');
const authService = require('../src/services/AuthService');

async function createAdmin() {
  try {
    await db.initialize();
    console.log('✅ Database connected');
    
    const email = 'admin@capsulecorp.com';
    const password = 'Admin2025!';
    const firstName = 'Admin';
    const lastName = 'User';
    
    // Check what columns exist first
    const cols = await db.executeQuery('DESCRIBE users');
    const hasRole = cols.some(c => c.Field === 'role');
    const hasRoleId = cols.some(c => c.Field === 'role_id');
    
    console.log(`\n📋 Schema detection: role=${hasRole}, role_id=${hasRoleId}`);
    
    // Check if user already exists
    const existing = await db.executeQuery('SELECT id, email FROM users WHERE LOWER(email) = ?', [email.toLowerCase()]);
    
    if (existing && existing.length > 0) {
      console.log(`\n✅ User ${email} already exists (ID: ${existing[0].id})`);
      
      // Update password
      const hashedPassword = await authService.hashPassword(password);
      await db.executeQuery('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, existing[0].id]);
      console.log('✅ Password updated');
      
      // Update role if column exists
      if (hasRole) {
        await db.executeQuery('UPDATE users SET role = ? WHERE id = ?', ['admin', existing[0].id]);
        console.log('✅ Updated role to admin');
      } else if (hasRoleId) {
        await db.executeQuery('UPDATE users SET role_id = 2 WHERE id = ?', [existing[0].id]);
        console.log('✅ Updated role_id to 2 (admin)');
      }
      
    } else {
      // Create new admin user
      console.log(`\n📝 Creating new admin user: ${email}`);
      
      const hashedPassword = await authService.hashPassword(password);
      
      let query, values;
      if (hasRole) {
        query = `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 'admin', 1, NOW(), NOW())`;
        values = [email, hashedPassword, firstName, lastName];
      } else if (hasRoleId) {
        query = `INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 2, 1, NOW(), NOW())`;
        values = [email, hashedPassword, firstName, lastName];
      } else {
        query = `INSERT INTO users (email, password_hash, first_name, last_name, is_active, created_at, updated_at)
                 VALUES (?, ?, ?, ?, 1, NOW(), NOW())`;
        values = [email, hashedPassword, firstName, lastName];
      }
      
      const result = await db.executeQuery(query, values);
      console.log(`✅ Admin user created (ID: ${result.insertId})`);
    }
    
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🌐 Login at: https://capsulecorps.dev/login');
    console.log('\n⚠️  IMPORTANT: Add to Railway env vars:');
    console.log('   ADMIN_EMAILS=mario@capsulecorp.com,admin@capsulecorp.com');
    
    await db.closeConnection();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createAdmin();
