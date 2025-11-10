require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./src/config/database');

async function runMigration() {
  try {
    await db.initialize();
    console.log('🔧 Running orders table fix migration...\n');
    
    const sqlPath = path.join(__dirname, 'sql', '014_fix_orders_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and run each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await db.executeQuery(statement);
          console.log('✅ Executed:', statement.substring(0, 60) + '...');
        } catch (error) {
          // IF NOT EXISTS might cause harmless errors
          if (!error.message.includes('Duplicate column')) {
            console.log('⚠️  Warning:', error.message);
          }
        }
      }
    }
    
    console.log('\n✅ Migration complete!\n');
    
    // Verify the structure
    console.log('🔍 Verifying table structure:\n');
    const structure = await db.executeQuery('DESCRIBE orders');
    const hasCustomerName = structure.some(col => col.Field === 'customer_name');
    const hasCustomerEmail = structure.some(col => col.Field === 'customer_email');
    
    console.log(`  customer_name: ${hasCustomerName ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`  customer_email: ${hasCustomerEmail ? '✅ EXISTS' : '❌ MISSING'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runMigration();
