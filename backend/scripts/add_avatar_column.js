const db = require('../src/config/database');

async function addAvatarColumn() {
  try {
    // Initialize database connection
    await db.initialize();
    console.log('✅ Database connected');

    // Check if avatar column already exists
    const [columns] = await db.pool.query(
      "SHOW COLUMNS FROM users LIKE 'avatar'"
    );

    if (columns.length > 0) {
      console.log('⚠️  Avatar column already exists');
      process.exit(0);
    }

    // Add avatar column
    await db.executeQuery(`
      ALTER TABLE users 
      ADD COLUMN avatar VARCHAR(50) DEFAULT 'goku' AFTER last_name
    `);
    console.log('✅ Avatar column added to users table');

    // Update existing users to have the default avatar
    await db.executeQuery(`
      UPDATE users SET avatar = 'goku' WHERE avatar IS NULL
    `);
    console.log('✅ Existing users updated with default avatar');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding avatar column:', error.message);
    process.exit(1);
  }
}

addAvatarColumn();
