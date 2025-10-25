-- 001_add_role_to_users.sql
-- Add a role column to the users table (idempotent when using MySQL >= 8.0.16)
-- and seed specific admin emails. Run this in your backend database environment.

-- Add column if supported
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `role` VARCHAR(32) NOT NULL DEFAULT 'user';

-- If your MySQL does not support ADD COLUMN IF NOT EXISTS (older versions),
-- run the following guarded check instead (uncomment and run manually):
--
-- SELECT COLUMN_NAME
-- FROM information_schema.COLUMNS
-- WHERE TABLE_SCHEMA = 'your_database_name' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role';
-- If the select returns no rows, run:
-- ALTER TABLE `users` ADD COLUMN `role` VARCHAR(32) NOT NULL DEFAULT 'user';

-- Idempotent seed: set listed emails to admin (lowercase matching)
-- Replace the emails below as needed, or run via seeder script which accepts env/args.
UPDATE users
SET role = 'admin'
WHERE LOWER(email) IN ('admin@example.com', 'mario@capsulecorp.com');

-- NOTES:
-- 1) Backup your DB before running migrations in production (mysqldump or snapshot).
-- 2) Existing JWTs will not automatically include role until tokens are reissued (user logs in again).
-- 3) To revert data changes only: UPDATE users SET role = 'user' WHERE LOWER(email) IN (...);
-- 4) To remove column (destructive): ALTER TABLE users DROP COLUMN role; (only after backup)
