-- Comprehensive Products Table Schema
-- This ensures the products table exists with all required columns

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Accessories',
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  original_price DECIMAL(10,2) NULL,
  power_level INT NOT NULL DEFAULT 0,
  image VARCHAR(500) NULL,
  gallery TEXT NULL COMMENT 'JSON array of image URLs',
  in_stock TINYINT(1) NOT NULL DEFAULT 1,
  stock INT NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  tags TEXT NULL COMMENT 'JSON array of tags',
  specifications TEXT NULL COMMENT 'JSON object of specifications',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_category (category),
  INDEX idx_slug (slug),
  INDEX idx_featured (featured),
  INDEX idx_in_stock (in_stock),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add columns if they don't exist (for existing tables)
-- Note: MySQL will throw an error if column exists, but script continues

SET @dbname = DATABASE();

-- Check and add price column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'price');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00', 
  'SELECT "price column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add original_price column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'original_price');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN original_price DECIMAL(10,2) NULL', 
  'SELECT "original_price column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add power_level column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'power_level');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN power_level INT NOT NULL DEFAULT 0', 
  'SELECT "power_level column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add image column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'image');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN image VARCHAR(500) NULL', 
  'SELECT "image column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add gallery column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'gallery');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN gallery TEXT NULL', 
  'SELECT "gallery column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add in_stock column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'in_stock');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN in_stock TINYINT(1) NOT NULL DEFAULT 1', 
  'SELECT "in_stock column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add stock column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'stock');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0', 
  'SELECT "stock column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add featured column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'featured');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0', 
  'SELECT "featured column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add tags column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'tags');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN tags TEXT NULL', 
  'SELECT "tags column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add specifications column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'products' AND COLUMN_NAME = 'specifications');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE products ADD COLUMN specifications TEXT NULL', 
  'SELECT "specifications column already exists" AS Info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
