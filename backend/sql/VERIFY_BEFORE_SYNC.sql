-- ============================================================================
-- PRODUCTION DATABASE PRE-SYNC VERIFICATION
-- Run this BEFORE running SYNC_PRODUCTION.sql to see what will change
-- ============================================================================

-- Check if role column exists in users table
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'role';

-- Check current admin users
SELECT id, email, role, username, created_at 
FROM users 
WHERE email LIKE '%admin%' OR role = 'admin'
ORDER BY id;

-- Check if user_addresses has new columns
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    COLUMN_DEFAULT
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'user_addresses'
    AND COLUMN_NAME IN ('full_name', 'phone', 'type', 'is_default');

-- Check if orders has customer fields
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'orders'
    AND COLUMN_NAME IN ('customer_name', 'customer_email', 'customer_phone');

-- Check if roles table exists
SELECT 
    TABLE_NAME 
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'roles';

-- Check total users
SELECT COUNT(*) as total_users FROM users;

-- Check users without role
SELECT COUNT(*) as users_without_role 
FROM users 
WHERE role IS NULL OR role = '';

-- Check total orders
SELECT COUNT(*) as total_orders FROM orders;

-- Check orders without customer info
SELECT COUNT(*) as orders_without_customer_info 
FROM orders 
WHERE customer_name IS NULL AND customer_email IS NULL;

-- Check total addresses
SELECT COUNT(*) as total_addresses FROM user_addresses;

-- ============================================================================
-- EXPECTED RESULTS:
-- ============================================================================
-- If columns/tables are missing, they will be created by SYNC_PRODUCTION.sql
-- If users don't have roles, they will be set to 'user' by default
-- If admin emails exist, they will be upgraded to admin role
-- ============================================================================
