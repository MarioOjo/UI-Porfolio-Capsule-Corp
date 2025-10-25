-- Migration: Add is_default column to user_addresses table
ALTER TABLE user_addresses ADD COLUMN is_default BOOLEAN DEFAULT 0;
-- Optional: Set all existing addresses to is_default = 0
UPDATE user_addresses SET is_default = 0 WHERE is_default IS NULL;