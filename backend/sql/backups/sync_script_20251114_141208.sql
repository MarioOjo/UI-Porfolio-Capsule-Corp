-- ============================================================================
-- AUTO-GENERATED SYNC SCRIPT
-- Generated: 20251114_141208
-- Source: Local database (capsule_corp)
-- Target: Railway production (railway)
-- ============================================================================

SET FOREIGN_KEY_CHECKS=0;

-- Drop existing tables (careful!)
-- Commented out by default for safety
-- Uncomment if you want to completely rebuild tables



SET FOREIGN_KEY_CHECKS=1;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all tables
SHOW TABLES;

-- Count records in key tables
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'user_addresses', COUNT(*) FROM user_addresses;

-- Check admin users
SELECT id, email, role, username FROM users WHERE role = 'admin';

-- ============================================================================
-- SYNC COMPLETE
-- ============================================================================
