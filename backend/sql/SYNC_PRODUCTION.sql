-- ============================================================================
-- COMPREHENSIVE RAILWAY PRODUCTION DATABASE SYNC SCRIPT
-- Run this in TablePlus connected to your Railway database
-- This syncs all local development changes to production
-- 
-- ⚠️ WARNING: Your production is missing CRITICAL tables!
-- This script will create: orders, order_items, order_status_history
-- ============================================================================

-- ============================================================================
-- 1. CREATE MISSING CRITICAL TABLES
-- ============================================================================

-- Orders table (CRITICAL - MISSING IN PRODUCTION!)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Shipping address
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_zip VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) DEFAULT 'USA',
  
  -- Billing address
  billing_address_line1 VARCHAR(255),
  billing_address_line2 VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_zip VARCHAR(20),
  billing_country VARCHAR(100),
  
  -- Order details
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment info
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  
  -- Order status
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Tracking
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table (CRITICAL - MISSING IN PRODUCTION!)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  variant_id INT,
  product_id INT,
  product_name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total DECIMAL(10, 2) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_variant_id (variant_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by_user_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Add is_default to user_addresses
ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT 0;

-- Add full_name, phone, type to user_addresses
ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) DEFAULT '';

ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';

ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'home';

-- Add customer fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);

-- Add category to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- ============================================================================
-- 3. SEED ESSENTIAL DATA
-- ============================================================================

-- Insert default roles
INSERT IGNORE INTO roles (name, description) VALUES
('user', 'Standard user with basic permissions'),
('admin', 'Administrator with full system access'),
('moderator', 'Moderator with content management permissions');

-- ============================================================================
-- 4. FIX ADMIN USERS
-- ============================================================================

-- Update all admin@capsulecorp.com users to have admin role
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@capsulecorp.com';

-- Update mario@capsulecorp.com to admin role
UPDATE users 
SET role = 'admin' 
WHERE email = 'mario@capsulecorp.com';

-- Update any other users in ADMIN_EMAILS list (add your emails here)
UPDATE users 
SET role = 'admin' 
WHERE email IN (
  'mario@capsulecorp.com',
  'admin@capsulecorp.com'
);

-- ============================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON order_items(variant_id);

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- User addresses indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON user_addresses(user_id, is_default);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Contact messages indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- ============================================================================
-- 6. DATA CLEANUP & VALIDATION
-- ============================================================================

-- Ensure all users have a role (default to 'user')
UPDATE users 
SET role = 'user' 
WHERE role IS NULL OR role = '';

-- Ensure all addresses have type
UPDATE user_addresses 
SET type = 'home' 
WHERE type IS NULL OR type = '';

-- Ensure all addresses have full_name default
UPDATE user_addresses 
SET full_name = '' 
WHERE full_name IS NULL;

-- Ensure all addresses have phone default
UPDATE user_addresses 
SET phone = '' 
WHERE phone IS NULL;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Check admin users
SELECT id, email, role, username, created_at 
FROM users 
WHERE role = 'admin' 
ORDER BY created_at DESC;

-- Check user_addresses structure
DESCRIBE user_addresses;

-- Check orders structure
DESCRIBE orders;

-- Check total users by role
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Check recent orders
SELECT id, user_id, customer_name, customer_email, status, total, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Check address book entries
SELECT id, user_id, full_name, type, is_default, city, created_at 
FROM user_addresses 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Run this entire script in TablePlus (connected to Railway DB)
-- 2. Check the verification queries at the end to confirm changes
-- 3. All ALTER TABLE statements use "IF NOT EXISTS" so it's safe to run multiple times
-- 4. Make sure to add any additional admin emails in section 4
-- 5. After running, test login with: admin@capsulecorp.com / Admin2025!
-- ============================================================================
