const mongoose = require('mongoose');
require('dotenv').config();
const UserModel = require('../src/models/UserModel');
const CartModel = require('../src/models/CartModel');
const OrderModel = require('../src/models/OrderModel');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');

async function simulatePurchase() {
  try {
    // 1. Connect to Database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 2. Create a Test User
    const timestamp = Date.now();
    const passwordHash = await bcrypt.hash('TestPass123!', 10);
    
    const userData = {
      username: `testuser_${timestamp}`,
      email: `testuser_${timestamp}@example.com`,
      password_hash: passwordHash,
      firstName: 'Test',
      lastName: 'Buyer',
      avatar: 'vegeta'
    };

    console.log(`👤 Creating user: ${userData.username}...`);
    // Note: UserModel is exported as a class instance in some files, or class in others.
    // Let's check how it is exported. Based on previous read, it seemed to be a class but let's check if it's instantiated.
    // Actually, looking at UserModel.js content from previous turn: "class UserModel { ... }" but I didn't see the export.
    // Usually it's "module.exports = new UserModel();" or "module.exports = UserModel;".
    // I'll assume it's an instance based on CartModel usage "module.exports = new CartModel();".
    // But let's verify UserModel export.
    
    // UserModel is exported as an instance
    const user = await UserModel.create(userData); 
    
    console.log(`✅ User created: ${user.id} (${user.email})`);

    // 3. Find a Product
    const product = await Product.findOne({ in_stock: true });
    if (!product) {
      throw new Error('No products found in stock');
    }
    console.log(`📦 Found product: ${product.name} (ID: ${product._id})`);

    // 4. Add to Cart
    console.log('🛒 Adding to cart...');
    // CartModel is usually exported as an instance in this project based on CartModel.js read.
    await CartModel.addOrUpdateItem(user.id, product._id.toString(), 2);
    console.log('✅ Product added to cart');

    // 5. Create Order
    console.log('💳 Creating order...');
    const orderData = {
      user_id: user.id,
      customer_name: `${userData.firstName} ${userData.lastName}`,
      customer_email: userData.email,
      customer_phone: '555-0123',
      shipping_address: {
        street: '123 Capsule Corp Way',
        city: 'West City',
        state: 'WC',
        postal_code: '90210',
        country: 'Earth'
      },
      billing_address: {
        street: '123 Capsule Corp Way',
        city: 'West City',
        state: 'WC',
        postal_code: '90210',
        country: 'Earth'
      },
      payment_method: 'credit_card',
      items: [
        {
          product_id: product._id.toString(),
          name: product.name,
          quantity: 2,
          price: product.price,
          image: product.image
        }
      ],
      subtotal: product.price * 2,
      shipping_cost: 10,
      tax: 5,
      total: (product.price * 2) + 10 + 5
    };

    const order = await OrderModel.create(orderData);
    console.log(`✅ Order created successfully!`);
    console.log(`📄 Order Number: ${order.order_number}`);
    console.log(`🆔 Order ID: ${order.order_id}`);

    // 6. Verify Order
    const fetchedOrder = await OrderModel.findById(order.order_id);
    if (fetchedOrder) {
        console.log('🔍 Verified order exists in database.');
    } else {
        console.error('❌ Could not verify order in database.');
    }

  } catch (error) {
    console.error('❌ Simulation failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected');
  }
}

simulatePurchase();
