const database = require('../src/config/database');
const bcrypt = require('bcrypt');

async function checkAdmin() {
  try {
    await database.initialize();
    console.log('✅ Database connected\n');

    // Check for admin users
    const admins = await database.executeQuery(
      "SELECT id, email, role, created_at FROM users WHERE email LIKE '%admin%' OR role = 'admin'"
    );

    console.log('📋 Admin Users Found:', admins.length);
    console.log(JSON.stringify(admins, null, 2));

    // Test password for admin@capsulecorp.com
    const adminUser = await database.executeQuery(
      "SELECT id, email, password_hash, role FROM users WHERE email = 'admin@capsulecorp.com'"
    );

    if (adminUser.length > 0) {
      console.log('\n🔐 Testing password for admin@capsulecorp.com');
      const user = adminUser[0];
      
      // Test with Admin2025!
      const testPassword = 'Admin2025!';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      
      console.log(`Password "${testPassword}" is ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log('Role:', user.role);
      
      if (!isValid) {
        console.log('\n⚠️  Password mismatch detected!');
        console.log('Would you like to reset the password? (Run reset_admin_password.js)');
      }
    } else {
      console.log('\n❌ admin@capsulecorp.com not found!');
      console.log('Run seed_admin_roles.js to create admin user');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
