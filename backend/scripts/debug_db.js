require('dotenv').config();
const database = require('../src/config/database');

async function checkDatabase() {
  try {
    console.log('Connecting to database...');
    await database.initialize();
    
    // Check if products table exists and get its structure
    console.log('\n--- Checking products table structure ---');
    try {
      const tableInfo = await database.executeQuery('DESCRIBE products');
      console.log('Products table columns:');
      console.table(tableInfo);
    } catch (error) {
      console.log('Products table does not exist or error:', error.message);
    }
    
    // List all tables
    console.log('\n--- Listing all tables ---');
    const tables = await database.executeQuery('SHOW TABLES');
    console.log('Database tables:');
    console.table(tables);
    
    await database.closeConnection();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();