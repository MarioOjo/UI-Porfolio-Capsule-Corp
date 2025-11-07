#!/usr/bin/env node
/**
 * Fix cart_items table schema mismatch
 * Current schema has: cart_id, variant_id
 * Expected schema: user_id, product_id
 */

require('dotenv').config();
const db = require('../src/config/database');

async function fixCartSchema() {
  try {
    console.log('🔧 Fixing cart_items table schema...\n');
    await db.initialize();
    
    // Check current schema
    console.log('📋 Current cart_items schema:');
    const cols = await db.executeQuery('DESCRIBE cart_items');
    cols.forEach(col => {
      console.log(`   ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Check if we need to fix it
    const hasUserId = cols.some(c => c.Field === 'user_id');
    const hasProductId = cols.some(c => c.Field === 'product_id');
    const hasCartId = cols.some(c => c.Field === 'cart_id');
    const hasVariantId = cols.some(c => c.Field === 'variant_id');
    
    if (hasUserId && hasProductId) {
      console.log('\n✅ Schema is already correct!');
      await db.closeConnection();
      process.exit(0);
    }
    
    console.log('\n⚠️  Schema needs fixing!');
    console.log('   Backing up data...');
    
    // Get existing data
    const existingData = await db.executeQuery('SELECT * FROM cart_items');
    console.log(`   📦 Found ${existingData.length} cart items to preserve`);
    
    // Drop the old table
    console.log('\n   🗑️  Dropping old cart_items table...');
    await db.executeQuery('DROP TABLE IF EXISTS cart_items');
    
    // Create new table with correct schema (matching users/products UNSIGNED INT)
    console.log('   ➕ Creating new cart_items table with correct schema...');
    await db.executeQuery(`
      CREATE TABLE cart_items (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        product_id INT UNSIGNED NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id),
        INDEX idx_user_id (user_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('   ✅ New cart_items table created');
    
    // Restore data if any existed (mapping old columns to new)
    if (existingData.length > 0) {
      console.log('\n   📥 Restoring cart data...');
      for (const item of existingData) {
        try {
          // Map old schema to new schema
          const userId = item.cart_id; // Assuming cart_id was actually user_id
          const productId = item.variant_id; // Assuming variant_id was actually product_id
          const quantity = item.quantity || 1;
          
          await db.executeQuery(
            'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [userId, productId, quantity]
          );
        } catch (err) {
          console.log(`      ⚠️  Skipped item (foreign key issue): user=${item.cart_id}, product=${item.variant_id}`);
        }
      }
      console.log(`   ✅ Data restoration complete`);
    }
    
    // Verify new schema
    console.log('\n📋 New cart_items schema:');
    const newCols = await db.executeQuery('DESCRIBE cart_items');
    newCols.forEach(col => {
      console.log(`   ✅ ${col.Field} (${col.Type})`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ cart_items table schema fixed!');
    console.log('='.repeat(50));
    
    await db.closeConnection();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixCartSchema();
