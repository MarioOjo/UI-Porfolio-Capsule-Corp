const database = require('../src/config/database');
require('dotenv').config();

async function migrateTables() {
  console.log('🚀 Starting returns table migration...');
  
  await database.initialize();
  console.log('✅ Connected to Railway MySQL');
  
  try {
    
    // Create returns table
    console.log('📋 Creating returns table...');
    await database.executeQuery(`
      CREATE TABLE IF NOT EXISTS returns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        return_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        order_id INT NOT NULL,
        order_number VARCHAR(50) NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        refund_amount DECIMAL(10, 2) DEFAULT 0.00,
        refund_method VARCHAR(50),
        admin_notes TEXT,
        customer_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        processed_by INT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_order_id (order_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Returns table created');
    
    // Create return_items table
    console.log('📋 Creating return_items table...');
    await database.executeQuery(`
      CREATE TABLE IF NOT EXISTS return_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        return_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(500),
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        reason TEXT,
        condition_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_return_id (return_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Return_items table created');
    
    // Add indexes
    console.log('📋 Adding indexes...');
    try {
      await database.executeQuery(`CREATE INDEX idx_return_number ON returns(return_number)`);
    } catch (e) {
      console.log('ℹ️  idx_return_number already exists');
    }
    try {
      await database.executeQuery(`CREATE INDEX idx_order_number ON returns(order_number)`);
    } catch (e) {
      console.log('ℹ️  idx_order_number already exists');
    }
    console.log('✅ Indexes created');
    
    // Verify tables
    const tables = await database.executeQuery(`SHOW TABLES LIKE 'return%'`);
    console.log('\n📊 Created tables:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await database.closeConnection();
  }
}

migrateTables();
