-- ============================================================================
-- POST-SYNC VERIFICATION SCRIPT
-- Run this AFTER running SYNC_PRODUCTION.sql to verify everything worked
-- ============================================================================

-- ============================================================================
-- 1. VERIFY TABLE STRUCTURES
-- ============================================================================

-- Check users table has role column
SELECT '✅ Users table - role column' as check_item,
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME = 'role';

-- Check user_addresses has new columns
SELECT '✅ Addresses table - new columns' as check_item,
       CASE WHEN COUNT(*) = 4 THEN 'PASS' ELSE 'FAIL' END as status
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'user_addresses'
  AND COLUMN_NAME IN ('full_name', 'phone', 'type', 'is_default');

-- Check orders has customer fields
SELECT '✅ Orders table - customer fields' as check_item,
       CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END as status
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'orders'
  AND COLUMN_NAME IN ('customer_name', 'customer_email', 'customer_phone');

-- Check roles table exists
SELECT '✅ Roles table exists' as check_item,
       CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'roles';

-- ============================================================================
-- 2. VERIFY ADMIN USERS
-- ============================================================================

-- Show all admin users
SELECT 
    '✅ Admin Users' as section,
    id, 
    email, 
    role, 
    username
FROM users 
WHERE role = 'admin'
ORDER BY id;

-- Verify admin@capsulecorp.com has admin role
SELECT 
    '✅ admin@capsulecorp.com status' as check_item,
    CASE 
        WHEN COUNT(*) > 0 AND MAX(role) = 'admin' THEN 'PASS - Has admin role'
        WHEN COUNT(*) > 0 THEN 'FAIL - Exists but not admin'
        ELSE 'FAIL - User not found'
    END as status
FROM users 
WHERE email = 'admin@capsulecorp.com';

-- ============================================================================
-- 3. VERIFY INDEXES
-- ============================================================================

-- Check for key indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    '✅' as status
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('users', 'orders', 'user_addresses', 'products', 'order_items')
  AND INDEX_NAME != 'PRIMARY'
ORDER BY TABLE_NAME, INDEX_NAME;

-- ============================================================================
-- 4. DATA QUALITY CHECKS
-- ============================================================================

-- Check all users have a role
SELECT 
    '✅ Users with role' as check_item,
    COUNT(*) as total_users,
    SUM(CASE WHEN role IS NOT NULL AND role != '' THEN 1 ELSE 0 END) as users_with_role,
    CASE 
        WHEN COUNT(*) = SUM(CASE WHEN role IS NOT NULL AND role != '' THEN 1 ELSE 0 END) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status
FROM users;

-- Users by role distribution
SELECT 
    '✅ User role distribution' as section,
    role,
    COUNT(*) as count,
    CONCAT(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 1), '%') as percentage
FROM users
GROUP BY role
ORDER BY count DESC;

-- Check addresses have types
SELECT 
    '✅ Addresses with type' as check_item,
    COUNT(*) as total_addresses,
    SUM(CASE WHEN type IS NOT NULL AND type != '' THEN 1 ELSE 0 END) as addresses_with_type,
    CASE 
        WHEN COUNT(*) = SUM(CASE WHEN type IS NOT NULL AND type != '' THEN 1 ELSE 0 END) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as status
FROM user_addresses;

-- ============================================================================
-- 5. SAMPLE DATA VERIFICATION
-- ============================================================================

-- Recent orders with customer info
SELECT 
    '✅ Recent orders' as section,
    id,
    customer_name,
    customer_email,
    status,
    total,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;

-- Sample addresses with new fields
SELECT 
    '✅ Sample addresses' as section,
    id,
    user_id,
    full_name,
    type,
    phone,
    is_default,
    city
FROM user_addresses
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- 6. TABLE COUNTS SUMMARY
-- ============================================================================

SELECT '📊 DATABASE SUMMARY' as summary;

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as count FROM orders
UNION ALL
SELECT 'Order Items' as table_name, COUNT(*) as count FROM order_items
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Addresses' as table_name, COUNT(*) as count FROM user_addresses
UNION ALL
SELECT 'Cart Items' as table_name, COUNT(*) as count FROM cart_items
UNION ALL
SELECT 'Contact Messages' as table_name, COUNT(*) as count FROM contact_messages
UNION ALL
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles;

-- ============================================================================
-- INTERPRETATION:
-- ============================================================================
-- ✅ All checks should show "PASS"
-- ✅ Admin users should have role = 'admin'
-- ✅ All users should have a role assigned
-- ✅ All addresses should have type assigned
-- ✅ Multiple indexes should be listed
-- 
-- If any checks show "FAIL", review the SYNC_PRODUCTION.sql script
-- and check for MySQL errors during execution
-- ============================================================================
