require('dotenv').config();
const db = require('./src/config/database');

async function checkOrders() {
  try {
    await db.initialize();
    console.log('🔍 Checking orders in database...\n');
    
    // Get all orders
    const orders = await db.executeQuery('SELECT * FROM orders ORDER BY placed_at DESC LIMIT 10');
    
    console.log(`📦 Found ${orders.length} orders:\n`);
    
    orders.forEach((order, index) => {
      console.log(`Order #${index + 1}:`);
      console.log(`  ID: ${order.id}`);
      console.log(`  Order Number: ${order.order_number}`);
      console.log(`  Customer Name: ${order.customer_name}`);
      console.log(`  Customer Email: ${order.customer_email}`);
      console.log(`  User ID: ${order.user_id}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Total: R ${order.total}`);
      console.log(`  Placed At: ${order.placed_at}`);
      console.log('---');
    });
    
    // Get order items
    console.log('\n📋 Checking order items...\n');
    const items = await db.executeQuery('SELECT * FROM order_items ORDER BY order_id DESC LIMIT 10');
    
    console.log(`Found ${items.length} order items:\n`);
    items.forEach((item, index) => {
      console.log(`Item #${index + 1}:`);
      console.log(`  Order ID: ${item.order_id}`);
      console.log(`  Product: ${item.product_name}`);
      console.log(`  Quantity: ${item.quantity}`);
      console.log(`  Price: R ${item.price}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOrders();
