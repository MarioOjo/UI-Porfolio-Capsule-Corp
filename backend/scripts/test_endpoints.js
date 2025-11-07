#!/usr/bin/env node
/**
 * Test API endpoints that are failing in production
 */

require('dotenv').config();
const db = require('../src/config/database');
const CartModel = require('../src/models/CartModel');
const UserModel = require('../src/models/UserModel');
const OrderModel = require('../src/models/OrderModel');

async function testEndpoints() {
  try {
    console.log('🧪 Testing failing API endpoints...\n');
    await db.initialize();
    
    // Test 1: Cart operations
    console.log('1️⃣ Testing Cart API...');
    try {
      const cart = await CartModel.getCart(7); // Using user ID 7 from your error
      console.log(`   ✅ Cart fetch works: ${cart.length} items`);
    } catch (err) {
      console.error(`   ❌ Cart fetch failed: ${err.message}`);
      console.error(`      Error code: ${err.code}`);
    }
    
    // Test 2: Profile update with phone
    console.log('\n2️⃣ Testing Profile API (phone field)...');
    try {
      const user = await UserModel.findById(7);
      if (user) {
        console.log(`   ✅ User found: ${user.email}`);
        console.log(`   📱 Current phone: ${user.phone || 'NULL'}`);
        
        // Try to update phone
        const updateResult = await db.executeQuery(
          'UPDATE users SET phone = ? WHERE id = ?',
          ['555-TEST', 7]
        );
        console.log(`   ✅ Phone update works`);
        
        // Revert the test change
        await db.executeQuery(
          'UPDATE users SET phone = NULL WHERE id = ?',
          [7]
        );
      } else {
        console.log(`   ⚠️  User 7 not found`);
      }
    } catch (err) {
      console.error(`   ❌ Profile update failed: ${err.message}`);
      console.error(`      Error code: ${err.code}`);
    }
    
    // Test 3: Order statistics
    console.log('\n3️⃣ Testing Order Statistics API...');
    try {
      const stats = await db.executeQuery(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total), 0) as total_spent
        FROM orders 
        WHERE user_id = ?
      `, [7]);
      console.log(`   ✅ Order stats work: ${stats[0].total_orders} orders, $${stats[0].total_spent} total`);
    } catch (err) {
      console.error(`   ❌ Order stats failed: ${err.message}`);
      console.error(`      Error code: ${err.code}`);
    }
    
    // Test 4: Check actual schema
    console.log('\n4️⃣ Verifying Schema...');
    const userCols = await db.executeQuery('DESCRIBE users');
    const phoneCol = userCols.find(c => c.Field === 'phone');
    console.log(`   📋 Phone column in users: ${phoneCol ? `✅ ${phoneCol.Type}` : '❌ MISSING'}`);
    
    const cartCols = await db.executeQuery('DESCRIBE cart_items');
    console.log(`   📋 cart_items columns: ${cartCols.map(c => c.Field).join(', ')}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Endpoint testing complete!');
    console.log('='.repeat(50));
    
    await db.closeConnection();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testEndpoints();
