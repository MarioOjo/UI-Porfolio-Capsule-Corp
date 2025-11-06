# Capsule Corp - Comprehensive Testing Checklist

## 🎯 Complete User Flow Testing Guide

Test Date: November 5, 2025  
Site: https://capsulecorps.dev

---

## 🔐 AUTHENTICATION FLOWS

### ✅ Signup Flow (New User)
1. [ ] Navigate to site → Click "Sign Up"
2. [ ] Fill form:
   - [ ] Email: test@example.com
   - [ ] Password: TestUser123! (min 8 chars, uppercase, lowercase, number)
   - [ ] First Name: Test
   - [ ] Last Name: User
3. [ ] Click "Sign Up" button
4. [ ] **Expected**: Success message, auto-login, redirected to home
5. [ ] **Verify**: Name appears in navbar (top right)
6. [ ] **Check Console**: No errors

**Known Issues**:
- ✅ Fixed: Username validation now optional

---

### ✅ Login Flow (Existing User)
1. [ ] Logout (if logged in)
2. [ ] Click "Login" button
3. [ ] Enter credentials:
   - [ ] Email: (your test account)
   - [ ] Password: (your password)
4. [ ] Click "Login"
5. [ ] **Expected**: Welcome message, redirected to home
6. [ ] **Verify**: User name in navbar
7. [ ] **Check Console**: No errors

---

### ✅ Logout Flow
1. [ ] Click profile dropdown (top right)
2. [ ] Click "Logout"
3. [ ] **Expected**: Logged out, navbar shows "Login/Sign Up"
4. [ ] **Verify**: Cart preserved in localStorage
5. [ ] **Check Console**: No errors

---

## 🛍️ SHOPPING FLOW (Customer)

### ✅ Browse Products
1. [ ] Navigate to "Products" page
2. [ ] **Verify**: All products load with images
3. [ ] **Test Filters**:
   - [ ] Filter by category (Capsules, Training, etc.)
   - [ ] Sort by price (low to high, high to low)
   - [ ] Sort by newest
4. [ ] **Test Search**:
   - [ ] Search for "armor" → Should show Saiyan Armor
   - [ ] Search for "capsule" → Should show capsule products
5. [ ] **Check Console**: No errors

---

### ✅ View Product Detail
1. [ ] Click on any product card
2. [ ] **Verify Product Page Shows**:
   - [ ] Product name and image
   - [ ] Price and stock status
   - [ ] Description
   - [ ] Add to Cart button
   - [ ] Quantity selector
   - [ ] Reviews section (if any exist)
3. [ ] **Test Quantity Selector**:
   - [ ] Increment quantity
   - [ ] Decrement quantity
   - [ ] Try negative number → Should default to 1
4. [ ] **Check Console**: No errors

---

### ✅ Add to Cart
1. [ ] On product detail page, click "Add to Cart"
2. [ ] **Expected**: 
   - [ ] Success toast notification
   - [ ] Cart badge updates (shows item count)
   - [ ] Console log: `[CartContext] Adding to backend cart...`
3. [ ] **If Backend Cart Fails** (500 error):
   - [ ] Should show "offline mode" message
   - [ ] Item still added to local cart
   - [ ] No scary error messages
4. [ ] **Add Multiple Products**:
   - [ ] Go to another product
   - [ ] Add to cart
   - [ ] Cart badge should increase
5. [ ] **Check Console**: Should see cart logging, 500 errors are OK if gracefully handled

---

### ✅ Cart Management
1. [ ] Click cart icon (top right)
2. [ ] **Verify Cart Page Shows**:
   - [ ] All added items with images
   - [ ] Quantity for each item
   - [ ] Price per item
   - [ ] Subtotal
   - [ ] Shipping cost (free over $500 message)
   - [ ] Tax (8%)
   - [ ] Grand total
3. [ ] **Test Update Quantity**:
   - [ ] Change quantity of an item
   - [ ] **Verify**: Price recalculates automatically
4. [ ] **Test Remove Item**:
   - [ ] Click "Remove" on an item
   - [ ] **Verify**: Confirmation dialog appears
   - [ ] Confirm removal
   - [ ] **Verify**: Item removed, totals update
