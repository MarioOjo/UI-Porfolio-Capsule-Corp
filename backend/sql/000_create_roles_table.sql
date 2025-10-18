-- Migration: Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
