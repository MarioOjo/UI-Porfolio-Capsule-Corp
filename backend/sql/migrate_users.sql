-- Migration script to add missing columns to users table
USE capsule_db;

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(100) NULL AFTER id,
ADD COLUMN IF NOT EXISTS firstName VARCHAR(100) NULL AFTER password_hash,
ADD COLUMN IF NOT EXISTS lastName VARCHAR(100) NULL AFTER firstName,
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) NULL UNIQUE AFTER lastName,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER is_active,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL AFTER last_login;

-- Show the updated table structure
DESCRIBE users;