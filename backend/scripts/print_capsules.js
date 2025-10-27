/*
 Script: print_capsules.js
 Purpose: Query capsule_products for category='Capsules' and print JSON to stdout.
 Usage: node scripts/print_capsules.js
 */
const db = require('../src/config/database');

async function run() {
  try {
    await db.initialize();
    const rows = await db.executeQuery("SELECT id, name, slug, description, category, price, original_price, power_level, image, gallery, in_stock, stock, featured, tags, specifications FROM capsule_products WHERE category = 'Capsules' ORDER BY id");
    console.log(JSON.stringify(rows, null, 2));
    await db.closeConnection();
  } catch (err) {
    console.error('Error printing capsules:', err.message || err);
    try { await db.closeConnection(); } catch (_) {}
    process.exit(1);
  }
}

run();
