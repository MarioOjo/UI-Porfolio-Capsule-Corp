#!/usr/bin/env node
// seed_admin_roles.js
// Usage:
//   node backend/scripts/seed_admin_roles.js "admin@example.com,mario@capsulecorp.com"
// or set env: ADMIN_EMAILS="admin@example.com,mario@capsulecorp.com" and run without args

const db = require('../src/config/database');

async function run() {
  const envList = process.argv[2] || process.env.ADMIN_EMAILS || '';
  const emails = envList.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!emails.length) {
    console.log('No admin emails provided. Usage: node seed_admin_roles.js "a@x.com,b@y.com" or set ADMIN_EMAILS');
    process.exit(0);
  }

  try {
    await db.initialize();

    // Resolve schema name
    const resolved = (db.getResolvedConfig && db.getResolvedConfig()) || {};
    const schema = process.env.DB_NAME || resolved.database || 'capsule_db';

    // Check if 'role' column exists
    const cols = await db.executeQuery(
      'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [schema, 'users']
    );
    const hasRole = cols.some(r => r.COLUMN_NAME && r.COLUMN_NAME.toLowerCase() === 'role');

    if (!hasRole) {
      console.log("'role' column not found on users table; attempting to add it...");
      // Try add with IF NOT EXISTS (MySQL 8+). If that fails, fall back to simple add.
      try {
        await db.executeQuery("ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `role` VARCHAR(32) NOT NULL DEFAULT 'user'");
        console.log("Added 'role' column (IF NOT EXISTS used).");
      } catch (e) {
        console.log('IF NOT EXISTS unsupported or failed, attempting guarded add...');
        // Double-check again and add if still missing
        const cols2 = await db.executeQuery(
          'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
          [schema, 'users']
        );
        const stillMissing = !cols2.some(r => r.COLUMN_NAME && r.COLUMN_NAME.toLowerCase() === 'role');
        if (stillMissing) {
          await db.executeQuery("ALTER TABLE `users` ADD COLUMN `role` VARCHAR(32) NOT NULL DEFAULT 'user'");
          console.log("Added 'role' column (guarded add).");
        } else {
          console.log("'role' column already present after re-check.");
        }
      }
    } else {
      console.log("'role' column already exists. Skipping add.");
    }

    // Set admin role for listed emails
    const placeholders = emails.map(() => '?').join(',');
    const updateSql = `UPDATE users SET role = 'admin' WHERE LOWER(email) IN (${placeholders})`;
    const res = await db.executeQuery(updateSql, emails);
    // res for UPDATE may be an OkPacket; try to log changedRows or affectedRows
    const changed = res && (res.changedRows || res.affectedRows || res.warningCount || 0);
    console.log('Seed completed. Updated rows (approx):', changed || 'unknown');

    console.log('Done. If you need tokens to include role immediately, have users re-login or re-issue tokens.');
  } catch (err) {
    console.error('Seeder error:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    try { await db.closeConnection(); } catch (e) {}
    process.exit(0);
  }
}

run();