5. [ ] **Test Stock Validation**:
   - [ ] Try to set quantity higher than stock
   - [ ] **Expected**: Error message "Only X items available"
6. [ ] **Check Console**: Should see cart sync attempts

---

### ✅ Checkout Flow
1. [ ] **Prerequisites**: Must be logged in, have items in cart
2. [ ] In cart, click "Proceed to Checkout"
3. [ ] **If Not Logged In**: Should redirect to login
4. [ ] **Checkout Page Should Show**:
   - [ ] Order summary (items, prices, total)
   - [ ] Shipping address section
   - [ ] Payment method section (if implemented)
   - [ ] Place Order button
5. [ ] **Address Selection**:
   - [ ] If no saved addresses: Fill address form
   - [ ] If have addresses: Select from dropdown
   - [ ] Option to add new address
6. [ ] **Place Order**:
   - [ ] Click "Place Order" button
   - [ ] **Expected**: 
     - [ ] Loading indicator
     - [ ] Success message
     - [ ] Redirect to Order Confirmation page
     - [ ] Cart is now empty
7. [ ] **Verify Order Created**:
   - [ ] Note order ID from confirmation
   - [ ] Go to Profile → Order History
   - [ ] Order should appear with "Pending" status
8. [ ] **Check Console**: No errors during checkout

**Known Issues**:
- Cart may show 500 errors but should work with localStorage fallback

---

### ✅ Order History
1. [ ] Navigate to Profile → Order History
2. [ ] **Verify**: All past orders listed
3. [ ] **For Each Order**:
   - [ ] Order number/ID
   - [ ] Date placed
   - [ ] Status (Pending, Processing, Shipped, Delivered)
   - [ ] Total amount
   - [ ] View Details button
4. [ ] **Click Order Details**:
   - [ ] All items in order
   - [ ] Quantities and prices
   - [ ] Shipping address
   - [ ] Order timeline/status
5. [ ] **Check Console**: No errors

---

