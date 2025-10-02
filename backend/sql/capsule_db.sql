-- Base schema for Capsule Corp database
-- Database creation (run once at setup)
CREATE DATABASE IF NOT EXISTS capsule_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Note: Connection pool already targets capsule_db, so USE command removed to avoid ER_UNSUPPORTED_PS

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

INSERT INTO products (name, slug, description, category_id, status_id, price_cents, power_level, featured, stock)
VALUES
  ('Saiyan Battle Armor','saiyan-battle-armor','Durable battle armor',1,1,29900,9000,1,10),
  ('Gravity Chamber','gravity-chamber','High gravity training room',2,1,1599900,50000,1,2),
  ('Elite Scouter','elite-scouter','Advanced scouter tech',3,1,129900,1000000,1,25)
ON DUPLICATE KEY UPDATE price_cents = VALUES(price_cents), stock = VALUES(stock);