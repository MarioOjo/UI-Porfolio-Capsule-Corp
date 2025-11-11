-- ============================================================================
-- COMPREHENSIVE RAILWAY PRODUCTION DATABASE SYNC SCRIPT
-- Run this in TablePlus connected to your Railway database
-- This syncs all local development changes to production
-- ============================================================================

-- ============================================================================
-- 1. CREATE MISSING TABLES (if not exists)
-- ============================================================================

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
