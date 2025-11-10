# Fix: Orders 401 Unauthorized Error

## Problem
The orders page is showing 401 (Unauthorized) errors repeatedly because your JWT token doesn't include the `role` field.

## Root Cause
Your current JWT token was created before we added the `role` field to tokens. The backend now requires the `role` field to be present in the token to access admin endpoints like `/api/orders`.

## ✅ Solution: Refresh Your Token

### Option 1: Quick Fix (Logout and Login)

1. **Go to your site** (http://localhost:5173)
2. **Click your profile** or find the logout button
3. **Logout**
4. **Login again** with your admin credentials:
   - Email: `mario@capsulecorp.com` or `admin@capsulecorp.com`
   - Password: Your admin password
5. **Go to /admin/orders** - it should now work!

### Option 2: Clear localStorage (Browser Console)

1. **Open Browser Developer Tools** (F12 or Right-click → Inspect)
2. **Go to Console tab**
3. **Run this command:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```
4. **Login again** with your admin credentials

### Option 3: Manual localStorage Clear

1. **Open Browser Developer Tools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Click on Local Storage** → `http://localhost:5173`
4. **Delete the `authToken` or `token` item**
5. **Refresh the page**
6. **Login again**

---

## Why This Happens

### Old Token Structure (Before Fix):
```json
{
  "id": 1,
  "email": "mario@capsulecorp.com"
}
```

### New Token Structure (After Fix):
```json
{
  "id": 1,
  "email": "mario@capsulecorp.com",
  "role": "admin"  ← THIS WAS ADDED
}
```

The backend's `requireAdmin` middleware now checks for this `role` field:
```javascript
if (!decoded.role || decoded.role !== 'admin') {
  return res.status(403).json({ 
    error: 'Access denied. Admin privileges required.' 
  });
}
```

---

## Verification

After logging in again, check your token:

1. **Open Browser Console**
2. **Run:**
   ```javascript
   const token = localStorage.getItem('authToken') || localStorage.getItem('token');
   const decoded = JSON.parse(atob(token.split('.')[1]));
   console.log('Token payload:', decoded);
   ```
3. **You should see:**
   ```javascript
   {
     id: 1,
     email: "mario@capsulecorp.com",
     role: "admin",  ← Should be present now
     iat: 1699999999,
     exp: 1700086399
   }
   ```

---

## If Still Not Working

If the orders page still shows 401 errors after logging in again:

### Check 1: Verify Your User Has Admin Role

Run this in your terminal:
```powershell
node backend\scripts\comprehensive_admin_fix.js
```

Look for:
```
✅ mario@capsulecorp.com - ADMIN ROLE CONFIRMED
```

### Check 2: Check Backend Logs

Look at your backend terminal for errors when accessing `/api/orders`

### Check 3: Verify Token is Being Sent

1. Open Browser DevTools → Network tab
2. Click on a failed `/api/orders` request
3. Click **Headers** tab
4. Look for `Authorization: Bearer eyJ...` in Request Headers
5. If missing, the frontend isn't sending the token

---

## Prevention

This is a **one-time issue** that happens when the token structure changes. After you login with the new token structure, this won't happen again unless:

1. The backend token structure changes again
2. Your token expires (default: 7 days)
3. You manually delete your token from localStorage

---

## Quick Reference

**Fastest Fix:** Logout → Login
**Time Required:** 30 seconds
**Will This Happen Again?:** No, once you have a token with the `role` field

