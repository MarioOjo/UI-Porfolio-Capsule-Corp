const database = require('../src/config/database');

async function auditLocalDatabase() {
  try {
    await database.initialize();
    console.log('✅ Connected to LOCAL database\n');
    console.log('═'.repeat(70));
    console.log('🔍 LOCAL DATABASE AUDIT - Checking for Issues');
    console.log('═'.repeat(70));

    const issues = [];
    const fixes = [];

    // 1. Check user_addresses table is missing critical columns
    console.log('\n1️⃣ Checking user_addresses table...');
    const addressCols = await database.executeQuery('DESCRIBE user_addresses');
    const addressColNames = addressCols.map(c => c.Field);
    
    const requiredAddressCols = ['full_name', 'phone', 'type', 'is_default'];
    const missingAddressCols = requiredAddressCols.filter(col => !addressColNames.includes(col));
    
    if (missingAddressCols.length > 0) {
      issues.push(`❌ user_addresses missing: ${missingAddressCols.join(', ')}`);
      fixes.push('Run: backend/sql/016_add_address_fields.sql');
    } else {
      console.log('   ✅ user_addresses has all required columns');
    }

    // 2. Check orders table for metadata column type
    console.log('\n2️⃣ Checking orders table structure...');
    const ordersCols = await database.executeQuery('DESCRIBE orders');
    const metadataCol = ordersCols.find(c => c.Field === 'metadata');
    if (metadataCol && metadataCol.Type !== 'longtext') {
      issues.push(`⚠️  orders.metadata type is ${metadataCol.Type}, should be LONGTEXT`);
    } else if (metadataCol) {
      console.log('   ✅ orders.metadata is LONGTEXT');
    }

    // 3. Check for test data
    console.log('\n3️⃣ Checking test data...');
    const testUser = await database.executeQuery(
      "SELECT id, email, role FROM users WHERE email = 'testuser@capsulecorp.com'"
    );
    if (testUser.length === 0) {
      issues.push('❌ Test user (testuser@capsulecorp.com) not found');
      fixes.push('Run: backend/create_test_order.js');
    } else {
      console.log(`   ✅ Test user exists (ID: ${testUser[0].id})`);
      
      // Check test user's orders
      const testOrders = await database.executeQuery(
        'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
        [testUser[0].id]
      );
      console.log(`   📦 Test user has ${testOrders[0].count} order(s)`);
    }

    // 4. Check admin user
    console.log('\n4️⃣ Checking admin users...');
    const admins = await database.executeQuery(
      "SELECT id, email, role FROM users WHERE role = 'admin'"
    );
    if (admins.length === 0) {
      issues.push('❌ No admin users found');
      fixes.push('Run: backend/scripts/seed_admin_roles.js');
    } else {
      console.log(`   ✅ Found ${admins.length} admin user(s):`);
      admins.forEach(admin => console.log(`      - ${admin.email} (ID: ${admin.id})`));
    }

    // 5. Check products table
    console.log('\n5️⃣ Checking products...');
    const products = await database.executeQuery('SELECT COUNT(*) as count FROM products');
    console.log(`   📦 Total products: ${products[0].count}`);
    if (products[0].count === 0) {
      issues.push('⚠️  No products in database');
      fixes.push('Run product seeding scripts in backend/sql/');
    }

    // 6. Check for required indexes
    console.log('\n6️⃣ Checking database indexes...');
    const indexes = await database.executeQuery(`
      SELECT DISTINCT TABLE_NAME, INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND INDEX_NAME != 'PRIMARY'
      ORDER BY TABLE_NAME, INDEX_NAME
    `);
    console.log(`   📊 Found ${indexes.length} indexes (excluding PRIMARY)`);

    // 7. Check critical foreign keys
    console.log('\n7️⃣ Checking foreign keys...');
    const fks = await database.executeQuery(`
      SELECT TABLE_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    console.log(`   🔗 Found ${fks.length} foreign key constraints`);

    // 8. Check roles table
    console.log('\n8️⃣ Checking roles table...');
    const rolesTables = await database.executeQuery(
      "SHOW TABLES LIKE 'roles'"
    );
    if (rolesTables.length === 0) {
      issues.push('❌ roles table missing');
      fixes.push('Run: backend/sql/000_create_roles_table.sql');
    } else {
      const roles = await database.executeQuery('SELECT * FROM roles');
      console.log(`   ✅ roles table exists with ${roles.length} role(s)`);
    }

    // 9. Check reviews table
    console.log('\n9️⃣ Checking reviews table...');
    const reviewsTables = await database.executeQuery(
      "SHOW TABLES LIKE 'reviews'"
    );
    if (reviewsTables.length === 0) {
      issues.push('⚠️  reviews table missing (optional feature)');
      fixes.push('Run: backend/sql/014_create_reviews_table.sql');
    } else {
      console.log('   ✅ reviews table exists');
    }

    // 10. Check order_status_history table
    console.log('\n🔟 Checking order_status_history table...');
    const orderHistoryTables = await database.executeQuery(
      "SHOW TABLES LIKE 'order_status_history'"
    );
    if (orderHistoryTables.length === 0) {
      issues.push('⚠️  order_status_history table missing');
      fixes.push('Create via: CREATE TABLE order_status_history...');
    } else {
      console.log('   ✅ order_status_history table exists');
    }

    // Summary
    console.log('\n' + '═'.repeat(70));
    console.log('📊 AUDIT SUMMARY');
    console.log('═'.repeat(70));

    if (issues.length === 0) {
      console.log('\n🎉 ✅ ALL CHECKS PASSED! Your local database is ready for production!');
    } else {
      console.log(`\n⚠️  Found ${issues.length} issue(s) to fix:\n`);
      issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));
      
      console.log('\n🔧 RECOMMENDED FIXES:\n');
      fixes.forEach((fix, i) => console.log(`${i + 1}. ${fix}`));
    }

    console.log('\n' + '═'.repeat(70));

    process.exit(issues.length === 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

auditLocalDatabase();
