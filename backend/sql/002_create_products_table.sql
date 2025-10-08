-- Migration: Create capsule_products table
-- Description: Creates the capsule_products table for Capsule Corp e-commerce store

-- Create new capsule_products table with correct schema (avoiding conflicts with existing products table)
CREATE TABLE IF NOT EXISTS capsule_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    power_level INT DEFAULT 0,
    image VARCHAR(500),
    gallery JSON,
    in_stock BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    tags JSON,
    specifications JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_featured (featured),
    INDEX idx_in_stock (in_stock),
    INDEX idx_slug (slug),
    INDEX idx_price (price)
);