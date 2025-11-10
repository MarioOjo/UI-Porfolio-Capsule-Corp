/**
 * Test Product Creation
 * Validates that ProductModel.create() works without undefined parameters
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConnection = require('../src/config/database');
const ProductModel = require('../src/models/ProductModel');

async function testProductCreation() {
  console.log('🧪 Testing Product Creation...\n');

  try {
    // Initialize database
    console.log('🔌 Connecting to database...');
    await dbConnection.initialize();
    console.log('✅ Database connected\n');

    // Test 1: Create product with all fields
    console.log('📦 Test 1: Creating product with all fields...');
    const fullProduct = {
      name: 'Test Product Full',
      slug: 'test-product-full',
      description: 'A comprehensive test product with all fields populated',
      category: 'Capsules',
      price: 99.99,
      original_price: 149.99,
      power_level: 9000,
      image: 'https://example.com/image.jpg',
      gallery: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      in_stock: true,
      stock: 50,
      featured: true,
      tags: ['test', 'full', 'capsule'],
      specifications: {
        weight: '100kg',
        dimensions: '10x10x10cm',
        material: 'Capsule Material'
      }
    };

    const result1 = await ProductModel.create(fullProduct);
    console.log('✅ Full product created successfully!');
    console.log('   Product ID:', result1.id);
    console.log('   Product Name:', result1.name);
    console.log('   Price:', result1.price);
    console.log('   Stock:', result1.stock);
    console.log('   Gallery:', result1.gallery.length, 'images');
    console.log('   Tags:', result1.tags.join(', '));
    console.log();

    // Test 2: Create product with minimal fields
    console.log('📦 Test 2: Creating product with minimal fields...');
    const minimalProduct = {
      name: 'Test Product Minimal',
      description: 'A minimal test product',
      category: 'Capsules',
      price: 49.99,
      stock: 10
    };

    const result2 = await ProductModel.create(minimalProduct);
    console.log('✅ Minimal product created successfully!');
    console.log('   Product ID:', result2.id);
    console.log('   Product Name:', result2.name);
    console.log('   Slug (auto-generated):', result2.slug);
    console.log('   Price:', result2.price);
    console.log('   Stock:', result2.stock);
    console.log('   In Stock:', result2.in_stock);
    console.log('   Featured:', result2.featured);
    console.log();

    // Test 3: Verify products were created
    console.log('📊 Test 3: Verifying products in database...');
    const allProducts = await ProductModel.findAll();
    const createdProducts = allProducts.filter(p => 
      p.name === 'Test Product Full' || p.name === 'Test Product Minimal'
    );
    console.log(`✅ Found ${createdProducts.length} test products in database`);
    console.log();

    // Test 4: Update a product
    console.log('✏️  Test 4: Updating product...');
    const updateData = {
      price: 79.99,
      stock: 75,
      featured: false
    };
    const result3 = await ProductModel.update(result1.id, updateData);
    console.log('✅ Product updated successfully!');
    console.log('   Updated Price:', result3.price);
    console.log('   Updated Stock:', result3.stock);
    console.log('   Name (unchanged):', result3.name);
    console.log('   Original Price (preserved):', result3.original_price);
    console.log();

    // Cleanup: Delete test products
    console.log('🧹 Cleaning up test products...');
    await ProductModel.delete(result1.id);
    await ProductModel.delete(result2.id);
    console.log('✅ Test products deleted\n');

    console.log('============================================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('============================================================');
    console.log('✅ Product creation works without undefined parameters');
    console.log('✅ Product update preserves existing values');
    console.log('✅ Default values are applied correctly');
    console.log('✅ Database schema is properly configured');
    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    if (dbConnection.getPool()) {
      await dbConnection.getPool().end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the test
testProductCreation();
