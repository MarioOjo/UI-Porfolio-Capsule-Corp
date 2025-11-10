require('dotenv').config();
const db = require('./src/config/database');

async function checkTableStructure() {
  try {
    await db.initialize();
    console.log('🔍 Checking orders table structure...\n');
    
    // Get table structure
    const structure = await db.executeQuery('DESCRIBE orders');
    
    console.log('Orders table columns:\n');
    structure.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    // Check actual data
    console.log('\n📊 Sample order data:\n');
    const orders = await db.executeQuery('SELECT id, order_number, customer_name, customer_email, user_id, status FROM orders LIMIT 5');
    console.table(orders);
    
    // Check if Vegeta user exists and their orders
    console.log('\n👤 Checking users:\n');
    const users = await db.executeQuery('SELECT id, name, email FROM users LIMIT 10');
    console.table(users);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTableStructure();
