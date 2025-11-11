const database = require('../src/config/database');

async function fixAdminRole() {
  try {
    await database.initialize();
    console.log('✅ Database connected\n');

    // Show all admin@ users
    const users = await database.executeQuery(
      "SELECT id, email, role FROM users WHERE email = 'admin@capsulecorp.com'"
    );

    console.log('📋 Found users:', JSON.stringify(users, null, 2));

    if (users.length === 0) {
      console.log('❌ No user found with email admin@capsulecorp.com');
      process.exit(1);
    }

    // Update role to admin
    for (const user of users) {
      console.log(`\n🔧 Updating user ID ${user.id} to role="admin"`);
      await database.executeQuery(
        'UPDATE users SET role = ? WHERE id = ?',
        ['admin', user.id]
      );
      console.log('✅ Updated!');
    }

    // Verify
    const updated = await database.executeQuery(
      "SELECT id, email, role FROM users WHERE email = 'admin@capsulecorp.com'"
    );
    console.log('\n✅ Final result:', JSON.stringify(updated, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdminRole();
