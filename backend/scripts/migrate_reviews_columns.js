const db = require('../src/config/database');

async function migrate() {
  try {
    console.log('Initializing DB...');
    await db.initialize?.();

    // Add helpful_count if not exists
    await db.executeQuery("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS helpful_count INT DEFAULT 0");
    console.log('Ensured helpful_count column exists');

    // Add updated_at if not exists
    await db.executeQuery("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    console.log('Ensured updated_at column exists');

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

migrate();
