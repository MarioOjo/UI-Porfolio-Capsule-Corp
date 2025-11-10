# Quick Reference Guide - Admin & Product Management

## 🚀 Quick Start

### Run Database Setup
```powershell
node backend/scripts/comprehensive_admin_fix.js
```
**What it does:**
- ✅ Verifies all database tables exist
- ✅ Confirms admin users are configured
- ✅ Ensures products table has all required columns
- ✅ Safe to run multiple times

### Test Product Operations
```powershell
node backend/scripts/test_product_creation.js
```
**What it does:**
- ✅ Tests product creation with full data
- ✅ Tests product creation with minimal data
- ✅ Tests product updates
- ✅ Tests data preservation
- ✅ Cleans up test data

---

## 🔑 Admin Access

### Admin Login Credentials
- **Email:** mario@capsulecorp.com OR admin@capsulecorp.com
- **Password:** Your configured password
- **Dashboard:** http://localhost:5173/admin

### Admin Capabilities
- ✅ Manage products (create, read, update, delete)
- ✅ View and manage orders
- ✅ View contact messages
- ✅ Manage users
- ✅ View returns

---

## 📦 Product Management

### Create Product (Minimal Required Fields)
```javascript
{
  name: "Product Name",           // Required
  description: "Description",     // Required
  category: "Capsules",          // Required
  price: 49.99,                  // Required
  stock: 100                     // Required
}
```
**All other fields get safe defaults:**
- slug: auto-generated from name
- in_stock: true
- featured: false
- gallery: []
- tags: []
- specifications: {}

### Create Product (All Fields)
```javascript
{
  name: "Deluxe Capsule",
  slug: "deluxe-capsule",        // Optional (auto-generated if not provided)
  description: "Premium capsule",
  category: "Capsules",
  price: 149.99,
  original_price: 199.99,        // Optional (for sale pricing)
  power_level: 9000,             // Optional (for DBZ-themed products)
  image: "https://...",          // Optional
  gallery: ["img1.jpg", "img2.jpg"],  // Optional
  in_stock: true,
  stock: 50,
  featured: true,                // Optional (show on homepage)
  tags: ["premium", "deluxe"],   // Optional
  specifications: {              // Optional
    weight: "100kg",
    dimensions: "10x10x10cm"
  }
}
```

### Update Product (Partial Update)
```javascript
// Only provide fields you want to change
{
  price: 129.99,
  stock: 75,
  featured: true
}
// All other fields are preserved automatically
```

---

## 🛠️ Common Tasks

### Add a New Admin User
1. Add email to `.env` file:
   ```env
   ADMIN_EMAILS=mario@capsulecorp.com,admin@capsulecorp.com,newemail@example.com
   ```
2. Run setup script:
   ```powershell
   node backend/scripts/comprehensive_admin_fix.js
   ```

### Check Product Count
```powershell
node backend/scripts/check_products.js
```

### Verify Database Schema
```sql
-- In TablePlus or MySQL client
DESCRIBE products;
```

### Restart Backend Server
```powershell
# Stop existing server (Ctrl+C)
# Then restart
cd backend
npm run dev
```

---

## 🐛 Troubleshooting

### "Access denied. Admin privileges required"
**Solution:**
```powershell
node backend/scripts/comprehensive_admin_fix.js
```
This ensures your user has the admin role.

### "Bind parameters must not contain undefined"
**Solution:** This is now prevented! If you see this error:
1. Check ProductModel.create() has all defaults
2. Run database setup to ensure schema is correct
3. Check if a new field was added without a default value

### "404 Not Found" on product endpoints
**Frontend should use:**
- Admin operations: `/api/admin/products`
- Public viewing: `/api/products`

### Products not appearing in admin panel
1. Check browser console for errors
2. Verify backend server is running
3. Check database has products:
   ```powershell
   node backend/scripts/check_products.js
   ```

### Image upload not working
**Note:** Cloudinary is optional. Products work without images.
To enable images:
1. Sign up at cloudinary.com
2. Add to `.env`:
   ```env
   CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```
3. Restart backend server

---

## 📊 Database Tables Reference

### users
- **id** - Primary key
- **email** - Unique, required
- **password_hash** - Required
- **role** - 'admin' or 'user' (default: 'user')
- **first_name, last_name, phone**
- **created_at, updated_at**

### products
- **id** - Primary key
- **name** - Required
- **slug** - Unique, auto-generated
- **description, category**
- **price** - Required, DECIMAL(10,2)
- **original_price** - For sale pricing
- **power_level** - DBZ theme
- **image** - Main product image URL
- **gallery** - JSON array of images
- **in_stock** - Boolean (default: true)
- **stock** - Quantity available
- **featured** - Show on homepage
- **tags** - JSON array
- **specifications** - JSON object
- **created_at, updated_at**

