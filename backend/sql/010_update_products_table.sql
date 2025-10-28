-- Migration: Update local products table to match unified schema
ALTER TABLE products
  ADD COLUMN price DECIMAL(10,2),
  ADD COLUMN original_price DECIMAL(10,2),
  ADD COLUMN image VARCHAR(255),
  ADD COLUMN gallery TEXT,
  ADD COLUMN in_stock BOOLEAN,
  ADD COLUMN stock INT,
  ADD COLUMN featured TINYINT(1),
  ADD COLUMN tags TEXT,
  ADD COLUMN specifications TEXT;
