// ============================================================================
// SIMPLIFIED DATABASE SYNC - Uses Node.js (no mysqldump required)
// ============================================================================
// This creates a sync script from your local database structure
// Run: node backend/scripts/generate-sync.js
// Then: Apply the generated SQL in TablePlus
// ============================================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Local database config - from your .env file
const LOCAL_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'capsule_db'
};

// Output files
const BACKUP_DIR = path.join(__dirname, '..', 'sql', 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const OUTPUT_FILE = path.join(BACKUP_DIR, `auto_sync_${TIMESTAMP}.sql`);

async function generateSyncScript() {
    console.log('🚀 Database Sync Script Generator\n');
    
    let connection;
    
    try {
        // Create backup directory if needed
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }
        
        console.log('📡 Connecting to local database...');
        connection = await mysql.createConnection(LOCAL_CONFIG);
        console.log('✅ Connected\n');
        
        // Get all tables
        console.log('📋 Fetching table structures...');
        const [tables] = await connection.execute(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = ?
            ORDER BY TABLE_NAME
        `, [LOCAL_CONFIG.database]);
        
        console.log(`✅ Found ${tables.length} tables\n`);
        
        let syncScript = `-- ============================================================================
-- AUTO-GENERATED SYNC SCRIPT
-- Generated: ${new Date().toISOString()}
-- Source: Local database (${LOCAL_CONFIG.database})
-- Target: Railway production
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Open TablePlus and connect to Railway database
-- 2. Copy this entire script
-- 3. Execute in TablePlus
-- 4. Verify with the queries at the bottom
-- ============================================================================

SET FOREIGN_KEY_CHECKS=0;

`;
        
        // For each table, get CREATE TABLE statement
        for (const { TABLE_NAME } of tables) {
            console.log(`   Processing: ${TABLE_NAME}`);
            
            const [createResult] = await connection.execute(`SHOW CREATE TABLE \`${TABLE_NAME}\``);
            const createStatement = createResult[0]['Create Table'];
            
            // Modify CREATE TABLE to use IF NOT EXISTS
            const modifiedCreate = createStatement.replace(
                /CREATE TABLE `([^`]+)`/,
                'CREATE TABLE IF NOT EXISTS `$1`'
            );
            
            syncScript += `\n-- Table: ${TABLE_NAME}\n`;
            syncScript += modifiedCreate + ';\n';
        }
        
        syncScript += `
SET FOREIGN_KEY_CHECKS=1;

-- ============================================================================
-- IMPORTANT: SET ADMIN ROLES
-- ============================================================================

-- Update admin users
UPDATE users SET role = 'admin' WHERE email IN (
    'admin@capsulecorp.com',
    'mario@capsulecorp.com'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- 1. Check all tables exist
SHOW TABLES;

-- 2. Count admin users
SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin';

-- 3. Show admin users
SELECT id, email, username, role FROM users WHERE role = 'admin';

-- 4. Check orders table
SELECT COUNT(*) as order_count FROM orders;

-- 5. Check products
SELECT COUNT(*) as product_count FROM products;

-- 6. Check user_addresses structure
DESCRIBE user_addresses;

-- 7. Verify key tables exist
SELECT 
    COUNT(DISTINCT table_name) as table_count
FROM information_schema.tables 
WHERE table_schema = DATABASE()
    AND table_name IN (
        'users', 'products', 'orders', 'order_items', 
        'user_addresses', 'cart_items', 'reviews', 
        'order_status_history', 'roles'
    );

-- Should return 9 if all key tables exist

-- ============================================================================
-- SYNC COMPLETE!
-- ============================================================================
`;
        
        // Write to file
        fs.writeFileSync(OUTPUT_FILE, syncScript, 'utf8');
        
        console.log('\n✅ Sync script generated!\n');
        console.log('📄 File:', OUTPUT_FILE);
        console.log(`📊 Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
        console.log('\n📋 Next steps:');
        console.log('   1. Open TablePlus');
        console.log('   2. Connect to Railway database');
        console.log('   3. Open this file and execute it');
        console.log('   4. Check verification queries at the bottom');
        console.log('\n🎉 Done!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nStack:', error.stack);
        process.exit(1);
        
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run it
generateSyncScript();
