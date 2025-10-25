#!/usr/bin/env node
// reset_admin_password.js
// Usage:
//  node backend/scripts/reset_admin_password.js [email] [password]
// If password is omitted, a secure one will be generated and printed to stdout once.

const db = require('../src/config/database');
const authService = require('../src/services/AuthService');
const crypto = require('crypto');

function generatePassword() {
  // Generate a 16-character password with base64 and safe replacement
  const raw = crypto.randomBytes(12).toString('base64');
  // Ensure it's URL-safe-ish and includes diverse chars
  return raw.replace(/[^A-Za-z0-9]/g, () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    return chars[Math.floor(Math.random() * chars.length)];
  }).slice(0, 16);
}

async function run() {
  const email = (process.argv[2] || 'mario@capsulecorp.com').toLowerCase();
  const provided = process.argv[3];
  const newPassword = provided || generatePassword();

  try {
    await db.initialize();
    // Verify user exists
    const rows = await db.executeQuery('SELECT id, email FROM users WHERE LOWER(email) = ? LIMIT 1', [email]);
    if (!rows || rows.length === 0) {
      console.error('User not found:', email);
      process.exit(1);
    }
    const user = rows[0];
    // Hash the password using AuthService
    const hashed = await authService.hashPassword(newPassword);
    const res = await db.executeQuery('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, user.id]);
    console.log('Password updated for:', email);
    console.log('NEW_PASSWORD:', newPassword);
    console.log('NOTE: This password is shown only once in logs. Copy it now.');
  } catch (e) {
    console.error('Error resetting admin password:', e && e.message ? e.message : e);
    process.exit(1);
  } finally {
    try { await db.closeConnection(); } catch (e) {}
    process.exit(0);
  }
}

run();
