/**
 * Seed Test Data Script
 * Populates MongoDB with test data for development and testing
 * Run: node scripts/seed_test_data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const Return = require('../models/Return');

// Test data
const testUsers = [
  {
    email: 'admin@capsulecorp.com',
    password: 'Admin123!',
    firstName: 'Bulma',
    lastName: 'Brief',
    role: 'admin',
    avatar: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1/avatars/bulma.jpg'
  },
  {
    email: 'goku@capsulecorp.com',
    password: 'User123!',
    firstName: 'Goku',
    lastName: 'Son',
    role: 'user',
    avatar: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1/avatars/goku.jpg'
  },
  {
    email: 'vegeta@capsulecorp.com',
    password: 'User123!',
    firstName: 'Vegeta',
    lastName: 'Prince',
    role: 'user',
    avatar: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1/avatars/vegeta.jpg'
  },
  {
    email: 'piccolo@capsulecorp.com',
    password: 'User123!',
    firstName: 'Piccolo',
    lastName: 'Namekian',
    role: 'user'
  }
];

const testProducts = [
  {
    name: 'Capsule House #5',
    description: 'Portable house capsule with full amenities. Perfect for adventurers who need a comfortable place to rest anywhere in the world.',
    price: 5000,
    category: 'Capsules',
    stock: 15,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    featured: true
  },
  {
    name: 'Vehicle Capsule #3',
    description: 'Compact vehicle capsule. Contains a high-speed hoverbike perfect for quick transportation.',
    price: 3500,
    category: 'Capsules',
    stock: 25,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    featured: true
  },
  {
    name: 'Storage Capsule #1',
    description: 'Large storage capsule with 1000 cubic meters of space. Store anything from furniture to vehicles.',
    price: 2000,
    category: 'Capsules',
    stock: 50,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg'
  },
  {
    name: 'Saiyan Battle Armor',
    description: 'Advanced combat armor worn by elite Saiyan warriors. Provides excellent protection while maintaining flexibility.',
    price: 8000,
    category: 'Battle Gear',
    stock: 10,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    featured: true
  },
  {
    name: 'Power Level Scouter',
    description: 'Advanced scouter capable of reading power levels up to 1 million. Includes communication features.',
    price: 4500,
    category: 'Battle Gear',
    stock: 20,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg'
  },
  {
    name: 'Weighted Training Gi',
    description: 'Heavy training uniform with adjustable weights. Perfect for strength and endurance training.',
    price: 1500,
    category: 'Training',
    stock: 30,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg'
  },
  {
    name: 'Gravity Training Room',
    description: 'Portable gravity chamber capsule. Adjustable from 1x to 100x Earth gravity. Essential for Saiyan training.',
    price: 50000,
    category: 'Training',
    stock: 5,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    featured: true
  },
  {
    name: 'Senzu Bean Pack (10)',
    description: 'Pack of 10 authentic Senzu Beans. Instantly restores health and energy. Emergency use only.',
    price: 25000,
    category: 'Battle Gear',
    stock: 3,
    image: 'https://res.cloudinary.com/dx8wt3el4/image/upload/v1759096629/d3_xdolmn.jpg',
    featured: false
  }
];

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Address.deleteMany({});
    await Review.deleteMany({});
    await Contact.deleteMany({});
    await Return.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const { password, ...safeUserData } = userData;
      const user = await User.create({
        ...safeUserData,
        password_hash: hashedPassword
      });
      createdUsers.push(user);
      console.log(`   ✓ Created ${user.role}: ${user.email}`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = [];
    for (const productData of testProducts) {
      const product = await Product.create({
        ...productData,
        slug: productData.slug || slugify(productData.name)
      });
      createdProducts.push(product);
      console.log(`   ✓ Created: ${product.name} ($${product.price})`);
    }
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // Create addresses for users
    console.log('🏠 Creating addresses...');
    const addresses = [];
    for (let i = 1; i < createdUsers.length; i++) {
      const address = await Address.create({
        user_id: createdUsers[i]._id,
        full_name: `${createdUsers[i].firstName} ${createdUsers[i].lastName}`,
        line1: `${i * 100} Kame House Road`,
        city: 'West City',
        state: 'Earth',
        zip: `${10000 + i * 111}`,
        country: 'Earth',
        phone: `555-${1000 + i}`,
        is_default: true,
        label: 'Home'
      });
      addresses.push(address);
      console.log(`   ✓ Created address for ${createdUsers[i].firstName}`);
    }
    console.log(`✅ Created ${addresses.length} addresses\n`);

    // Create reviews
    console.log('⭐ Creating reviews...');
    const reviews = [];
    for (let i = 0; i < 5; i++) {
      const randomUser = createdUsers[1 + (i % 3)]; // Skip admin
      const randomProduct = createdProducts[i % createdProducts.length];
      const review = await Review.create({
        productId: randomProduct._id,
        userId: randomUser._id,
        rating: 4 + (i % 2), // 4 or 5 stars
        title: `Great ${randomProduct.category}!`,
        comment: `I've been using this ${randomProduct.name} for a while now and it's excellent. Highly recommend for any serious warrior.`,
        verifiedPurchase: true,
        helpful_count: Math.floor(Math.random() * 20)
      });
      reviews.push(review);
      console.log(`   ✓ Created review by ${randomUser.firstName} for ${randomProduct.name}`);
    }
    console.log(`✅ Created ${reviews.length} reviews\n`);

    // Create orders
    console.log('🛒 Creating orders...');
    const orders = [];
    for (let i = 1; i < createdUsers.length; i++) {
      const orderItems = [
        {
          product_id: createdProducts[i % createdProducts.length]._id,
          product_name: createdProducts[i % createdProducts.length].name,
          product_image: createdProducts[i % createdProducts.length].image,
          quantity: 1 + (i % 3),
          price: createdProducts[i % createdProducts.length].price
        }
      ];

      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = 10;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const statuses = ['pending', 'processing', 'shipped', 'delivered'];
      const order = await Order.create({
        order_number: `ORD-${Date.now()}-${i}`,
        user_id: createdUsers[i]._id,
        customer_name: `${createdUsers[i].firstName} ${createdUsers[i].lastName}`,
        customer_email: createdUsers[i].email,
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: statuses[i % statuses.length],
        shipping_address: {
          line1: addresses[i - 1].line1,
          city: addresses[i - 1].city,
          state: addresses[i - 1].state,
          zip: addresses[i - 1].zip,
          country: addresses[i - 1].country
        },
        payment_method: 'credit_card',
        payment_status: 'paid'
      });
      orders.push(order);
      console.log(`   ✓ Created order ${order.order_number} for ${createdUsers[i].firstName} ($${total.toFixed(2)})`);
    }
    console.log(`✅ Created ${orders.length} orders\n`);

    // Create cart items
    console.log('🛒 Creating cart items...');
    const cart = await Cart.create({
      user_id: createdUsers[1]._id, // Goku's cart
      items: [
        {
          product_id: createdProducts[6]._id, // Gravity Training Room
          quantity: 1,
          price: createdProducts[6].price
        },
        {
          product_id: createdProducts[5]._id, // Weighted Training Gi
          quantity: 2,
          price: createdProducts[5].price
        }
      ]
    });
    console.log(`   ✓ Created cart for ${createdUsers[1].firstName} with ${cart.items.length} items`);
    console.log(`✅ Created cart\n`);

    // Create contact messages
    console.log('📧 Creating contact messages...');
    const contacts = [];
    for (let i = 1; i < 3; i++) {
      const contact = await Contact.create({
        name: `${createdUsers[i].firstName} ${createdUsers[i].lastName}`,
        email: createdUsers[i].email,
        subject: `Inquiry about ${testProducts[i].category}`,
        message: `Hi, I'm interested in learning more about your ${testProducts[i].category} products. Can you provide more information?`,
        status: i === 1 ? 'new' : 'replied'
      });
      contacts.push(contact);
      console.log(`   ✓ Created contact from ${contact.name}`);
    }
    console.log(`✅ Created ${contacts.length} contact messages\n`);

    // Create a return request
    console.log('↩️  Creating return request...');
    const returnRequest = await Return.create({
      return_number: `RET-${Date.now()}`,
      order_id: orders[0]._id,
      order_number: orders[0].order_number,
      user_id: createdUsers[1]._id,
      items: [
        {
          product_id: orders[0].items[0].product_id,
          product_name: orders[0].items[0].product_name,
          quantity: 1,
          price: orders[0].items[0].price,
          reason: 'defective',
          condition_notes: 'damaged'
        }
      ],
      reason: 'Product arrived damaged',
      status: 'pending',
      refund_amount: orders[0].items[0].price
    });
    console.log(`   ✓ Created return request ${returnRequest.return_number}`);
    console.log(`✅ Created return request\n`);

    // Summary
    console.log('📊 SEEDING SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users:           ${createdUsers.length} (1 admin, ${createdUsers.length - 1} regular)`);
    console.log(`📦 Products:        ${createdProducts.length}`);
    console.log(`🏠 Addresses:       ${addresses.length}`);
    console.log(`⭐ Reviews:         ${reviews.length}`);
    console.log(`📦 Orders:          ${orders.length}`);
    console.log(`🛒 Cart Items:      1 cart with ${cart.items.length} items`);
    console.log(`📧 Contacts:        ${contacts.length}`);
    console.log(`↩️  Returns:         1`);
    console.log('═══════════════════════════════════════\n');

    console.log('📝 TEST CREDENTIALS:');
    console.log('───────────────────────────────────────');
    console.log('🔐 Admin Account:');
    console.log('   Email:    admin@capsulecorp.com');
    console.log('   Password: Admin123!');
    console.log('');
    console.log('👤 User Accounts:');
    console.log('   Email:    goku@capsulecorp.com');
    console.log('   Password: User123!');
    console.log('');
    console.log('   Email:    vegeta@capsulecorp.com');
    console.log('   Password: User123!');
    console.log('');
    console.log('   Email:    piccolo@capsulecorp.com');
    console.log('   Password: User123!');
    console.log('═══════════════════════════════════════\n');

    console.log('✨ Database seeding completed successfully!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();
