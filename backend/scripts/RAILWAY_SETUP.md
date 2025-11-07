# Railway Admin Setup Guide

## Create admin@capsulecorp.com in Production

### Step 1: Access Railway Shell
1. Go to: https://railway.app/dashboard
2. Select your project: **UI-Porfolio-Capsule-Corp**
3. Click on your **backend** service
4. Click the **Shell** tab (or **Deploy** > **Shell**)

### Step 2: Run Admin Creation Script
Copy and paste this command in the Railway shell:

```bash
node scripts/create_admin.js
```

### Expected Output:
```
🔍 Checking database schema...
✅ Schema uses: role_id column
🔍 Checking if admin@capsulecorp.com already exists...
👤 Creating admin user...
✅ Admin user created successfully!

Admin Credentials:
  Email: admin@capsulecorp.com
  Password: Admin2025!
  Role: admin
```

### Step 3: Verify Admin Access
1. Go to: https://capsulecorps.dev/login
2. Enter:
   - Email: `admin@capsulecorp.com`
   - Password: `Admin2025!`
3. You should see the Admin Dashboard

### Troubleshooting

**If script fails with "Cannot find module":**
```bash
cd /app && node scripts/create_admin.js
```

**If you get "User already exists":**
The admin account is already created! Just try logging in.

**If you get database connection error:**
Wait 30 seconds and try again. Railway might be restarting services.

---

## Alternative: Manual SQL Creation

If the script doesn't work, you can create the user manually:

```bash
node -e "
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

(async () => {
  await db.initialize();
  
  const hashedPassword = await bcrypt.hash('Admin2025!', 12);
  
  await db.executeQuery(
    'INSERT INTO users (email, password, first_name, last_name, role_id) VALUES (?, ?, ?, ?, ?)',
    ['admin@capsulecorp.com', hashedPassword, 'Admin', 'User', 1]
  );
  
  console.log('✅ Admin user created!');
  await db.closeConnection();
})();
"
```

---

## Admin Account Details

- **Email**: admin@capsulecorp.com
- **Password**: Admin2025!
- **Role**: admin (role_id: 1)
- **Authorized via**: ADMIN_EMAILS environment variable

## What This Enables

✅ Access to `/admin` routes
✅ Dashboard with real statistics
✅ User management (view, edit, delete)
✅ Product management (CRUD operations)
✅ Order management (view all orders)
✅ Contact message management

---

## Security Note

This is a demonstration admin account for your capstone project. In a production environment, you would:
- Use a stronger password
- Enable 2FA
- Implement IP whitelisting
- Add audit logging for admin actions
