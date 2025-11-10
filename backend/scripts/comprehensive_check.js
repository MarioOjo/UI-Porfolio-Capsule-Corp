require('dotenv').config();
const db = require('../src/config/database');

async function comprehensiveCheck() {
  console.log('\n🔍 COMPREHENSIVE SYSTEM CHECK\n');
  console.log('='.repeat(60));
  
  try {
    await db.initialize();
    console.log('✅ Database connection successful\n');
    
    // 1. Check all required tables exist
    console.log('📋 CHECKING DATABASE TABLES:');
    console.log('-'.repeat(60));
    
    const tables = [
      'users',
      'roles',
      'products',
      'categories',
      'cart_items',
      'orders',
      'order_items',
      'user_addresses',
      'contact_messages',
      'wishlists'
    ];
    
    for (const table of tables) {
      try {
        const result = await db.executeQuery(`SHOW TABLES LIKE '${table}'`);
        if (result.length > 0) {
          console.log(`  ✅ ${table}`);
        } else {
          console.log(`  ❌ ${table} - MISSING`);
        }
      } catch (err) {
        console.log(`  ❌ ${table} - ERROR: ${err.message}`);
      }
    }
    
    // 2. Check critical table schemas
    console.log('\n📐 CHECKING TABLE SCHEMAS:');
    console.log('-'.repeat(60));
    
    // Check users table
    console.log('\n  👤 users table:');
    const userCols = await db.executeQuery('DESCRIBE users');
    const userFields = userCols.map(c => c.Field);
    const requiredUserFields = ['id', 'email', 'username', 'password_hash', 'role', 'phone'];
    for (const field of requiredUserFields) {
      if (userFields.includes(field)) {
        console.log(`     ✅ ${field}`);
      } else {
        console.log(`     ❌ ${field} - MISSING`);
      }
    }
    
    // Check products table
    console.log('\n  📦 products table:');
    const prodCols = await db.executeQuery('DESCRIBE products');
    const prodFields = prodCols.map(c => c.Field);
    const requiredProdFields = ['id', 'name', 'slug', 'description', 'price', 'category', 'image', 'gallery', 'in_stock', 'stock'];
    for (const field of requiredProdFields) {
      if (prodFields.includes(field)) {
        console.log(`     ✅ ${field}`);
      } else {
        console.log(`     ❌ ${field} - MISSING`);
      }
    }
    
    // Check cart_items table
    console.log('\n  🛒 cart_items table:');
    const cartCols = await db.executeQuery('DESCRIBE cart_items');
    const cartFields = cartCols.map(c => c.Field);
    const requiredCartFields = ['id', 'user_id', 'product_id', 'quantity'];
    for (const field of requiredCartFields) {
      if (cartFields.includes(field)) {
        const col = cartCols.find(c => c.Field === field);
        console.log(`     ✅ ${field} (${col.Type})`);
      } else {
        console.log(`     ❌ ${field} - MISSING`);
      }
    }
    
    // Check orders table
    console.log('\n  📋 orders table:');
    const orderCols = await db.executeQuery('DESCRIBE orders');
    const orderFields = orderCols.map(c => c.Field);
    const requiredOrderFields = ['id', 'user_id', 'order_number', 'status', 'total', 'subtotal'];
    for (const field of requiredOrderFields) {
      if (orderFields.includes(field)) {
        const col = orderCols.find(c => c.Field === field);
        console.log(`     ✅ ${field} (${col.Type})`);
      } else {
        console.log(`     ❌ ${field} - MISSING`);
      }
    }
    
    // Check order_items table
    console.log('\n  📦 order_items table:');
    const orderItemCols = await db.executeQuery('DESCRIBE order_items');
    const orderItemFields = orderItemCols.map(c => c.Field);
    const requiredOrderItemFields = ['id', 'order_id', 'product_name', 'quantity', 'unit_price'];
    for (const field of requiredOrderItemFields) {
      if (orderItemFields.includes(field)) {
        const col = orderItemCols.find(c => c.Field === field);
        console.log(`     ✅ ${field} (${col.Type})`);
      } else {
        console.log(`     ❌ ${field} - MISSING`);
      }
    }
    
    // 3. Check data counts
    console.log('\n📊 DATA COUNTS:');
    console.log('-'.repeat(60));
    
    const counts = {
      users: await db.executeQuery('SELECT COUNT(*) as count FROM users'),
      products: await db.executeQuery('SELECT COUNT(*) as count FROM products'),
      orders: await db.executeQuery('SELECT COUNT(*) as count FROM orders'),
      cart_items: await db.executeQuery('SELECT COUNT(*) as count FROM cart_items'),
      contact_messages: await db.executeQuery('SELECT COUNT(*) as count FROM contact_messages')
    };
    
    for (const [table, result] of Object.entries(counts)) {
      console.log(`  ${table}: ${result[0].count} rows`);
    }
    
    // 4. Check admin users
    console.log('\n👨‍💼 ADMIN USERS:');
    console.log('-'.repeat(60));
    
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    console.log(`  Configured admin emails: ${adminEmails.join(', ')}`);
    
    const users = await db.executeQuery('SELECT id, email, username, role FROM users');
    const admins = users.filter(u => adminEmails.includes(u.email) || u.role === 'admin');
    
    if (admins.length === 0) {
      console.log('  ❌ NO ADMIN USERS FOUND!');
    } else {
      for (const admin of admins) {
        console.log(`  ✅ ${admin.email} (ID: ${admin.id}, Role: ${admin.role})`);
      }
    }
    
    // 5. Check foreign key constraints
    console.log('\n🔗 FOREIGN KEY CONSTRAINTS:');
    console.log('-'.repeat(60));
    
    try {
      const constraints = await db.executeQuery(`
        SELECT 
          TABLE_NAME,
          COLUMN_NAME,
          CONSTRAINT_NAME,
          REFERENCED_TABLE_NAME,
          REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND REFERENCED_TABLE_NAME IS NOT NULL
        ORDER BY TABLE_NAME, COLUMN_NAME
      `);
      
      if (constraints.length === 0) {
        console.log('  ⚠️  No foreign keys found');
      } else {
        for (const fk of constraints) {
          console.log(`  ✅ ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
        }
      }
    } catch (err) {
      console.log(`  ❌ Error checking foreign keys: ${err.message}`);
    }
    
    // 6. Check environment variables
    console.log('\n⚙️  ENVIRONMENT VARIABLES:');
    console.log('-'.repeat(60));
    
    const requiredEnvVars = [
      'MYSQL_URL',
      'JWT_SECRET',
      'ADMIN_EMAILS'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        if (envVar === 'JWT_SECRET') {
          console.log(`  ✅ ${envVar}: ****`);
        } else if (envVar === 'MYSQL_URL') {
          console.log(`  ✅ ${envVar}: ${process.env[envVar].substring(0, 20)}...`);
        } else {
          console.log(`  ✅ ${envVar}: ${process.env[envVar]}`);
        }
      } else {
        console.log(`  ❌ ${envVar}: NOT SET`);
      }
    }
    
    // 7. Test critical queries
    console.log('\n🧪 TESTING CRITICAL QUERIES:');
    console.log('-'.repeat(60));
    
    try {
      // Test cart query
      const testUserId = users[0]?.id || 1;
      const cartQuery = `
        SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          p.id,
          p.name,
          p.description,
          p.price,
          p.image,
          p.gallery,
          p.category,
          p.stock,
          p.in_stock,
          p.slug,
          p.power_level,
          p.featured,
          p.original_price,
          p.tags
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = ?
        LIMIT 1
      `;
      await db.executeQuery(cartQuery, [testUserId]);
      console.log('  ✅ Cart query (joins cart_items + products)');
    } catch (err) {
      console.log(`  ❌ Cart query FAILED: ${err.message}`);
    }
    
    try {
      // Test orders query
      const ordersQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
          SUM(total) as revenue
        FROM orders
      `;
      await db.executeQuery(ordersQuery);
      console.log('  ✅ Orders stats query');
    } catch (err) {
      console.log(`  ❌ Orders stats query FAILED: ${err.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ COMPREHENSIVE CHECK COMPLETE\n');
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await db.closeConnection();
    console.log('🔌 Database connection closed\n');
  }
}

comprehensiveCheck();
