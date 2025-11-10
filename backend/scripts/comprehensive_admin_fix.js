/**
 * Comprehensive Admin System Fix Script
 * 
 * This script will:
 * 1. Check if 'role' column exists in users table
 * 2. Add 'role' column if missing
 * 3. Update specified admin emails to have admin role
 * 4. Verify cart_items table exists
 * 5. Create cart_items table if missing
 * 6. Test database connectivity
 * 7. Verify all critical tables exist
 */

require('dotenv').config();
const database = require('../src/config/database');
const UserModel = require('../src/models/UserModel');

// Admin emails to promote (from env or defaults)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'mario@capsulecorp.com,admin@capsulecorp.com')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

console.log('🚀 Starting Comprehensive Admin System Fix...\n');
console.log(`📧 Admin emails to configure: ${ADMIN_EMAILS.join(', ')}\n`);

async function checkColumnExists(tableName, columnName) {
  try {
    const query = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ? 
        AND COLUMN_NAME = ?
    `;
    const results = await database.executeQuery(query, [tableName, columnName]);
    return results.length > 0;
  } catch (error) {
    console.error(`❌ Error checking column ${columnName} in ${tableName}:`, error.message);
    return false;
  }
}

async function checkTableExists(tableName) {
  try {
    const query = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
    `;
    const results = await database.executeQuery(query, [tableName]);
    return results.length > 0;
  } catch (error) {
    console.error(`❌ Error checking table ${tableName}:`, error.message);
    return false;
  }
}

async function addRoleColumn() {
  try {
    console.log('📝 Adding "role" column to users table...');
    
    // Try MySQL 8+ syntax first
    try {
      await database.executeQuery(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role VARCHAR(32) NOT NULL DEFAULT 'user'
      `);
      console.log('✅ Role column added successfully (MySQL 8+ syntax)');
      return true;
    } catch (e) {
      // Fallback for older MySQL versions
      console.log('⚠️  MySQL 8+ syntax not supported, using fallback...');
      await database.executeQuery(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'user'
      `);
      console.log('✅ Role column added successfully (fallback syntax)');
      return true;
    }
  } catch (error) {
    // Column might already exist
    if (error.message.includes('Duplicate column')) {
      console.log('ℹ️  Role column already exists');
      return true;
    }
    console.error('❌ Failed to add role column:', error.message);
    return false;
  }
}

