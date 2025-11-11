const database = require('../src/config/database');

async function checkDuplicates() {
  try {
    await database.initialize();
    console.log('✅ Database connected\n');

    // Show ALL users with admin email
    const users = await database.executeQuery(
      "SELECT id, email, role, username, created_at FROM users WHERE email LIKE '%admin%' ORDER BY id"
    );

    console.log('📋 All admin users:\n');
    console.table(users);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDuplicates();
