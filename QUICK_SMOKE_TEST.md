# Quick Smoke Test - 10 Minutes

## 🔥 Critical Path Testing (Do This First!)

**Time**: ~10 minutes  
**Goal**: Verify core functionality works

---

## Test 1: Authentication (2 min)

### Login Test
```
1. Go to: https://capsulecorps.dev
2. Click "Login"
3. Use test credentials:
   Email: [your-test-email]
   Password: [your-password]
4. ✅ PASS if: Name appears in navbar, no errors
5. ❌ FAIL if: Error message, stuck on login page
```

### Signup Test (if login fails)
```
1. Click "Sign Up"
2. Fill:
   Email: newuser@test.com
   Password: TestPass123!
   First Name: Test
   Last Name: User
3. ✅ PASS if: Auto-logged in, welcome message
4. ❌ FAIL if: Validation errors, 400/500 errors
```

**Status**: [ ] PASS  [ ] FAIL

---

## Test 2: Product Browsing (1 min)

```
1. Click "Products" in navbar
2. ✅ PASS if:
   - Products display with images
   - Prices show correctly
   - Can click product cards
3. ❌ FAIL if: Blank page, no products, errors

Status: [ ] PASS  [ ] FAIL
```

---

## Test 3: Add to Cart (2 min)

```
1. Click any product
2. Click "Add to Cart"
3. ✅ PASS if:
   - Success message shows
   - Cart badge shows "1"
   - No scary error messages
   - NOTE: 500 errors OK if cart still works locally
4. ❌ FAIL if: Can't add, cart breaks, page crashes

Status: [ ] PASS  [ ] FAIL
```

---

## Test 4: View Cart (1 min)

```
1. Click cart icon
2. ✅ PASS if:
   - Item shows with image and price
   - Can change quantity
   - Total calculates correctly
3. ❌ FAIL if: Empty cart, errors, can't view

Status: [ ] PASS  [ ] FAIL
```

---

## Test 5: Admin Access (2 min)

```
1. Logout
2. Login with admin credentials
3. ✅ PASS if:
   - "Admin Panel" shows in navbar
   - Can access /admin route
   - Dashboard loads with stats
4. ❌ FAIL if: No admin option, 403 forbidden

Status: [ ] PASS  [ ] FAIL
```

---

## Test 6: Admin CRUD (2 min)

### Create Product
```
1. Admin Panel → Products → Add New
2. Fill minimal required fields:
   Name: "Quick Test"
   Price: 1.00
   Category: Any
   Stock: 1
3. ✅ PASS if: Product created, shows in list
4. ❌ FAIL if: Validation errors, can't save

Status: [ ] PASS  [ ] FAIL
```

### Delete Product
```
1. Find "Quick Test" product
2. Click Delete → Confirm
3. ✅ PASS if: Product removed from list
4. ❌ FAIL if: Still shows, error on delete

Status: [ ] PASS  [ ] FAIL
```

---

## 📊 QUICK RESULTS

**Tests Passed**: _____ / 7  
**Tests Failed**: _____ / 7

### If All Pass (7/7): 🎉
✅ **Ready for presentation!**  
- Core functionality working
- Can proceed with full testing
- Focus on presentation practice

### If 5-6 Pass: ⚠️  
⚠️ **Minor issues, mostly OK**  
- Identify which test failed
- Check testing checklist for that section
- Fix critical issue before presentation

### If < 5 Pass: 🚨
🚨 **Need to debug immediately**  
- Multiple core features broken
- Check console errors
- Review backend logs on Railway
- May need to rollback changes

---

## 🐛 Quick Debug Guide

### Issue: Login Fails
**Check**:
- Backend deployed? (Railway logs)
- JWT_SECRET set in Railway env vars?
- Network tab shows 200 or 500?

**Fix**: Try signup instead, or check backend/routes/auth.js

---

### Issue: Cart Shows 500 Errors
**Check**:
- Does cart still work locally? (localStorage)
- Console shows "[CartContext] offline mode"?

**Fix**: Already implemented graceful degradation - cart should still work!

---

### Issue: Admin Panel Not Showing
**Check**:
- User role in JWT token
- Try logging in with admin email

**Fix**: Check backend/src/middleware/AuthMiddleware.js

---

### Issue: Products Don't Load
**Check**:
- Network tab - API call to /api/products
- Backend logs - database connection

**Fix**: Check backend/src/models/ProductModel.js

---

## 🎯 Next Steps After Smoke Test

### If All Tests Pass:
1. ✅ Mark "Test demo accounts" todo as complete
2. 📖 Move to full testing checklist (TESTING_CHECKLIST.md)
3. 🎤 Start presentation practice

### If Tests Fail:
1. 📝 Note which test failed
2. 🔍 Check detailed section in TESTING_CHECKLIST.md
3. 🐛 Debug using quick guide above
4. 🔄 Re-run smoke test after fixes

---

## 📞 EMERGENCY CONTACTS (For Presentation Day)

**If site is completely down**:
- Check Railway dashboard: https://railway.app
- Use backup screenshots
- Explain architecture from slides

**If authentication broken**:
- Show product browsing (works without auth)
- Use screenshots for logged-in views
- Explain security architecture verbally

**If admin broken**:
- Show code in IDE
- Use database queries to demonstrate CRUD
- Explain admin features from slides

---

**Remember**: The goal is to verify core flows work smoothly. Don't get stuck debugging minor issues during this quick test - note them and move on. You can address them in the full testing phase!

🚀 **Good luck with your testing!**
