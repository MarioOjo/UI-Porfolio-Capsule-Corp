const database = require('../src/config/database');

async function checkTableStructures() {
  try {
    await database.initialize();
    console.log('✅ Connected to LOCAL database\n');

    console.log('═'.repeat(70));
    console.log('ORDERS TABLE STRUCTURE');
    console.log('═'.repeat(70));
    const orders = await database.executeQuery('DESCRIBE orders');
    console.table(orders);

    console.log('\n' + '═'.repeat(70));
    console.log('ORDER_ITEMS TABLE STRUCTURE');
    console.log('═'.repeat(70));
    const items = await database.executeQuery('DESCRIBE order_items');
    console.table(items);

    console.log('\n' + '═'.repeat(70));
    console.log('USER_ADDRESSES TABLE STRUCTURE');
    console.log('═'.repeat(70));
    const addresses = await database.executeQuery('DESCRIBE user_addresses');
    console.table(addresses);

    console.log('\n' + '═'.repeat(70));
    console.log('USERS TABLE STRUCTURE (relevant columns)');
    console.log('═'.repeat(70));
    const users = await database.executeQuery('DESCRIBE users');
    const relevantUserCols = users.filter(col => 
      ['id', 'email', 'username', 'role', 'avatar', 'phone', 'created_at'].includes(col.Field)
    );
    console.table(relevantUserCols);

    console.log('\n' + '═'.repeat(70));
    console.log('PRODUCTS TABLE STRUCTURE (relevant columns)');
    console.log('═'.repeat(70));
    const products = await database.executeQuery('DESCRIBE products');
    const relevantProductCols = products.filter(col => 
      ['id', 'name', 'slug', 'price', 'image', 'category', 'created_at'].includes(col.Field)
    );
    console.table(relevantProductCols);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTableStructures();
