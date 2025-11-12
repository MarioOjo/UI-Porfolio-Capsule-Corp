// Script to print CREATE TABLE statements for reviews and users
const db = require('../src/config/database');

const tables = ['reviews', 'users'];

(async () => {
  await db.initialize();
  const pool = db.getPool();
  for (const table of tables) {
    try {
      const [rows] = await pool.query(`SHOW CREATE TABLE \`${table}\``);
      console.log(`\n--- ${table} ---`);
      console.log(rows[0]['Create Table']);
    } catch (err) {
      console.error(`Error for table ${table}:`, err.message);
    }
  }
  await db.closeConnection();
})();
