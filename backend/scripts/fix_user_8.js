const database = require('../src/config/database');

async function fixUserId8() {
  try {
    await database.initialize();
    console.log('✅ Database connected\n');

    // Update user ID 8 to admin role
    console.log('🔧 Updating user ID 8 to role="admin"...');
    await database.executeQuery(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', 8]
    );
    console.log('✅ Updated!\n');

    // Verify
    const user = await database.executeQuery(
      'SELECT id, email, role, username FROM users WHERE id = 8'
    );
    
    console.log('✅ User ID 8:');
    console.table(user);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserId8();
