# Capsule Corp API Overview

This document provides a high-level overview of the RESTful API endpoints powering the Capsule Corp e-commerce platform.

## Base URL
`http://localhost:5000/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication.
- **Header**: `Authorization: Bearer <token>`

## Key Resources

### 🔐 Authentication (`/api/auth`)
- `POST /register`: Create a new user account
- `POST /login`: Authenticate user and receive JWT
- `POST /google`: Google OAuth authentication
- `POST /refresh-token`: Refresh access token

### 📦 Products (`/api/products`)
- `GET /`: List all products (supports pagination, filtering, sorting)
- `GET /:slug`: Get product details by slug
- `GET /category/:category`: Filter products by category
- `POST /`: Create product (Admin only)

### 🛒 Orders (`/api/orders`)
- `POST /`: Create a new order (Checkout)
- `GET /my-orders`: Get current user's order history
- `GET /:id`: Get specific order details
- `GET /tracking/:number`: Public order tracking endpoint

### 👤 User Profile (`/api/profile`)
- `GET /`: Get user profile details
- `PUT /`: Update profile information
- `GET /addresses`: Manage shipping addresses
- `POST /addresses`: Add new shipping address

### 🛡️ Admin (`/api/admin`)
- `GET /stats`: Dashboard statistics (Revenue, Orders, Users)
- `GET /users`: User management
- `PATCH /orders/:id/status`: Update order status

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: 
  - `helmet` (HTTP Headers)
  - `express-mongo-sanitize` (NoSQL Injection Prevention)
  - `cors` (Cross-Origin Resource Sharing)
  - `express-rate-limit` (DDoS Protection)
