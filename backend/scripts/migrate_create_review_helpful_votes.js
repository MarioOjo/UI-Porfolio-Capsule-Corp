const db = require('../src/config/database');
const fs = require('fs');

async function run() {
  try {
    await db.initialize();
    const sql = fs.readFileSync(__dirname + '/../sql/018_create_review_helpful_votes.sql', 'utf8');
    await db.executeQuery(sql);
    console.log('Created review_helpful_votes table');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

run();
