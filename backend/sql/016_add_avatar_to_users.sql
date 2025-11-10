-- Add avatar field to users table
-- This will store the selected warrior avatar ID (goku, vegeta, gohan, etc.)

ALTER TABLE users 
ADD COLUMN avatar VARCHAR(50) DEFAULT 'goku' AFTER last_name;

-- Update existing users to have the default avatar
UPDATE users SET avatar = 'goku' WHERE avatar IS NULL;
