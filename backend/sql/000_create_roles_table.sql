-- Migration: Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Seed default roles
INSERT IGNORE INTO roles (id, name) VALUES (1, 'user'), (2, 'admin');
