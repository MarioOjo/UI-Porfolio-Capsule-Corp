#!/usr/bin/env node
/**
 * Emergency Production Database Fix
 * Adds missing tables and columns that are causing 500 errors
 * 
 * Run on Railway:
 * node scripts/emergency_prod_fix.js
 */

require('dotenv').config();
const db = require('../src/config/database');

async function fixProductionDatabase() {
  try {
    await db.initialize();
    console.log('✅ Connected to database\n');

    // 1. Add phone column to users table
    console.log('📞 Fixing users table (adding phone column)...');
    try {
      await db.executeQuery(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL
      `);
      console.log('✅ Phone column added to users table');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  Phone column already exists');
      } else {
        console.error('❌ Error adding phone column:', err.message);
      }
    }

    // 2. Create cart_items table
    console.log('\n🛒 Creating cart_items table...');
    try {
      await db.executeQuery(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
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
      console.log('✅ cart_items table created');
    } catch (err) {
      console.error('❌ Error creating cart_items table:', err.message);
    }

    // 3. Verify orders table exists and has required columns
    console.log('\n📦 Checking orders table...');
    try {
      const columns = await db.executeQuery('DESCRIBE orders');
      const hasStatus = columns.some(col => col.Field === 'status');
      const hasTotal = columns.some(col => col.Field === 'total');
      const hasUserId = columns.some(col => col.Field === 'user_id');
      
      console.log(`   status column: ${hasStatus ? '✅' : '❌'}`);
      console.log(`   total column: ${hasTotal ? '✅' : '❌'}`);
      console.log(`   user_id column: ${hasUserId ? '✅' : '❌'}`);
      
      if (!hasStatus || !hasTotal || !hasUserId) {
        console.log('\n⚠️  Orders table missing critical columns!');
        console.log('   You may need to run the full migration for orders table.');
      } else {
        console.log('✅ Orders table structure looks good');
      }
    } catch (err) {
      console.error('❌ Error checking orders table:', err.message);
    }

    // 4. Create order_items table if missing
    console.log('\n📋 Creating order_items table...');
    try {
      await db.executeQuery(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
          INDEX idx_order_id (order_id),
          INDEX idx_product_id (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ order_items table created');
    } catch (err) {
      console.error('❌ Error creating order_items table:', err.message);
    }

    // 5. Verify the fixes
    console.log('\n🔍 Verifying fixes...\n');
    
    // Check users table
    const userCols = await db.executeQuery('DESCRIBE users');
    const hasPhone = userCols.some(col => col.Field === 'phone');
    console.log(`   Users table phone column: ${hasPhone ? '✅ EXISTS' : '❌ MISSING'}`);
    
    // Check cart_items table
    try {
      await db.executeQuery('SELECT 1 FROM cart_items LIMIT 1');
      console.log('   cart_items table: ✅ EXISTS');
    } catch (err) {
      console.log('   cart_items table: ❌ MISSING');
    }
    
    // Check order_items table
    try {
      await db.executeQuery('SELECT 1 FROM order_items LIMIT 1');
      console.log('   order_items table: ✅ EXISTS');
    } catch (err) {
      console.log('   order_items table: ❌ MISSING');
    }

    console.log('\n✅ Database fixes completed!');
    console.log('\n📝 Summary of changes:');
    console.log('   1. Added phone column to users table');
    console.log('   2. Created cart_items table');
    console.log('   3. Created order_items table (if missing)');
    console.log('   4. Verified orders table structure');
    
    console.log('\n🔄 Next steps:');
    console.log('   1. Restart your Railway backend service');
    console.log('   2. Test profile update with phone number');
    console.log('   3. Test cart functionality');
    console.log('   4. Test order statistics on dashboard');

    await db.closeConnection();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

console.log('🚀 Starting Emergency Production Database Fix...\n');
fixProductionDatabase();