### orders
- **id** - Primary key
- **order_number** - Auto-generated
- **user_id** - Foreign key (optional for guest checkout)
- **customer_name, customer_email, customer_phone**
- **shipping_address_*** - Multiple fields
- **billing_address_*** - Multiple fields
- **subtotal, shipping_cost, tax, total**
- **payment_method, payment_status, transaction_id**
- **status** - pending, processing, shipped, delivered, cancelled
- **created_at, updated_at**

### order_items
- **id** - Primary key
- **order_id** - Foreign key
- **product_id, product_name, product_slug, product_image**
- **category, power_level**
- **quantity, price, subtotal**

### cart_items
- **id** - Primary key
- **user_id** - Foreign key
- **product_id** - Foreign key
- **quantity**
- **created_at, updated_at**

### reviews
- **id** - Primary key
- **product_id** - Foreign key
- **user_id** - Foreign key
- **rating** - 1-5 stars
- **comment**
- **created_at, updated_at**

### returns
- **id** - Primary key
- **order_id** - Foreign key
- **user_id** - Foreign key
- **reason, status**
- **created_at, updated_at**

---

## 🎨 Frontend Routes

### Public Routes
- `/` - Homepage
- `/shop` - All products
- `/product/:slug` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - User login
- `/signup` - User registration

### User Dashboard Routes
- `/account` - User profile
- `/orders` - Order history
- `/addresses` - Saved addresses

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders
- `/admin/users` - Manage users
- `/admin/messages` - Contact messages
- `/admin/returns` - Manage returns

---

## 🔐 API Endpoints Reference

### Public Product Endpoints
```
GET    /api/products           - List all products
GET    /api/products/:id       - Get product by ID
GET    /api/products/slug/:slug - Get product by slug
GET    /api/products/category/:category - Products by category
```

### Admin Product Endpoints (Requires Admin Role)
```
GET    /api/admin/products     - List all products (admin view)
POST   /api/admin/products     - Create new product
PUT    /api/admin/products/:id - Update product
DELETE /api/admin/products/:id - Delete product
```

### Auth Endpoints
```
POST   /api/auth/signup        - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user info
POST   /api/auth/logout        - Logout user
```

### Cart Endpoints (Requires Auth)
```
GET    /api/cart               - Get user's cart
POST   /api/cart               - Add item to cart
PUT    /api/cart/:id           - Update cart item quantity
DELETE /api/cart/:id           - Remove item from cart
```

### Order Endpoints (Requires Auth)
```
GET    /api/orders             - Get user's orders
GET    /api/orders/:id         - Get order details
POST   /api/orders             - Create new order
```

---

## ✅ Pre-Deployment Checklist

### Environment Variables
- [ ] `DATABASE_URL` - MySQL connection string
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- [ ] `ADMIN_EMAILS` - Comma-separated admin emails
- [ ] `CLOUDINARY_URL` - (Optional) For image uploads
- [ ] `RESEND_API_KEY` - (Optional) For email notifications

### Database Setup
- [ ] Run `comprehensive_admin_fix.js`
- [ ] Verify all tables exist
- [ ] Confirm admin users are promoted
- [ ] Check products table has all columns

### Testing
- [ ] Run `test_product_creation.js`
- [ ] Test product creation via admin UI
- [ ] Test product updates
- [ ] Test product deletion
- [ ] Test order creation
- [ ] Test cart functionality

### Security
- [ ] Change `JWT_SECRET` from default
- [ ] Use strong admin passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS for your domain

---

## 📱 Support Commands

### Check Database Connection
```powershell
node backend/scripts/comprehensive_admin_fix.js
```

### List All Products
```powershell
node backend/scripts/check_products.js
```

### Create Test Admin User
```powershell
node backend/scripts/create_admin.js
```

### Reset Admin Password
```powershell
node backend/scripts/reset_admin_password.js
```

### Test All Endpoints
```powershell
node backend/scripts/test_endpoints.js
```

---

## 🎯 Success Indicators

### Everything is Working When:
- ✅ Admin users can login and access /admin
- ✅ Products can be created with minimal fields
- ✅ Product updates preserve unchanged fields
- ✅ Product deletion works
- ✅ Products appear in shop
- ✅ Cart operations work
- ✅ Orders can be placed
- ✅ No console errors about undefined parameters
- ✅ Database tests pass

---

## 📞 Quick Fixes

### "Cannot read property 'role' of undefined"
```powershell
# Logout and login again to get new JWT token with role
```

### "Product not found after creation"
```powershell
# Check slug generation
node backend/scripts/check_products.js
```

### "Cart not working"
```powershell
# Verify cart_items table exists
node backend/scripts/comprehensive_admin_fix.js
```

### "Images not uploading"
```env
# Add Cloudinary credentials or continue without images
# Products work fine without image uploads
```

---

**Last Updated:** 2024
**All Systems:** ✅ OPERATIONAL

For detailed information, see:
- `COMPREHENSIVE_FIX_SUMMARY.md` - Complete fix documentation
- `FINAL_VALIDATION_REPORT.md` - System validation results
- `README.md` - Project overview and setup