async function promoteAdmins() {
  try {
    console.log('\n👑 Promoting admin users...');
    
    for (const email of ADMIN_EMAILS) {
      try {
        // Check if user exists
        const user = await UserModel.findByEmail(email);
        
        if (!user) {
          console.log(`⚠️  User ${email} not found in database`);
          continue;
        }
        
        // Update role to admin
        await database.executeQuery(
          'UPDATE users SET role = ? WHERE LOWER(email) = LOWER(?)',
          ['admin', email]
        );
        
        console.log(`✅ Promoted ${email} to admin`);
      } catch (error) {
        console.error(`❌ Failed to promote ${email}:`, error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to promote admins:', error.message);
    return false;
  }
}

async function createCartItemsTable() {
  try {
    console.log('\n🛒 Creating cart_items table...');
    
    await database.executeQuery(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_user_id (user_id),
        INDEX idx_product_id (product_id),
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
    
    console.log('✅ cart_items table created/verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create cart_items table:', error.message);
    return false;
  }
}

async function createReturnsTable() {
  try {
    console.log('\n📦 Creating returns tables...');
    
    // Create returns table
    await database.executeQuery(`
      CREATE TABLE IF NOT EXISTS returns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        return_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        order_id INT,
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
        INDEX idx_user_id (user_id),
        INDEX idx_order_id (order_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_return_number (return_number),
        INDEX idx_order_number (order_number)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Create return_items table
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
        INDEX idx_return_id (return_id),
        INDEX idx_product_id (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ returns and return_items tables created/verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create returns tables:', error.message);
    return false;
  }
}

async function ensureProductsTable() {
  try {
    console.log('\n📦 Ensuring products table has all required columns...');
    
    // Create table if not exists
    await database.executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Accessories',
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        original_price DECIMAL(10,2) NULL,
        power_level INT NOT NULL DEFAULT 0,
        image VARCHAR(500) NULL,
        gallery TEXT NULL,
        in_stock TINYINT(1) NOT NULL DEFAULT 1,
        stock INT NOT NULL DEFAULT 0,
        featured TINYINT(1) NOT NULL DEFAULT 0,
        tags TEXT NULL,
        specifications TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_slug (slug),
        INDEX idx_featured (featured)
      )
    `);
    
    console.log('✅ Products table verified/created successfully');
    return true;
  } catch (error) {
    // Table might already exist, check for specific columns
    console.log('ℹ️  Products table exists, verifying columns...');
    
    // List of required columns with their definitions
    const requiredColumns = [
      { name: 'price', type: 'DECIMAL(10,2) NOT NULL DEFAULT 0.00' },
      { name: 'original_price', type: 'DECIMAL(10,2) NULL' },
      { name: 'power_level', type: 'INT NOT NULL DEFAULT 0' },
      { name: 'image', type: 'VARCHAR(500) NULL' },
      { name: 'gallery', type: 'TEXT NULL' },
      { name: 'in_stock', type: 'TINYINT(1) NOT NULL DEFAULT 1' },
      { name: 'stock', type: 'INT NOT NULL DEFAULT 0' },
      { name: 'featured', type: 'TINYINT(1) NOT NULL DEFAULT 0' },
      { name: 'tags', type: 'TEXT NULL' },
      { name: 'specifications', type: 'TEXT NULL' }
    ];
    
    for (const col of requiredColumns) {
      try {
        const exists = await checkColumnExists('products', col.name);
        if (!exists) {
          console.log(`  Adding column: ${col.name}`);
          await database.executeQuery(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
        }
      } catch (e) {
        // Column might already exist
        if (!e.message.includes('Duplicate column')) {
          console.warn(`  ⚠️  Could not add ${col.name}:`, e.message);
        }
      }
    }
    
    console.log('✅ Products table columns verified');
    return true;
  }
}

async function verifyTables() {
  console.log('\n📋 Verifying critical tables...');
  
  const criticalTables = [
    'users',
    'products',
    'orders',
    'order_items',
    'cart_items',
    'user_addresses',
    'contact_messages',
    'reviews',
    'returns'
  ];
  
  const results = [];
  
  for (const table of criticalTables) {
    const exists = await checkTableExists(table);
    results.push({ table, exists });
    
    if (exists) {
      console.log(`✅ ${table} - EXISTS`);
    } else {
      console.log(`❌ ${table} - MISSING`);
    }
  }
  
  return results;
}

async function verifyAdminSetup() {
  console.log('\n🔍 Verifying admin setup...');
  
  for (const email of ADMIN_EMAILS) {
    try {
      const user = await UserModel.findByEmail(email);
      
      if (!user) {
        console.log(`⚠️  ${email} - NOT FOUND IN DATABASE`);
        continue;
      }
      
      // Check role column
      const hasRole = 'role' in user || user.role !== undefined;
      
      if (!hasRole) {
        console.log(`⚠️  ${email} - User found but role column missing`);
        continue;
      }
      
      if (user.role === 'admin') {
        console.log(`✅ ${email} - ADMIN ROLE CONFIRMED`);
      } else {
        console.log(`⚠️  ${email} - Has role: ${user.role || 'user'} (not admin)`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${email}:`, error.message);
    }
  }
}

async function testDatabaseConnection() {
  try {
    console.log('\n🔌 Testing database connection...');
    await database.executeQuery('SELECT 1 as test');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function main() {
  try {
    // Initialize database
    console.log('🔌 Initializing database connection...');
    await database.initialize();
    console.log('✅ Database initialized\n');
    
    // Test connection
    const connected = await testDatabaseConnection();
    if (!connected) {
      console.error('\n❌ Cannot proceed without database connection');
      process.exit(1);
    }
    
    // Check if role column exists
    console.log('\n📊 Checking users table structure...');
    const roleExists = await checkColumnExists('users', 'role');
    
    if (!roleExists) {
      console.log('⚠️  Role column does not exist');
      await addRoleColumn();
    } else {
      console.log('✅ Role column exists');
    }
    
    // Promote admin users
    await promoteAdmins();
    
    // Check cart_items table
    console.log('\n📊 Checking cart_items table...');
    const cartExists = await checkTableExists('cart_items');
    
    if (!cartExists) {
      console.log('⚠️  cart_items table does not exist');
      await createCartItemsTable();
    } else {
      console.log('✅ cart_items table exists');
    }
    
    // Check returns table
    console.log('\n📊 Checking returns tables...');
    const returnsExist = await checkTableExists('returns');
    
    if (!returnsExist) {
      console.log('⚠️  returns tables do not exist');
      await createReturnsTable();
    } else {
      console.log('✅ returns tables exist');
    }
    
    // Ensure products table is properly configured
    await ensureProductsTable();
    
    // Verify all critical tables
    const tableResults = await verifyTables();
    
    const missingTables = tableResults.filter(r => !r.exists);
    if (missingTables.length > 0) {
      console.log('\n⚠️  WARNING: Some tables are missing:');
      missingTables.forEach(t => console.log(`   - ${t.table}`));
      console.log('\n   Run migrations to create missing tables.');
    }
    
    // Verify admin setup
    await verifyAdminSetup();
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Database: Connected`);
    console.log(`${roleExists ? '✅' : '⚠️ '} Role column: ${roleExists ? 'Exists' : 'Added'}`);
    console.log(`${cartExists ? '✅' : '⚠️ '} Cart table: ${cartExists ? 'Exists' : 'Created'}`);
    console.log(`📧 Admin emails configured: ${ADMIN_EMAILS.length}`);
    console.log('='.repeat(60));
    
    console.log('\n✅ Admin system fix completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Login with an admin email');
    console.log('   3. Test admin dashboard access');
    console.log('   4. Verify cart functionality\n');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await database.closeConnection();
    process.exit(0);
  }
}

// Run the script
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
