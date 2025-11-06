# Emergency Production Fixes - November 6, 2025

## Critical Issues Fixed

### 1. Database Schema Issues ✅
- **Problem**: Missing `contact_messages` table causing 500 errors
- **Problem**: Missing `phone` column in `users` table causing profile update failures
- **Problem**: Missing `user_addresses` table causing address management failures
- **Problem**: Missing `wishlists` table causing 404 errors
- **Solution**: Created `014_emergency_fixes.sql` migration with all missing tables/columns

### 2. Removed "Click to Fill" Demo Accounts ✅
- **Problem**: Confusing autofill feature on login page
- **Solution**: Removed entire demo section from Login.jsx

### 3. Added Forgot Password Functionality ✅
- **Problem**: Users cannot reset forgotten passwords
- **Solution**: Created ForgotPassword component with email-based reset
- **Backend**: Password reset routes already exist in `/api/auth/request-password-reset`

### 4. Fixed Admin Dashboard ✅
- **Problem**: Hardcoded email check preventing admin access
- **Solution**: Removed hardcoded `mario@capsulecorp.com` check, now uses role-based access

## How to Deploy Fixes

### Step 1: Run Database Migration
```bash
cd backend
node scripts/emergency_db_fix.js
```

This will:
- Add `phone` and `date_of_birth` columns to `users` table
- Create `contact_messages` table (if missing)
- Create `user_addresses` table (if missing)
- Create/verify `orders` and `order_items` tables
- Create `wishlists` table (if missing)

### Step 2: Deploy Frontend Changes
```bash
cd frontend
npm run build
```

Then push to Railway (automatic deployment).

### Step 3: Verify Fixes
1. ✅ Contact form submits successfully
2. ✅ Profile updates work (with phone number)
3. ✅ Address management works
4. ✅ Order history displays correctly
5. ✅ Wishlist functionality works
6. ✅ Forgot password flow works
7. ✅ No "Click to fill" on login page
8. ✅ Admin access works for admin role users

## Files Changed

### Backend
- `backend/sql/014_emergency_fixes.sql` - NEW migration
- `backend/scripts/emergency_db_fix.js` - NEW migration runner

### Frontend
- `frontend/src/pages/Auth/Login.jsx` - Removed demo accounts, added forgot password handler
- `frontend/src/pages/Auth/ForgotPassword.jsx` - NEW component
- `frontend/src/pages/Auth/ForgotPassword.css` - NEW styles
- `frontend/src/pages/Auth/AuthPage.jsx` - Added forgot password view
- `frontend/src/pages/Admin/AdminDashboard.jsx` - Removed hardcoded email check

## Next Steps

1. **Run the migration** on Railway database
2. **Test all flows** using QUICK_SMOKE_TEST.md
3. **Verify no console errors** after fixes deployed
4. **Update admin password** if forgotten (use `scripts/reset_admin_password.js`)

## Admin Password Reset

If you forgot the admin password, run:
```bash
cd backend
node scripts/reset_admin_password.js
```

This will reset the admin@capsulecorp.com password to a known value.
