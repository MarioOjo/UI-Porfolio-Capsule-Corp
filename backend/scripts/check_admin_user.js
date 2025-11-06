require('dotenv').config();
const db = require('../src/config/database');
const UserModel = require('../src/models/UserModel');

async function checkAdminUser() {
  try {
    await db.initialize();
    console.log('✅ Database connected');
    
    const email = 'admin@capsulecorp.com';
    console.log(`\n🔍 Checking for user: ${email}`);
    
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      console.log('❌ USER DOES NOT EXIST!');
      console.log('\n📝 TO FIX: Run this command:');
      console.log('node backend/scripts/reset_admin_password.js');
      process.exit(1);
    }
    
    console.log('\n✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role || 'user'}`);
    console.log(`   Status: ${user.status || 'active'}`);
    
    if (user.role !== 'admin') {
      console.log('\n⚠️  USER IS NOT ADMIN!');
      console.log('Run: node backend/scripts/seed_admin_roles.js');
    } else {
      console.log('\n✅ User has admin role');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdminUser();
