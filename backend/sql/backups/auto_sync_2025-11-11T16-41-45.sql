-- Set production passwords
UPDATE users 
SET password_hash = '$2b$12$fwfcHtXdT4NjHAoM2XFU5uHluwfbyyMkoRxEf9qFj1pKDEfFk5ubu'
WHERE email = 'mario@capsulecorp.com';

UPDATE users 
SET password_hash = '$2b$12$c4llZiVM7DyWFSkBXLv7ZessxnaYx76chSi3VAZEqIlSFgagP4Fe.'
WHERE email = 'admin@capsulecorp.com';UPDATE users
SET
  password_hash = '$2b$12$fwfcHtXdT4NjHAoM2XFU5uHluwfbyyMkoRxEf9qFj1pKDEfFk5ubu'
WHERE
  email = 'testuser@capsulecorp.com';