-- =====================================================
-- Performance Indexes for Production Optimization
-- File: 015_add_performance_indexes.sql
-- Date: 2025-11-05
-- =====================================================

-- Products table indexes
-- Slug lookup index (if not exists)
CREATE INDEX IF NOT EXISTS idx_slug ON products(slug);

-- Category filtering
CREATE INDEX IF NOT EXISTS idx_category ON products(category);

-- Featured products filtering
CREATE INDEX IF NOT EXISTS idx_featured ON products(featured);

-- Stock availability filtering
CREATE INDEX IF NOT EXISTS idx_in_stock ON products(in_stock);

-- Composite index for category + stock queries
CREATE INDEX IF NOT EXISTS idx_category_stock ON products(category, in_stock);


-- Cart items table indexes
-- User's cart lookup (primary use case)
CREATE INDEX IF NOT EXISTS idx_user_id ON cart_items(user_id);

-- Composite index for user + product (faster duplicate checks)
CREATE INDEX IF NOT EXISTS idx_user_product ON cart_items(user_id, product_id);

-- Product lookup for cart operations
CREATE INDEX IF NOT EXISTS idx_product_id ON cart_items(product_id);


-- Orders table indexes
-- User's order history
CREATE INDEX IF NOT EXISTS idx_user_id ON orders(user_id);

-- Order status filtering
CREATE INDEX IF NOT EXISTS idx_status ON orders(status);

-- Composite index for user order history by status
CREATE INDEX IF NOT EXISTS idx_user_status ON orders(user_id, status);

-- Order date sorting
CREATE INDEX IF NOT EXISTS idx_created_at ON orders(created_at);


-- Order items table indexes
-- Order details lookup
CREATE INDEX IF NOT EXISTS idx_order_id ON order_items(order_id);

-- Product sales analytics
CREATE INDEX IF NOT EXISTS idx_product_id ON order_items(product_id);


-- User addresses table indexes
-- User's addresses lookup
CREATE INDEX IF NOT EXISTS idx_user_id ON user_addresses(user_id);

-- Default address quick access
CREATE INDEX IF NOT EXISTS idx_user_default ON user_addresses(user_id, is_default);


-- Returns table indexes (already have some from 014_create_returns_table.sql)
-- These may already exist, using IF NOT EXISTS for safety

-- Return items table indexes
CREATE INDEX IF NOT EXISTS idx_return_id ON return_items(return_id);

-- Product return analytics
CREATE INDEX IF NOT EXISTS idx_product_id ON return_items(product_id);


-- Contact messages table indexes
-- Admin inbox filtering
CREATE INDEX IF NOT EXISTS idx_created_at ON contact_messages(created_at);

-- User's contact history (if user_id exists)
-- CREATE INDEX IF NOT EXISTS idx_user_id ON contact_messages(user_id);


-- Reviews table indexes (if exists)
-- Product reviews lookup
CREATE INDEX IF NOT EXISTS idx_product_id ON reviews(product_id);

-- User's reviews
CREATE INDEX IF NOT EXISTS idx_user_id ON reviews(user_id);

-- Composite for product + rating filtering
CREATE INDEX IF NOT EXISTS idx_product_rating ON reviews(product_id, rating);

-- Review date sorting
CREATE INDEX IF NOT EXISTS idx_created_at ON reviews(created_at);


-- =====================================================
-- Index Summary:
-- - Products: 5 indexes (slug, category, featured, stock, category+stock)
-- - Cart items: 3 indexes (user, product, user+product)
-- - Orders: 4 indexes (user, status, user+status, created_at)
-- - Order items: 2 indexes (order, product)
-- - User addresses: 2 indexes (user, user+default)
-- - Return items: 2 indexes (return, product)
-- - Contact messages: 1 index (created_at)
-- - Reviews: 4 indexes (product, user, product+rating, created_at)
--
-- Total: 23 performance indexes
-- Expected improvement: 2-5x faster on filtered queries
-- =====================================================
