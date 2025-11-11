const database = require('../src/config/database');

async function checkLocalTables() {
  try {
    await database.initialize();
    console.log('✅ Connected to LOCAL database\n');

    // Get all tables
    const tables = await database.executeQuery('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    console.log('📋 LOCAL Database Tables:\n');
    tableNames.forEach(name => console.log(`  - ${name}`));
    console.log(`\nTotal: ${tableNames.length} tables\n`);

    // Check critical columns in key tables
    console.log('🔍 Checking critical columns:\n');

    // Users table
    const usersCols = await database.executeQuery('DESCRIBE users');
    console.log('👤 users table columns:');
    usersCols.forEach(col => {
      if (['role', 'avatar', 'phone'].includes(col.Field)) {
        console.log(`  ✅ ${col.Field} (${col.Type})`);
      }
    });

    // Orders table
    const ordersCols = await database.executeQuery('DESCRIBE orders');
    console.log('\n📦 orders table columns:');
    ordersCols.forEach(col => {
      if (['customer_name', 'customer_email', 'customer_phone', 'tracking_number'].includes(col.Field)) {
        console.log(`  ✅ ${col.Field} (${col.Type})`);
      }
    });

    // User_addresses table
    const addressCols = await database.executeQuery('DESCRIBE user_addresses');
    console.log('\n🏠 user_addresses table columns:');
    addressCols.forEach(col => {
      if (['full_name', 'phone', 'type', 'is_default'].includes(col.Field)) {
        console.log(`  ✅ ${col.Field} (${col.Type})`);
      }
    });

    // Order_items table
    const orderItemsCols = await database.executeQuery('DESCRIBE order_items');
    console.log('\n📝 order_items table columns:');
    orderItemsCols.forEach(col => {
      if (['variant_id', 'product_name', 'sku', 'unit_price', 'quantity', 'total'].includes(col.Field)) {
        console.log(`  ✅ ${col.Field} (${col.Type})`);
      }
    });

    // Products table
    const productsCols = await database.executeQuery('DESCRIBE products');
    console.log('\n🛍️ products table columns:');
    productsCols.forEach(col => {
      if (['category', 'image', 'price', 'slug'].includes(col.Field)) {
        console.log(`  ✅ ${col.Field} (${col.Type})`);
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('PRODUCTION TABLES (from your screenshot):');
    console.log('='.repeat(60));
    const productionTables = [
      'capsule_products',
      'cart_items',
      'categories',
      'contact_messages',
      'product_statuses',
      'products',
      'return_items',
      'returns',
      'roles',
      'user_addresses',
      'users',
      'wishlists'
    ];
    
    console.log('\n📊 Missing in PRODUCTION (present in LOCAL):');
    const missingInProd = tableNames.filter(t => !productionTables.includes(t));
    missingInProd.forEach(t => console.log(`  ❌ ${t}`));

    console.log('\n📊 Present in PRODUCTION but not in LOCAL:');
    const missingInLocal = productionTables.filter(t => !tableNames.includes(t));
    missingInLocal.forEach(t => console.log(`  ⚠️  ${t}`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkLocalTables();
