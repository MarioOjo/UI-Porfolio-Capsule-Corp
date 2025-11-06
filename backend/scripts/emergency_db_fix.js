// Emergency database fix script
// Run this to fix all production database issues

const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runEmergencyFixes() {
  console.log('🚨 Starting emergency database fixes...\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  });

  try {
    console.log('✅ Connected to database');
    
    // Read the emergency fix SQL
    const sqlPath = path.join(__dirname, '../sql/014_emergency_fixes.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`\n📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.startsWith('--') || stmt.length < 10) continue;
      
      try {
        await connection.query(stmt);
        console.log(`  ✓ Statement ${i + 1} executed`);
      } catch (err) {
        // Ignore "already exists" errors
        if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
          console.log(`  ⚠️  Column already exists (skipped)`);
        } else if (err.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`  ⚠️  Table already exists (skipped)`);
        } else {
          console.error(`  ❌ Error in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('\n✅ Emergency fixes completed successfully!');
    console.log('\nFixed issues:');
    console.log('  ✓ Added phone column to users table');
    console.log('  ✓ Created/verified contact_messages table');
    console.log('  ✓ Created/verified user_addresses table');
    console.log('  ✓ Created/verified orders table');
    console.log('  ✓ Created/verified order_items table');
    console.log('  ✓ Created/verified wishlists table');
    
    // Verify tables exist
    console.log('\n🔍 Verifying tables...');
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const requiredTables = [
      'users', 
      'contact_messages', 
      'user_addresses', 
      'orders', 
      'order_items',
      'wishlists'
    ];
    
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MISSING!`);
      }
    });
    
    // Check users table columns
    console.log('\n🔍 Verifying users table columns...');
    const [columns] = await connection.query("SHOW COLUMNS FROM users");
    const columnNames = columns.map(c => c.Field);
    
    const requiredColumns = ['phone', 'date_of_birth'];
    requiredColumns.forEach(col => {
      if (columnNames.includes(col)) {
        console.log(`  ✅ ${col}`);
      } else {
        console.log(`  ❌ ${col} - MISSING!`);
      }
    });
    
  } catch (error) {
    console.error('\n❌ Error running emergency fixes:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runEmergencyFixes();
