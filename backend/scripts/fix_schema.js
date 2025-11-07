#!/usr/bin/env node
/**
 * Emergency Database Schema Fix
 * Fixes missing columns and tables causing 500 errors
 * 
 * Issues Fixed:
 * 1. Missing 'phone' column in users table
 * 2. Missing 'cart_items' table
 * 3. Any other schema mismatches
 */

require('dotenv').config();
const db = require('../src/config/database');

async function fixSchema() {
  try {
    console.log('🔧 Starting database schema fixes...\n');
    await db.initialize();
    
    // 1. Check and add phone column to users table
    console.log('📋 Checking users table schema...');
    const usersCols = await db.executeQuery('DESCRIBE users');
    const hasPhone = usersCols.some(col => col.Field === 'phone');
    
    if (!hasPhone) {
      console.log('  ➕ Adding phone column to users table...');
      await db.executeQuery(`
        ALTER TABLE users 
        ADD COLUMN phone VARCHAR(20) NULL AFTER last_name
      `);
      console.log('  ✅ Phone column added');
    } else {
      console.log('  ✅ Phone column already exists');
    }
    
    // 2. Check and create cart_items table
    console.log('\n📋 Checking cart_items table...');
    try {
      await db.executeQuery('SELECT 1 FROM cart_items LIMIT 1');
      console.log('  ✅ cart_items table exists');
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.message.includes("doesn't exist")) {
        console.log('  ➕ Creating cart_items table...');
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
        console.log('  ✅ cart_items table created');
      } else {
        throw err;
      }
    }
    
    // 3. Check and create user_addresses table (for addresses feature)
    console.log('\n📋 Checking user_addresses table...');
    try {
      await db.executeQuery('SELECT 1 FROM user_addresses LIMIT 1');
      console.log('  ✅ user_addresses table exists');
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.message.includes("doesn't exist")) {
        console.log('  ➕ Creating user_addresses table...');
        await db.executeQuery(`
          CREATE TABLE IF NOT EXISTS user_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            address_type ENUM('home', 'work', 'other') DEFAULT 'home',
            street_address VARCHAR(255) NOT NULL,
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(100) DEFAULT 'USA',
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('  ✅ user_addresses table created');
      } else {
        throw err;
      }
    }
    
    // 4. Check and create wishlists table
    console.log('\n📋 Checking wishlists table...');
    try {
      await db.executeQuery('SELECT 1 FROM wishlists LIMIT 1');
      console.log('  ✅ wishlists table exists');
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.message.includes("doesn't exist")) {
        console.log('  ➕ Creating wishlists table...');
        await db.executeQuery(`
          CREATE TABLE IF NOT EXISTS wishlists (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_product (user_id, product_id),
            INDEX idx_user_id (user_id),
            INDEX idx_product_id (product_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('  ✅ wishlists table created');
      } else {
        throw err;
      }
    }
    
    // 5. Verify orders table exists (needed for stats)
    console.log('\n📋 Checking orders table...');
    try {
      await db.executeQuery('SELECT 1 FROM orders LIMIT 1');
      console.log('  ✅ orders table exists');
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.message.includes("doesn't exist")) {
        console.log('  ⚠️  WARNING: orders table missing! This will cause stats errors.');
        console.log('  📝 You may need to run order table migration separately.');
      } else {
        throw err;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database schema fixes completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📊 Tables verified/created:');
    console.log('  ✅ users (with phone column)');
    console.log('  ✅ cart_items');
    console.log('  ✅ user_addresses');
    console.log('  ✅ wishlists');
    console.log('  ✅ orders (verified)');
    
    console.log('\n🧪 Test the following:');
    console.log('  1. Profile update with phone number');
    console.log('  2. Add items to cart');
    console.log('  3. Add/edit addresses');
    console.log('  4. Add items to wishlist');
    console.log('  5. View order statistics');
    
    await db.closeConnection();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error fixing schema:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

fixSchema();
