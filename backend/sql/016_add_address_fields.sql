-- Migration: Add full_name, phone, and type columns to user_addresses table

-- Add full_name column if not exists
ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255) DEFAULT '';

-- Add phone column if not exists
ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';

-- Add type column if not exists
ALTER TABLE user_addresses 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'home';
