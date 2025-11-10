require('dotenv').config({ path: __dirname + '/.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createTestUserAndOrder() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    console.log('🔋 Connected to database');

    // 1. Create test user
    const hashedPassword = await bcrypt.hash('Test2025!', 10);
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password_hash, full_name, role, created_at) 
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
      ['testuser@capsulecorp.com', hashedPassword, 'Test User', 'user']
    );
    
    const userId = userResult.insertId || (await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['testuser@capsulecorp.com']
    ))[0][0].id;

    console.log('✅ Test user created/found:', {
      id: userId,
      email: 'testuser@capsulecorp.com',
      password: 'Test2025!',
      name: 'Test User'
    });

    // 2. Get some products to order
    const [products] = await connection.execute(
      'SELECT id, name, price, slug, image, category FROM products WHERE stock > 0 LIMIT 3'
    );

    if (products.length === 0) {
      console.log('❌ No products found in database');
      await connection.end();
      return;
    }

    console.log(`📦 Found ${products.length} products to order`);

    // 3. Create order
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const subtotal = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
    const shippingCost = subtotal > 500 ? 0 : 25.99;
    const tax = subtotal * 0.15;
    const total = subtotal + shippingCost + tax;

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_zip, shipping_country,
        billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip, billing_country,
        subtotal, shipping_cost, tax, total,
        payment_method, payment_status, status, customer_notes, placed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderNumber,
        userId,
        'Test User',
        'testuser@capsulecorp.com',
        '+27 11 123 4567',
        '456 Test Street',
        'Apt 42',
        'West City',
        'Gauteng',
        '0002',
        'South Africa',
        '456 Test Street',
        'Apt 42',
        'West City',
        'Gauteng',
        '0002',
        'South Africa',
        subtotal,
        shippingCost,
        tax,
        total,
        'credit_card',
        'pending',
        'pending',
        'This is a test order created for testing purposes'
      ]
    );

    const orderId = orderResult.insertId;
    console.log('✅ Order created:', {
      id: orderId,
      orderNumber: orderNumber,
      total: `R ${total.toFixed(2)}`
    });

    // 4. Add order items
    for (const product of products) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id, variant_id, product_name, sku, unit_price, quantity, total
        ) VALUES (?, NULL, ?, ?, ?, ?, ?)`,
        [
          orderId,
          product.name,
          product.slug || `SKU-${product.id}`,
          product.price,
          1,
          product.price
        ]
      );
      console.log(`  📦 Added item: ${product.name} - R ${product.price}`);
    }

    // 5. Add order status history
    await connection.execute(
      `INSERT INTO order_status_history (order_id, new_status, notes, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [orderId, 'pending', 'Order created for testing']
    );

    console.log('\n🎉 SUCCESS! Test order created\n');
    console.log('═══════════════════════════════════════');
    console.log('📋 TEST CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('Email:    testuser@capsulecorp.com');
    console.log('Password: Test2025!');
    console.log('User ID:  ' + userId);
    console.log('Order ID: ' + orderId);
    console.log('Order #:  ' + orderNumber);
    console.log('Total:    R ' + total.toFixed(2));
    console.log('Items:    ' + products.length);
    console.log('═══════════════════════════════════════\n');
    console.log('✅ You can now:');
    console.log('   1. Login as testuser@capsulecorp.com / Test2025!');
    console.log('   2. View order in "My Orders"');
    console.log('   3. Login as admin to see order in Order Management');
    console.log('   4. Test tracking number updates');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await connection.end();
    console.log('\n🔌 Database connection closed');
  }
}

createTestUserAndOrder();
