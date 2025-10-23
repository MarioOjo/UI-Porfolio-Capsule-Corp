const database = require('../src/config/database');

async function main() {
  try {
    await database.initialize();
    const db = database.getPool();
    const [countRows] = await db.query('SELECT COUNT(*) as cnt FROM capsule_products');
    console.log('capsule_products count:', countRows[0].cnt);

    const [sample] = await db.query('SELECT id, name, slug, featured, created_at FROM capsule_products ORDER BY created_at DESC LIMIT 5');
    console.log('sample rows:');
    console.table(sample);
    await database.closeConnection();
  } catch (e) {
    console.error('Error checking products:', e.message || e);
    process.exit(1);
  }
}

main();
