-- Migration: Unify capsule_products into products
-- Step 1: Add missing columns to products
ALTER TABLE products
  ADD COLUMN price DECIMAL(10,2),
  ADD COLUMN original_price DECIMAL(10,2),
  ADD COLUMN image VARCHAR(255),
  ADD COLUMN gallery TEXT,
  ADD COLUMN in_stock BOOLEAN,
  ADD COLUMN tags TEXT,
  ADD COLUMN specifications TEXT;

-- Step 2: Copy all data from capsule_products to products
INSERT INTO products (id, name, slug, description, category, price, original_price, power_level, image, gallery, in_stock, stock, featured, tags, specifications)
SELECT id, name, slug, description, category, price, original_price, power_level, image, gallery, in_stock, stock, featured, tags, specifications
FROM capsule_products;

-- Step 3: Drop the old capsule_products table
DROP TABLE capsule_products;
