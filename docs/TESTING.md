# Testing Guide for Capsule Corp

Complete guide for testing the Capsule Corp application locally and in production.

## Quick Start

### 1. Seed Test Data

Populate MongoDB with test users, products, orders, and more:

```bash
cd backend
npm run seed
```

This creates:
- 4 test users (1 admin, 3 regular users)
- 8 products across different categories
- Sample orders, reviews, addresses, cart items
- Contact messages and return requests

### 2. Test API Endpoints

Run automated API tests:

```bash
cd backend
npm run test:api
```

This tests all major endpoints including:
- Authentication (register/login)
- Products (CRUD, search, filter)
- Cart operations
- Reviews
- Orders
- Admin functions

### 3. Manual Testing

Start both servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Test Credentials

### Admin Account
```
Email:    admin@capsulecorp.com
Password: Admin123!
```

### User Accounts
```
Email:    goku@capsulecorp.com
Password: User123!

Email:    vegeta@capsulecorp.com
Password: User123!

Email:    piccolo@capsulecorp.com
Password: User123!
```

## Testing Checklist

### ✅ User Flow Testing

#### Registration & Authentication
- [ ] Register new user
- [ ] Login with existing user
- [ ] Logout
- [ ] Access protected routes (should redirect to login)
- [ ] Verify JWT token in localStorage

#### Product Browsing
- [ ] View products homepage
- [ ] Filter by category (Capsules, Battle Gear, Training)
- [ ] Search for products
- [ ] Click product details
- [ ] Verify images load from Cloudinary
- [ ] Check product information displays correctly

#### Shopping Cart
- [ ] Add product to cart (not logged in → should prompt login)
- [ ] Add product to cart (logged in)
- [ ] Update quantity
- [ ] Remove item from cart
- [ ] Cart persists after refresh
- [ ] Cart icon shows correct count

#### Checkout & Orders
- [ ] Proceed to checkout
- [ ] Add new shipping address
- [ ] Select existing address
- [ ] Complete order
- [ ] View order confirmation
- [ ] Check order appears in order history

#### User Profile
- [ ] View profile page
- [ ] Edit profile information
- [ ] Upload/change avatar
- [ ] Change password
- [ ] View order history
- [ ] View order details
- [ ] Add/edit/delete addresses
- [ ] Set default address

#### Reviews
- [ ] View product reviews
- [ ] Add review (with rating)
- [ ] Edit own review
- [ ] Delete own review
- [ ] Vote review as helpful
- [ ] Cannot review without purchase (if implemented)

#### Contact Form
- [ ] Submit contact form
- [ ] Verify required fields
- [ ] Check email sent (check backend logs)

### ✅ Admin Flow Testing

#### Admin Dashboard
- [ ] Login as admin
- [ ] Access admin dashboard
- [ ] Verify regular users cannot access admin routes
- [ ] View statistics/overview

#### Product Management
- [ ] View all products
- [ ] Create new product
- [ ] Upload product image (Cloudinary)
- [ ] Edit existing product
- [ ] Update product stock
- [ ] Delete product
- [ ] Toggle featured status

#### Order Management
- [ ] View all orders
- [ ] Filter orders by status
- [ ] View order details
- [ ] Update order status (pending → processing → shipped → delivered)
- [ ] Cancel order
- [ ] View customer information

#### User Management
- [ ] View all users
- [ ] View user details
- [ ] Search users
- [ ] Promote user to admin
- [ ] Demote admin to user (if implemented)
- [ ] View user order history

#### Returns Management
- [ ] View return requests
- [ ] Approve return
- [ ] Deny return
- [ ] Process refund

### ✅ Technical Testing

#### Database
- [ ] MongoDB connection successful
- [ ] All collections created
- [ ] Data persists correctly
- [ ] Relationships working (users → orders, products → reviews)

#### API Endpoints
- [ ] All routes return correct status codes
- [ ] Error handling works (404, 401, 500)
- [ ] CORS configured correctly
- [ ] Rate limiting (if implemented)

#### Security
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens working
- [ ] Protected routes check authentication
- [ ] Admin routes check role
- [ ] XSS protection
- [ ] SQL injection prevention (N/A - using MongoDB)

#### Performance
- [ ] Images optimize (Cloudinary transformations)
- [ ] API response times reasonable
- [ ] No memory leaks
- [ ] Pagination working for large datasets

## MongoDB Collections to Verify

After seeding, check MongoDB Atlas/Compass for:

### users
```javascript
{
  email: string,
  password: string (hashed),
  firstName: string,
  lastName: string,
  role: 'user' | 'admin',
  avatar: string (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### products
```javascript
{
  name: string,
  description: string,
  price: number,
  category: string,
  stock: number,
  image: string (Cloudinary URL),
  featured: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### orders
```javascript
{
  user_id: ObjectId,
  items: Array,
  subtotal: number,
  shipping: number,
  tax: number,
  total: number,
  status: string,
  shipping_address: Object,
  payment_method: string,
  payment_status: string,
  createdAt: Date,
  updatedAt: Date
}
```

### reviews
```javascript
{
  product_id: ObjectId,
  user_id: ObjectId,
  rating: number (1-5),
  title: string,
  comment: string,
  verified_purchase: boolean,
  helpful_count: number,
  createdAt: Date,
  updatedAt: Date
}
```

### carts
```javascript
{
  user_id: ObjectId,
  items: [{
    product_id: ObjectId,
    quantity: number,
    price: number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Common Issues & Solutions

### Backend won't start
- Check MongoDB URI is set in `.env`
- Verify port 5000 is not in use
- Check all dependencies installed (`npm install`)

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings allow `http://localhost:3000`
- Verify API base URL in frontend config

### Images not loading
- Check Cloudinary credentials in `.env`
- Verify Cloudinary URLs are correct
- Check browser console for CORS errors

### Authentication not working
- Check JWT_SECRET is set
- Verify token is being sent in Authorization header
- Check token expiration

### Database connection fails
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Verify database user has correct permissions

## Production Testing Checklist

Before deploying to production:

- [ ] All environment variables set on Render
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] MongoDB Atlas connection string updated
- [ ] Cloudinary production credentials set
- [ ] Email service configured (Resend)
- [ ] CORS origins include production URLs
- [ ] Frontend API base points to production backend
- [ ] Test all critical user flows on production
- [ ] Check error logging and monitoring

## Need Help?

If you encounter issues:
1. Check backend logs (`npm run dev` shows console output)
2. Check browser console for frontend errors
3. Verify MongoDB data using MongoDB Compass
4. Test API endpoints using the automated test script
5. Review environment variables in `.env` files

---

**Last Updated:** December 7, 2025
