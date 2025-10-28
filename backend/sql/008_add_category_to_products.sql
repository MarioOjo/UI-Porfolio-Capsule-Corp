-- Migration: Add 'category' column to products table
ALTER TABLE products ADD COLUMN category VARCHAR(100) AFTER description;