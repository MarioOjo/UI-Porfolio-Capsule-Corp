-- Migration: Seed roles table
INSERT IGNORE INTO roles (id, name) VALUES (1, 'user'), (2, 'admin');
