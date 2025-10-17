-- Create roles table first (no dependencies)
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Create users table (depends on roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  google_id VARCHAR(255) UNIQUE,
  role_id INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create categories table (no dependencies)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table (depends on categories)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  power_level INT,
  image VARCHAR(500),
  gallery JSON,
  in_stock BOOLEAN DEFAULT TRUE,
  stock INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  tags JSON,
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create capsule_products table (if different from products)
CREATE TABLE IF NOT EXISTS capsule_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  power_level INT,
  image VARCHAR(500),
  gallery JSON,
  in_stock BOOLEAN DEFAULT TRUE,
  stock INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  tags JSON,
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'user'),
(2, 'admin');

-- Insert sample categories
INSERT IGNORE INTO categories (name, slug) VALUES 
('Capsules', 'capsules'),
('Vehicles', 'vehicles'),
('Gadgets', 'gadgets');