### ✅ Product Reviews
1. [ ] **Prerequisites**: Must be logged in and have purchased the product
2. [ ] Go to a product detail page (product you've ordered)
3. [ ] Scroll to Reviews section
4. [ ] **Submit Review**:
   - [ ] Click "Write a Review" button
   - [ ] Select star rating (1-5 stars)
   - [ ] Write review text (min 10 characters)
   - [ ] Click Submit
5. [ ] **Expected**:
   - [ ] Success message
   - [ ] Review appears in reviews section
   - [ ] Average rating updates
6. [ ] **Verify Review Shows**:
   - [ ] Your name
   - [ ] Star rating
   - [ ] Review text
   - [ ] Date posted
   - [ ] "Verified Purchase" badge (if applicable)
7. [ ] **Check Console**: No errors

---

### ✅ Wishlist/Favorites (If Implemented)
1. [ ] On product page, click "Add to Wishlist" ❤️
2. [ ] **Verify**: Heart icon fills/changes color
3. [ ] Navigate to Profile → Wishlist
4. [ ] **Verify**: Product appears in wishlist
5. [ ] **Test Remove**:
   - [ ] Click remove icon
   - [ ] Product removed from wishlist
6. [ ] **Check Console**: No errors

---

### ✅ Profile Management
1. [ ] Navigate to Profile → Profile Settings
2. [ ] **Verify Current Info Displays**:
   - [ ] Name
   - [ ] Email
   - [ ] Avatar (if set)
3. [ ] **Test Update Profile**:
   - [ ] Change first/last name
   - [ ] Save changes
   - [ ] **Verify**: Success message, changes reflected
4. [ ] **Test Change Password**:
   - [ ] Enter current password
   - [ ] Enter new password (must meet requirements)
   - [ ] Confirm new password
   - [ ] Submit
   - [ ] **Expected**: Success, logged out, redirected to login
   - [ ] Test login with new password
5. [ ] **Check Console**: No errors

---

### ✅ Address Book
1. [ ] Navigate to Profile → Address Book
2. [ ] **Add New Address**:
   - [ ] Click "Add Address"
   - [ ] Fill form:
     - [ ] Full name
     - [ ] Address line 1
     - [ ] Address line 2 (optional)
     - [ ] City
     - [ ] State/Province
     - [ ] ZIP/Postal code
     - [ ] Country
     - [ ] Phone number
   - [ ] Check "Set as default" (optional)
   - [ ] Save
3. [ ] **Verify**: Address appears in list
4. [ ] **Edit Address**:
   - [ ] Click edit icon
   - [ ] Modify address
   - [ ] Save
   - [ ] **Verify**: Changes saved
5. [ ] **Delete Address**:
   - [ ] Click delete icon
   - [ ] Confirm deletion
   - [ ] **Verify**: Address removed
6. [ ] **Check Console**: No errors

---

### ✅ Contact Form
1. [ ] Navigate to Contact page
2. [ ] **Fill Contact Form**:
   - [ ] Name: (auto-filled if logged in)
   - [ ] Email: (auto-filled if logged in)
   - [ ] Subject: "Test message" (min 3 characters)
   - [ ] Message: "This is a test message to verify the contact form works properly." (min 10 characters)
3. [ ] Click "Send Message"
4. [ ] **Expected**:
   - [ ] Success message: "Message sent successfully!"
   - [ ] Form clears
   - [ ] No 400 validation errors
5. [ ] **Check Console**: No errors

**Known Issues**:
- ✅ Fixed: Subject now requires min 3 chars (was 5)
- ✅ Fixed: timestamp and user_id now optional

---

## 👑 ADMIN FLOWS

### ✅ Admin Login
1. [ ] Logout (if logged in as customer)
2. [ ] Login with admin credentials
3. [ ] **Verify**: "Admin Panel" appears in navbar
4. [ ] **Check Console**: No errors

---

### ✅ Admin Dashboard
1. [ ] Click "Admin Panel" in navbar
2. [ ] **Verify Dashboard Shows**:
   - [ ] Total sales (amount)
   - [ ] Total orders (count)
   - [ ] Total customers (count)
   - [ ] Total products (count)
   - [ ] Revenue chart (if implemented)
   - [ ] Recent orders list
   - [ ] Low stock alerts
   - [ ] Top selling products
3. [ ] **Check Console**: No errors

---

### ✅ Admin - Product Management (CRUD)

#### CREATE Product
1. [ ] Admin Panel → Products → "Add New Product"
2. [ ] **Fill Product Form**:
   - [ ] Name: "Test Product"
   - [ ] Slug: "test-product" (auto-generated)
   - [ ] Description: "This is a test product"
   - [ ] Price: 99.99
   - [ ] Category: Select from dropdown
   - [ ] Stock: 50
   - [ ] Image: Upload or provide URL
   - [ ] Power Level: 9000 (optional)
   - [ ] Tags: "test, demo" (optional)
   - [ ] Featured: Check/uncheck
3. [ ] Click "Create Product"
4. [ ] **Expected**:
   - [ ] Success message
   - [ ] Redirected to product list
   - [ ] New product appears in list
5. [ ] **Verify on Frontend**:
   - [ ] Go to Products page
   - [ ] Search for "Test Product"
   - [ ] Should appear in results
6. [ ] **Check Console**: No errors

#### READ Products
1. [ ] Admin Panel → Products
2. [ ] **Verify List Shows**:
   - [ ] All products with images
   - [ ] Name, price, stock, category
   - [ ] Edit and Delete buttons
   - [ ] Pagination (if many products)
3. [ ] **Test Search/Filter**:
   - [ ] Search by name
   - [ ] Filter by category
   - [ ] Filter by stock status
4. [ ] **Click Product**:
   - [ ] Should show full details
5. [ ] **Check Console**: No errors

#### UPDATE Product
1. [ ] Admin Panel → Products → Find "Test Product"
2. [ ] Click "Edit" button
3. [ ] **Modify Fields**:
   - [ ] Change price to 79.99
   - [ ] Change stock to 25
   - [ ] Update description
4. [ ] Click "Save Changes"
5. [ ] **Expected**: Success message
6. [ ] **Verify**:
   - [ ] Changes reflected in admin list
   - [ ] Go to frontend product page
   - [ ] Price and stock updated
7. [ ] **Check Console**: No errors

#### DELETE Product
1. [ ] Admin Panel → Products → Find "Test Product"
2. [ ] Click "Delete" button
3. [ ] **Verify**: Confirmation dialog appears
4. [ ] Confirm deletion
5. [ ] **Expected**:
   - [ ] Success message
   - [ ] Product removed from list
6. [ ] **Verify on Frontend**:
   - [ ] Search for "Test Product"
   - [ ] Should not appear (or marked as unavailable)
7. [ ] **Check Console**: No errors

---

### ✅ Admin - Order Management
1. [ ] Admin Panel → Orders
2. [ ] **Verify Orders List Shows**:
   - [ ] Order ID
   - [ ] Customer name
   - [ ] Date
   - [ ] Total amount
   - [ ] Status
   - [ ] Actions (View, Update Status)
3. [ ] **View Order Details**:
   - [ ] Click on an order
   - [ ] **Verify**: All items, customer info, shipping address
4. [ ] **Update Order Status**:
   - [ ] Select order with "Pending" status
   - [ ] Change status to "Processing"
   - [ ] Save
   - [ ] **Verify**: Status updated
5. [ ] **Check Customer View**:
   - [ ] Login as customer who placed order
   - [ ] Go to Order History
   - [ ] **Verify**: Status shows "Processing"
6. [ ] **Check Console**: No errors

---

### ✅ Admin - User Management
1. [ ] Admin Panel → Users
2. [ ] **Verify Users List Shows**:
   - [ ] Username
   - [ ] Email
   - [ ] Role (customer/admin)
   - [ ] Join date
   - [ ] Actions (Edit, Delete)
3. [ ] **View User Details**:
   - [ ] Click on a user
   - [ ] **Verify**: Profile info, order history, addresses
4. [ ] **Update User Role** (if implemented):
   - [ ] Select a customer
   - [ ] Change role to "admin"
   - [ ] Save
   - [ ] **Verify**: User now has admin access
5. [ ] **Check Console**: No errors

---

### ✅ Admin - Contact Messages
1. [ ] Admin Panel → Contact Messages
2. [ ] **Verify Messages List Shows**:
   - [ ] Customer name
   - [ ] Email
   - [ ] Subject
   - [ ] Date
   - [ ] Status (New, In Progress, Resolved)
3. [ ] **View Message Details**:
   - [ ] Click on a message
   - [ ] **Verify**: Full message text, customer info
4. [ ] **Update Message Status**:
   - [ ] Change status to "In Progress"
   - [ ] Add admin notes (optional)
   - [ ] Save
   - [ ] **Verify**: Status updated
5. [ ] **Delete Message**:
   - [ ] Click delete
   - [ ] Confirm
   - [ ] **Verify**: Message removed
6. [ ] **Check Console**: No errors

---

### ✅ Admin - Reviews Management (If Implemented)
1. [ ] Admin Panel → Reviews
2. [ ] **Verify**: Can view all product reviews
3. [ ] **Test Moderation**:
   - [ ] Mark review as approved/rejected
   - [ ] Delete inappropriate reviews
4. [ ] **Check Console**: No errors

---

### ✅ Admin - Returns Management (If Implemented)
1. [ ] Admin Panel → Returns
2. [ ] **Verify**: List of return requests
3. [ ] **Process Return**:
   - [ ] View return details
   - [ ] Approve or reject with reason
   - [ ] Update status
4. [ ] **Check Console**: No errors

---

## 🔍 EDGE CASES & ERROR HANDLING

### ✅ Authentication Edge Cases
1. [ ] **Expired Token**:
   - [ ] Login, then manually delete token from localStorage
   - [ ] Try to access profile
   - [ ] **Expected**: Redirect to login
2. [ ] **Weak Password**:
   - [ ] Try signup with "test123"
   - [ ] **Expected**: Error about password requirements
3. [ ] **Duplicate Email**:
   - [ ] Try signup with existing email
   - [ ] **Expected**: Error "Email already exists"
4. [ ] **Invalid Email Format**:
   - [ ] Try signup with "notanemail"
   - [ ] **Expected**: Error "Invalid email format"

---

### ✅ Cart Edge Cases
1. [ ] **Out of Stock**:
   - [ ] Find product with 0 stock
   - [ ] Try to add to cart
   - [ ] **Expected**: Error message, can't add
2. [ ] **Exceed Stock**:
   - [ ] Add item with limited stock
   - [ ] Try to increase quantity beyond available
   - [ ] **Expected**: Error "Only X items available"
3. [ ] **Backend Down**:
   - [ ] If backend returns 500 errors
   - [ ] **Expected**: Cart still works with localStorage
   - [ ] Shows "offline mode" notices
4. [ ] **Empty Cart Checkout**:
   - [ ] Clear cart completely
   - [ ] Try to access checkout
   - [ ] **Expected**: Redirect or message "Cart is empty"

---

### ✅ Form Validation Edge Cases
1. [ ] **Contact Form**:
   - [ ] Subject with 2 chars → Error "min 3 characters"
   - [ ] Message with 5 chars → Error "min 10 characters"
   - [ ] Invalid email → Error "Valid email required"
2. [ ] **Review Form**:
   - [ ] Try to submit without rating → Error
   - [ ] Try to submit without text → Error

---

## 📱 RESPONSIVE DESIGN TESTING

### ✅ Mobile View (375px - 768px)
1. [ ] **Open DevTools** → Toggle device toolbar
2. [ ] **Test on iPhone SE (375px)**:
   - [ ] Navbar collapses to hamburger menu
   - [ ] Product cards stack vertically
   - [ ] Cart page readable and scrollable
   - [ ] Checkout form fields full width
   - [ ] Buttons are touch-friendly (min 44px)
3. [ ] **Check Console**: No errors

---

### ✅ Tablet View (768px - 1024px)
1. [ ] **Test on iPad (768px)**:
   - [ ] Navbar shows all links or partial collapse
   - [ ] Product cards in 2-column grid
   - [ ] Forms use available width appropriately
2. [ ] **Check Console**: No errors

---

### ✅ Desktop View (1024px+)
1. [ ] **Full Desktop (1920px)**:
   - [ ] All content visible without horizontal scroll
   - [ ] Product cards in 3-4 column grid
   - [ ] Max width containers prevent excessive stretching
2. [ ] **Check Console**: No errors

---

## 🔒 SECURITY TESTING

### ✅ Authorization Checks
1. [ ] **Customer Accessing Admin**:
   - [ ] Login as regular customer
   - [ ] Try to navigate to `/admin` directly
   - [ ] **Expected**: 403 Forbidden or redirect to home
2. [ ] **Unauthenticated Admin Access**:
   - [ ] Logout
   - [ ] Try to navigate to `/admin` directly
   - [ ] **Expected**: Redirect to login
3. [ ] **Admin-Only API Endpoints**:
   - [ ] Logout
   - [ ] Try to call `GET /api/admin/stats` (use browser console)
   - [ ] **Expected**: 401 Unauthorized

---

### ✅ SQL Injection Prevention
1. [ ] **Test Search Input**:
   - [ ] Search for: `'; DROP TABLE products; --`
   - [ ] **Expected**: No database errors, treated as normal search
2. [ ] **Test Login**:
   - [ ] Email: `admin@example.com' OR '1'='1`
   - [ ] **Expected**: Login fails, no SQL errors

---

### ✅ XSS Prevention
1. [ ] **Test Review Input**:
   - [ ] Submit review with: `<script>alert('XSS')</script>`
   - [ ] **Expected**: Text appears as plain text, script doesn't execute
2. [ ] **Test Product Name**:
   - [ ] Admin creates product with name: `<img src=x onerror=alert('XSS')>`
   - [ ] **Expected**: Renders as text, no alert

---

## 🎨 UI/UX CHECKS

### ✅ Dark/Light Mode Toggle
1. [ ] Click theme toggle (moon/sun icon)
2. [ ] **Verify**:
   - [ ] All pages switch theme
   - [ ] Text remains readable
   - [ ] No white flashes during transition
   - [ ] Theme persists on page reload
3. [ ] **Test in Dark Mode**:
   - [ ] All user flows from above
   - [ ] Verify contrast and readability

---

### ✅ Loading States
1. [ ] **Products Page**:
   - [ ] On slow connection, verify loading spinner shows
2. [ ] **Checkout**:
   - [ ] Click "Place Order"
   - [ ] Verify loading indicator during submission
3. [ ] **All Forms**:
   - [ ] Buttons show loading state when submitting

---

### ✅ Error Messages
1. [ ] **User-Friendly Errors**:
   - [ ] No technical stack traces shown to users
   - [ ] Clear, actionable error messages
   - [ ] Themed error notifications (match site style)
2. [ ] **Network Errors**:
   - [ ] Disable network in DevTools
   - [ ] Try actions
   - [ ] **Expected**: "Please check your connection" type messages

---

## 📊 BROWSER COMPATIBILITY

### ✅ Chrome/Edge (Chromium)
- [ ] All flows work
- [ ] No console errors
- [ ] Animations smooth

### ✅ Firefox
- [ ] All flows work
- [ ] No console errors
- [ ] CSS renders correctly

### ✅ Safari (if available)
- [ ] All flows work
- [ ] Date pickers work
- [ ] No webkit-specific issues

---

## 🚀 PERFORMANCE CHECKS

### ✅ Lighthouse Audit
1. [ ] Open DevTools → Lighthouse tab
2. [ ] Run audit on homepage
3. [ ] **Target Scores**:
   - [ ] Performance: 90+
   - [ ] Accessibility: 95+
   - [ ] Best Practices: 90+
   - [ ] SEO: 100

---

### ✅ Network Performance
1. [ ] DevTools → Network tab
2. [ ] Hard refresh (Ctrl+Shift+R)
3. [ ] **Verify**:
   - [ ] Total page size < 3MB
   - [ ] Images compressed/optimized
   - [ ] JS bundles code-split
   - [ ] Time to Interactive < 3.5s

---

## 🐛 KNOWN ISSUES TO DOCUMENT

### Currently Fixed:
- ✅ Signup validation (username optional)
- ✅ Cart API graceful degradation
- ✅ Contact form validation (min 3 chars for subject)

### Still Investigating:
- ⚠️ Cart backend returning 500 errors (gracefully handled with localStorage fallback)
- ⚠️ Cross-Origin-Opener-Policy warnings (Firebase Auth popups - non-critical)

### To Monitor:
- [ ] Railway backend logs for persistent 500 errors
- [ ] Google Search Console for sitemap processing

---

## 📝 TESTING NOTES

**Date**: _______________  
**Tester**: _______________  
**Browser**: _______________  
**Device**: _______________

### Bugs Found:
1. _______________________________________________________
2. _______________________________________________________
3. _______________________________________________________

### Features Working:
- _______________________________________________________
- _______________________________________________________
- _______________________________________________________

### Critical Issues:
- _______________________________________________________

### Nice-to-Have Improvements:
- _______________________________________________________

---

## ✅ PRE-PRESENTATION FINAL CHECK

**24 Hours Before Presentation:**
- [ ] All critical flows tested and working
- [ ] Admin credentials ready
- [ ] Demo customer account created
- [ ] Test products in database
- [ ] Contact form working
- [ ] No critical console errors
- [ ] Site loads on mobile and desktop
- [ ] Backup screenshots taken

**1 Hour Before Presentation:**
- [ ] Test site is live: https://capsulecorps.dev
- [ ] Quick smoke test (login, add to cart, checkout)
- [ ] Clear browser cache for clean demo
- [ ] Browser tabs prepared

---

## 🎯 TESTING PRIORITY

### P0 - CRITICAL (Must work for presentation)
1. ✅ Login/Signup
2. ✅ Browse products
3. ✅ Add to cart (even if backend fails)
4. ✅ Checkout flow
5. ✅ Admin panel access
6. ✅ Admin CRUD operations

### P1 - HIGH (Important to work)
1. ✅ Product reviews
2. ✅ Order history
3. ✅ Contact form
4. ✅ Profile management
5. ✅ Dark mode toggle

### P2 - MEDIUM (Nice to have)
1. ✅ Wishlist
2. ✅ Address book
3. ✅ Returns system
4. ✅ Admin analytics

### P3 - LOW (Not critical for demo)
1. Email notifications
2. Advanced analytics
3. Export features

---

**End of Testing Checklist**

💡 **Tip**: Test in order of priority. Focus on P0 items first to ensure core demo flows work perfectly!

🚀 **Remember**: Minor console warnings are OK if functionality works. Focus on user-visible errors!
