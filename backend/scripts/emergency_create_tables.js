#!/usr/bin/env node
// emergency_create_tables.js
// Creates all missing tables in production database

const db = require('../src/config/database');

async function run() {
  try {
    await db.initialize();
    console.log('✅ Database connected');

    // Create cart_items table
    console.log('\n📦 Creating cart_items table...');
    await db.executeQuery(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX (user_id),
        INDEX (product_id)
      )
    `);
    console.log('✅ cart_items table created/verified');

    // Verify table exists
    const tables = await db.executeQuery("SHOW TABLES LIKE 'cart_items'");
    console.log(`✅ cart_items table exists:`, tables.length > 0);

    console.log('\n✅ All tables created successfully!');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error(e.stack);
    process.exit(1);
  } finally {
    try { 
      await db.closeConnection(); 
    } catch (e) {}
    process.exit(0);
  }
}

run();
