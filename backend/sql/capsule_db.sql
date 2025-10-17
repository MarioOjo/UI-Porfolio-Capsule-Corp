-- Ensure capsule_products table exists for all environments
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Note: Database creation removed for cloud compatibility. Connection pool already targets the correct DB.

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_statuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(40) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  category_id INT NULL,
  status_id INT NOT NULL DEFAULT 1,
  price_cents INT NOT NULL DEFAULT 0,
  power_level INT NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (status_id) REFERENCES product_statuses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NULL,
  lastName VARCHAR(100) NULL,
  google_id VARCHAR(255) NULL UNIQUE,
  role_id INT NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login TIMESTAMP NULL,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (id, name) VALUES (1, 'user'), (2, 'admin');

INSERT IGNORE INTO product_statuses (id, code, label) VALUES
  (1, 'AVAILABLE', 'Available'),
  (2, 'DESTROYED', 'Destroyed'),
  (3, 'LAST_CAPSULE', 'Last Capsule');

INSERT IGNORE INTO categories (id, name, slug) VALUES
  (1, 'Battle Gear', 'battle-gear'),
  (2, 'Training', 'training'),
  (3, 'Tech', 'tech'),
  (4, 'Consumables', 'consumables');

-- Legacy products table seed removed - using capsule_products table instead (see 002_create_products_table.sql and 003_seed_products_data.sql)
-- The products table above exists for backward compatibility but is not populated