/**
 * Check Product Images
 * Displays the image and gallery data for recent products
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const ProductModel = require('../src/models/ProductModel');
const dbConnection = require('../src/config/database');

async function checkProductImages() {
  try {
    console.log('🔍 Checking product images...\n');
    
    await dbConnection.initialize();
    
    const products = await ProductModel.findAll();
    
    if (products.length === 0) {
      console.log('No products found in database.');
      return;
    }
    
    console.log(`Found ${products.length} products. Showing most recent:\n`);
    
    const recentProducts = products.slice(0, 5);
    
    recentProducts.forEach((product, index) => {
      console.log(`${index + 1}. Product: ${product.name} (ID: ${product.id})`);
      console.log(`   Image field: ${product.image || '(empty)'}`);
      console.log(`   Gallery: ${JSON.stringify(product.gallery || [])}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log('');
    });
    
    // Count products with and without images
    const withImages = products.filter(p => p.image || (p.gallery && p.gallery.length > 0));
    const withoutImages = products.filter(p => !p.image && (!p.gallery || p.gallery.length === 0));
    
    console.log('📊 Summary:');
    console.log(`   Products with images: ${withImages.length}`);
    console.log(`   Products without images: ${withoutImages.length}`);
    console.log('');
    
    if (withoutImages.length > 0) {
      console.log('⚠️  Products without images:');
      withoutImages.slice(0, 10).forEach(p => {
        console.log(`   - ${p.name} (ID: ${p.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await dbConnection.getPool().end();
  }
}

checkProductImages();
