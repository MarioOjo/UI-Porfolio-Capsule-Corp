# 🚀 Railway Production Database Sync Guide

This guide helps you sync your local database changes to Railway production using TablePlus.

## 📋 Prerequisites

- [x] TablePlus installed and connected to Railway database
- [x] Railway database credentials configured in TablePlus

## 🔧 Step-by-Step Process

### **Step 1: Backup Current Production Database (IMPORTANT!)**

Before making any changes, create a backup:

1. Open TablePlus
2. Connect to Railway database
3. Right-click database name → **Export**
4. Save as: `railway_backup_2025-11-11.sql`

### **Step 2: Run Pre-Sync Verification**

This shows what will change:

1. Open `backend/sql/VERIFY_BEFORE_SYNC.sql` in TablePlus
2. Execute the entire script
3. Review the results to see:
   - Missing columns
   - Users without roles
   - Missing indexes

### **Step 3: Run the Sync Script**

This applies all local changes to production:

1. Open `backend/sql/SYNC_PRODUCTION.sql` in TablePlus
2. **Read through the script** to understand what it does
3. Execute the entire script (Cmd/Ctrl + Enter)
4. Check for any errors in the output

### **Step 4: Run Post-Sync Verification**

This confirms everything worked:

1. Open `backend/sql/VERIFY_AFTER_SYNC.sql` in TablePlus
2. Execute the entire script
3. **Check all items show "PASS"**
4. Review the data samples at the end

### **Step 5: Test the Application**

1. Go to your production site: https://invigorating-mercy-production-27ab.up.railway.app
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Try logging in with: `admin@capsulecorp.com` / `Admin2025!`
4. Verify you have admin access
5. Check:
   - ✅ Can access admin dashboard
   - ✅ Can view orders
   - ✅ Can manage products
   - ✅ Address book works
   - ✅ Order history displays correctly

## 📝 What Gets Updated

### **Tables Created:**
- `roles` - User role definitions

### **Columns Added:**

**users table:**
- `role` VARCHAR(50) - User role (user/admin/moderator)

**user_addresses table:**
- `is_default` BOOLEAN - Default address flag
- `full_name` VARCHAR(255) - Recipient name
- `phone` VARCHAR(50) - Contact phone
- `type` VARCHAR(50) - Address type (home/work/other)

**orders table:**
- `customer_name` VARCHAR(255) - Customer's full name
- `customer_email` VARCHAR(255) - Customer's email
- `customer_phone` VARCHAR(50) - Customer's phone

**products table:**
- `category` VARCHAR(100) - Product category

### **Data Updates:**
- All users get default role of 'user'
- admin@capsulecorp.com upgraded to 'admin' role
- mario@capsulecorp.com upgraded to 'admin' role
- All addresses get default type of 'home'

### **Indexes Created:**
- Performance indexes on users, orders, products, addresses
- Email, role, status indexes for fast queries

## ⚠️ Troubleshooting

### **If you get "column already exists" errors:**
- This is normal! The script uses `IF NOT EXISTS` so it's safe to run multiple times
- Just continue to the next statement

### **If admin login still fails:**
Run this query in TablePlus:
```sql
-- Check admin user
SELECT id, email, role FROM users WHERE email = 'admin@capsulecorp.com';

-- If role is not 'admin', fix it:
UPDATE users SET role = 'admin' WHERE email = 'admin@capsulecorp.com';
```

### **If address book doesn't work:**
Run this query:
```sql
-- Check address table structure
DESCRIBE user_addresses;

-- If columns are missing, run SYNC_PRODUCTION.sql again
```

### **If order history doesn't show images:**
Check that the frontend deployment completed:
- Railway → Deployments tab
- Wait for frontend service to finish deploying
- Hard refresh browser (Ctrl+Shift+R)

## 🎯 Success Criteria

After running the sync, you should have:

- ✅ Admin login works with proper role
- ✅ Address book can save addresses
- ✅ Order history shows images, prices, quantities
- ✅ Wishlist page loads (no 404)
- ✅ All database indexes created
- ✅ No errors in verification script

## 📊 Files Included

1. **VERIFY_BEFORE_SYNC.sql** - Check current state
2. **SYNC_PRODUCTION.sql** - Apply all changes
3. **VERIFY_AFTER_SYNC.sql** - Confirm success
4. **This README** - Step-by-step guide

## 🆘 Need Help?

If something goes wrong:
1. Restore from backup (`railway_backup_2025-11-11.sql`)
2. Review error messages in TablePlus
3. Check Railway logs for backend errors
4. Re-run individual sections of SYNC_PRODUCTION.sql

---

**Last Updated:** November 11, 2025  
**Database:** Railway MySQL (gondola.proxy.rlwy.net:38169/railway)
