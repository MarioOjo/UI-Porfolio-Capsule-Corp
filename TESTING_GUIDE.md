# Complete User Flow Testing Guide

## What Was Fixed (Nov 10, 2025)

### Critical Bugs Fixed:
1. **Order Creation Not Working** - Checkout was simulating orders, not actually calling backend API
2. **Database Schema Missing** - `customer_name`, `customer_email`, `customer_phone` columns were missing from orders table
3. **OrderModel Bug** - Was trying to read customer info from non-existent metadata JSON
4. **Validation Mismatches** - Field names didn't match between frontend and validator

### Files Changed:
- `frontend/src/pages/Checkout.jsx` - Now calls API with correct field names
- `backend/src/models/OrderModel.js` - Now reads customer fields correctly
- `backend/sql/014_add_customer_fields_to_orders.sql` - Added missing columns
- `backend/src/utils/DatabaseMigration.js` - Fixed migration file list

---

## 🧪 COMPLETE TESTING CHECKLIST

### Part 1: Customer Order Flow (Test as Vegeta)

#### Step 1: Login
- [ ] Go to `/auth`
- [ ] Login with: `vegeta@capsulecorp.com` / `Vegeta2025!`
- [ ] Verify dashboard loads
- [ ] Check that cart persists if items were added before

#### Step 2: Browse & Add to Cart
- [ ] Go to Products page
- [ ] Browse different categories (Capsules, Equipment, etc.)
- [ ] Click on a product to view details
- [ ] Add 2-3 different products to cart
- [ ] Verify cart icon shows correct count
- [ ] Open cart and verify:
  - [ ] All products display
  - [ ] Quantities can be changed
  - [ ] Prices are correct
  - [ ] Subtotal calculates correctly

#### Step 3: Checkout Process
- [ ] Click "Proceed to Checkout"
- [ ] **Shipping Information:**
  - [ ] Full Name: Vegeta Prince
  - [ ] Email: vegeta@capsulecorp.com
  - [ ] Phone: +27 12 345 6789
  - [ ] Address: 123 Capsule Street
  - [ ] City: West City
  - [ ] State/Province: Gauteng
  - [ ] Zip: 0001
  - [ ] Country: South Africa
  - [ ] Click "Continue to Payment"

- [ ] **Payment Information:**
  - [ ] Select payment method: Credit Card
  - [ ] Card Number: 4242 4242 4242 4242
  - [ ] Expiry: 12/25
  - [ ] CVV: 123
  - [ ] Click "Continue to Review"

- [ ] **Review Order:**
  - [ ] Verify all items are listed
  - [ ] Check subtotal, shipping, tax, total
  - [ ] Click "Place Order"

- [ ] **Order Confirmation:**
  - [ ] Success message appears
  - [ ] Order number displays (format: ORD-XXXXXXXXX-XXXXXXXXX)
  - [ ] Cart is cleared

#### Step 4: Check Order History
- [ ] Navigate to Profile → My Orders
- [ ] Verify new order appears
- [ ] Check order details:
  - [ ] Order number matches
  - [ ] Status is "Pending"
  - [ ] All items are listed
  - [ ] Total is correct
  - [ ] Customer name and email are correct

---

### Part 2: Admin Order Management

#### Step 1: Admin Login
- [ ] Logout from Vegeta account
- [ ] Login as: `admin@capsulecorp.com` / `Admin2025!`
- [ ] Verify admin dashboard loads
- [ ] Check statistics display (total orders, revenue, etc.)

#### Step 2: View All Orders
- [ ] Navigate to "Order Management"
- [ ] Verify Vegeta's order appears in the list
- [ ] Check the order shows:
  - [ ] Order number
  - [ ] Customer Name: Vegeta Prince
  - [ ] Customer Email: vegeta@capsulecorp.com
  - [ ] Status: Pending
  - [ ] Total amount
  - [ ] Date/time created

#### Step 3: Update Order Status
- [ ] Find Vegeta's order
- [ ] Click status dropdown
- [ ] Change to "Processing"
- [ ] Verify success message
- [ ] Refresh page, status should still be "Processing"

#### Step 4: Add Tracking Information
- [ ] Click the "👁️ View Details" button on Vegeta's order
- [ ] Order details modal opens
- [ ] Scroll to "Tracking Information" section
- [ ] Enter:
  - [ ] Tracking Number: `TRK-12345-ZA`
  - [ ] Carrier: `DHL Express`
- [ ] Click "Update Tracking"
- [ ] Verify success message
- [ ] Close modal

#### Step 5: Add Admin Notes (Optional)
- [ ] Open order details again
- [ ] Scroll to "Admin Notes" section
- [ ] Enter: "Verified payment. Preparing shipment."
- [ ] Click "Update Notes"
- [ ] Verify success message

#### Step 6: Change Status to Shipped
- [ ] In the orders table, change status dropdown to "Shipped"
- [ ] Verify success message

