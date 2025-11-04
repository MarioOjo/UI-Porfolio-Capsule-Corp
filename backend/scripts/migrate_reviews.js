#!/usr/bin/env node
/**
 * Script to run the reviews table migration
 * Usage: node backend/scripts/migrate_reviews.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('../src/config/database');

async function runMigration() {
  console.log('🚀 Starting reviews table migration...\n');

  try {
    // Initialize database connection
    await database.initialize();
    console.log('✅ Database connection established\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, '../sql/014_create_reviews_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executing migration SQL...\n');
    console.log(sql);
    console.log('\n');

    // Execute SQL
    await database.executeQuery(sql);
    
    console.log('✅ Reviews table migration completed successfully!\n');
    console.log('Created tables:');
    console.log('  - reviews');
    console.log('  - review_helpful_votes');
    console.log('\nYou can now:');
    console.log('  1. Submit product reviews');
    console.log('  2. Mark reviews as helpful');
    console.log('  3. View review statistics and ratings\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
