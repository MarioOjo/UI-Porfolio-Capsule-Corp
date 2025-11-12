const db = require('../src/config/database');

async function run() {
  try {
    console.log('Initializing DB...');
    await db.initialize?.();
    console.log('Using config:', db.baseConfig ? db.baseConfig.database : 'n/a');

    const cols = await db.executeQuery("SHOW COLUMNS FROM reviews;");
    console.log('Columns in reviews table:');
    cols.forEach(c => console.log(`- ${c.Field} (${c.Type})`));

  const sample = await db.executeQuery('SELECT id, body AS comment FROM reviews LIMIT 5');
    console.log('Sample rows (id, comment):', sample);

    process.exit(0);
  } catch (err) {
    console.error('Error checking reviews table:', err.message);
    process.exit(1);
  }
}

run();