---

### Part 3: Verify Customer Sees Updates

#### Step 1: Login as Customer
- [ ] Logout from admin
- [ ] Login as: `vegeta@capsulecorp.com` / `Vegeta2025!`

#### Step 2: Check Order History
- [ ] Go to My Orders
- [ ] Find the order
- [ ] Verify:
  - [ ] Status is now "Shipped"
  - [ ] Tracking number displays: `TRK-12345-ZA`
  - [ ] Carrier shows: `DHL Express`
  - [ ] Can click tracking number (if link enabled)

---

### Part 4: Admin User Management

#### Step 1: View All Users
- [ ] Login as admin
- [ ] Navigate to "Manage Users"
- [ ] Verify users display:
  - [ ] Vegeta's account appears
  - [ ] User email, role, registration date show
  - [ ] Total orders count is correct

#### Step 2: Search Users
- [ ] Use search bar to find "vegeta"
- [ ] Verify Vegeta's account appears in results
- [ ] Clear search, all users return

#### Step 3: View User Details
- [ ] Click on Vegeta's user row or "View Details"
- [ ] Verify user information:
  - [ ] Email, name, registration date
  - [ ] Order history for this user
  - [ ] Total spent

---

### Part 5: Admin Product Management

#### Step 1: View Products
- [ ] Navigate to "Product Management"
- [ ] Verify all products display
- [ ] Check pagination works (if many products)

#### Step 2: Create Test Product
- [ ] Click "Add New Product"
- [ ] Fill in:
  - [ ] Name: Test Capsule
  - [ ] Description: Testing product creation
  - [ ] Category: Capsules
  - [ ] Price: 1000
  - [ ] Stock: 50
  - [ ] Power Level: 5000
- [ ] Click "Create Product"
- [ ] Verify success message
- [ ] Product appears in list

#### Step 3: Edit Product
- [ ] Find "Test Capsule" in product list
- [ ] Click "Edit" button
- [ ] Change price to 1500
- [ ] Click "Update Product"
- [ ] Verify success message
- [ ] Price updated in list

#### Step 4: Delete Test Product
- [ ] Find "Test Capsule"
- [ ] Click "Delete" button
- [ ] Confirm deletion
- [ ] Verify product removed from list

---

## 🔍 What to Check For (Error Scenarios)

### Common Issues:
1. **Orders not appearing**: Check browser console for errors
2. **Validation errors**: Ensure all required fields are filled
3. **401 Unauthorized**: Token might be expired, try logging out and back in
4. **500 Server errors**: Check backend logs for database issues

### Browser Console Checks:
- Open Developer Tools (F12)
- Go to Console tab
- Look for red errors
- Check Network tab for failed API calls

### Expected Success Indicators:
- ✅ Green success notifications
- ✅ Data appears immediately after actions
- ✅ Page refreshes show persisted changes
- ✅ No red error messages in console

---

## 🚀 Quick Test Credentials

**Customer Account (Vegeta):**
- Email: `vegeta@capsulecorp.com`
- Password: `Vegeta2025!`

**Admin Account:**
- Email: `admin@capsulecorp.com`  
- Password: `Admin2025!`

---

## 📊 Expected Results Summary

After completing all tests, you should have:

1. ✅ New order in database with:
   - Customer name: Vegeta Prince
   - Customer email: vegeta@capsulecorp.com
   - Status: Shipped
   - Tracking: TRK-12345-ZA (DHL Express)

2. ✅ Order visible in:
   - Customer order history (with tracking info)
   - Admin order management (with full details)

3. ✅ All admin functions working:
   - View/search orders
   - Update order status
   - Add tracking information
   - Add admin notes
   - View user list
   - Create/Edit/Delete products

---

## 🐛 If Something Fails

1. **Check Railway Logs** (for production)
   - Go to Railway dashboard
   - Check deployment logs
   - Look for error messages

2. **Check Local Logs** (if testing locally)
   - Backend terminal: Look for database errors
   - Frontend terminal: Look for build errors
   - Browser console: Look for API errors

3. **Database Issues**
   - Verify migration ran: `014_add_customer_fields_to_orders.sql`
   - Check if columns exist: `DESCRIBE orders;`
   - Verify data: `SELECT * FROM orders ORDER BY id DESC LIMIT 5;`

4. **Common Fixes**
   - Clear browser cache and cookies
   - Restart both servers
   - Check environment variables are set
   - Verify database connection

---

## ✅ Success Criteria

The complete user flow works when:
1. Customer can place an order that saves to database
2. Order appears in customer's order history with correct info
3. Admin can see all orders with customer details
4. Admin can update order status
5. Admin can add tracking number
6. Customer can see status updates and tracking info
7. All admin CRUD operations work (users, products, orders)

---

**Last Updated:** November 10, 2025  
**Status:** All critical bugs fixed, ready for testing
