-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Shipping address
  shipping_address_line1 VARCHAR(255) NOT NULL,
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_zip VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) DEFAULT 'USA',
  
  -- Billing address (can be same as shipping)
  billing_address_line1 VARCHAR(255),
  billing_address_line2 VARCHAR(255),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_zip VARCHAR(20),
  billing_country VARCHAR(100),
  
  -- Order details
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment info
  payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'paypal', 'bank_transfer', etc.
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  transaction_id VARCHAR(255),
  
  -- Order status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Tracking
  tracking_number VARCHAR(255),
  carrier VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_slug VARCHAR(255),
  product_image VARCHAR(500),
  category VARCHAR(100),
  power_level INT DEFAULT 0,
  
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL, -- quantity * price
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by_user_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
