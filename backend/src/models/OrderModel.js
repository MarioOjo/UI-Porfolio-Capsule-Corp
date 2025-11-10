const db = require('../config/database');

class OrderModel {
  // Create new order
  static async create(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Insert order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_zip, shipping_country,
          billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip, billing_country,
          subtotal, shipping_cost, tax, total,
          payment_method, payment_status, transaction_id,
          status, customer_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderNumber,
          orderData.user_id || null,
          orderData.customer_name,
          orderData.customer_email,
          orderData.customer_phone || null,
          orderData.shipping_address.line1,
          orderData.shipping_address.line2 || null,
          orderData.shipping_address.city,
          orderData.shipping_address.state,
          orderData.shipping_address.zip,
          orderData.shipping_address.country || 'USA',
          orderData.billing_address?.line1 || orderData.shipping_address.line1,
          orderData.billing_address?.line2 || orderData.shipping_address.line2 || null,
          orderData.billing_address?.city || orderData.shipping_address.city,
          orderData.billing_address?.state || orderData.shipping_address.state,
          orderData.billing_address?.zip || orderData.shipping_address.zip,
          orderData.billing_address?.country || orderData.shipping_address.country || 'USA',
          orderData.subtotal,
          orderData.shipping_cost || 0,
          orderData.tax || 0,
          orderData.total,
          orderData.payment_method,
          orderData.payment_status || 'pending',
          orderData.transaction_id || null,
          'pending',
          orderData.customer_notes || null
        ]
      );

      const orderId = orderResult.insertId;

      // Insert order items
      for (const item of orderData.items) {
        await connection.execute(
          `INSERT INTO order_items (
            order_id, product_id, product_name, product_slug, product_image, category, power_level,
            quantity, price, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.id,
            item.name,
            item.slug || null,
            item.image || null,
            item.category || null,
            item.power_level || item.powerLevel || 0,
            item.quantity,
            item.price,
            item.quantity * item.price
          ]
        );
      }

      // Record status history
      await connection.execute(
        `INSERT INTO order_status_history (order_id, new_status, notes) VALUES (?, ?, ?)`,
        [orderId, 'pending', 'Order created']
      );

      await connection.commit();
      
      return {
        order_id: orderId,
        order_number: orderNumber
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all orders with filters
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        GROUP_CONCAT(DISTINCT oi.product_name SEPARATOR ', ') as product_names
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    const conditions = [];
    const params = [];

    if (filters.status) {
      conditions.push('o.status = ?');
      params.push(filters.status);
    }

    if (filters.user_id) {
      conditions.push('o.user_id = ?');
      params.push(filters.user_id);
    }

    if (filters.search) {
      // Search in order_number, customer_name, and customer_email columns
      conditions.push('(o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_email LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.date_from) {
      conditions.push('o.placed_at >= ?');
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      conditions.push('o.placed_at <= ?');
      params.push(filters.date_to);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY o.id ORDER BY o.placed_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const rows = await db.executeQuery(query, params);
    
    // Map placed_at to created_at for frontend compatibility and ensure customer fields exist
    return rows.map(row => {
      row.created_at = row.placed_at;
      // customer_name and customer_email are already in the row from the database columns
      // If they're null for any reason, provide defaults
      row.customer_name = row.customer_name || 'N/A';
      row.customer_email = row.customer_email || 'N/A';
      return row;
    });
  }

  // Get order by ID with items
  static async findById(orderId) {
    const orders = await db.executeQuery(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    // Get order items
    const items = await db.executeQuery(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    order.items = items;

    // Get status history
    const history = await db.executeQuery(
      `SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC`,
      [orderId]
    );

    order.status_history = history;

    return order;
  }

  // Get order by order number
  static async findByOrderNumber(orderNumber) {
    const orders = await db.executeQuery(
      `SELECT * FROM orders WHERE order_number = ?`,
      [orderNumber]
    );

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    // Get order items
    const items = await db.executeQuery(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );

    order.items = items;

    return order;
  }

  // Update order status
  static async updateStatus(orderId, newStatus, userId = null, notes = null) {
    // Update order status
    const result = await db.executeQuery(
      'UPDATE orders SET status = ? WHERE id = ?',
      [newStatus, orderId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Order not found');
    }

    // Record status change in history if table exists
    try {
      await db.executeQuery(
        `INSERT INTO order_status_history (order_id, new_status, notes) VALUES (?, ?, ?)`,
        [orderId, newStatus, notes || `Status changed to ${newStatus}`]
      );
    } catch (error) {
      // If status history table doesn't exist or fails, continue anyway
      console.log('Status history update skipped:', error.message);
    }

    return true;
  }

  // Update tracking information
  static async updateTracking(orderId, trackingNumber, carrier) {
    // Check if tracking columns exist, if not update metadata
    try {
      const result = await db.executeQuery(
        `UPDATE orders SET metadata = JSON_SET(COALESCE(metadata, '{}'), '$.tracking_number', ?, '$.carrier', ?) WHERE id = ?`,
        [trackingNumber, carrier, orderId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.log('Tracking update error:', error.message);
      return false;
    }
  }

  // Update admin notes
  static async updateAdminNotes(orderId, notes) {
    // Store notes in metadata since admin_notes column might not exist
    try {
      const result = await db.executeQuery(
        `UPDATE orders SET metadata = JSON_SET(COALESCE(metadata, '{}'), '$.admin_notes', ?) WHERE id = ?`,
        [notes, orderId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.log('Admin notes update error:', error.message);
      return false;
    }
  }

  // Get order statistics
  static async getStatistics(dateFrom = null, dateTo = null) {
    let dateCondition = '';
    const params = [];

    if (dateFrom && dateTo) {
      dateCondition = 'WHERE placed_at BETWEEN ? AND ?';
      params.push(dateFrom, dateTo);
    }

    const stats = await db.executeQuery(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        AVG(total) as average_order_value,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders ${dateCondition}`,
      params
    );

    return stats[0];
  }

  // Get statistics for a single user
  static async getUserStatistics(userId) {
    if (!userId) return { total_orders: 0, total_spent: 0, average_order_value: 0 };
    const rows = await db.executeQuery(
      `SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total), 0) as total_spent,
        COALESCE(AVG(total), 0) as average_order_value
      FROM orders WHERE user_id = ?`,
      [userId]
    );
    return rows[0] || { total_orders: 0, total_spent: 0, average_order_value: 0 };
  }

  // Delete order (admin only)
  static async delete(orderId) {
    const result = await db.executeQuery(
      'DELETE FROM orders WHERE id = ?',
      [orderId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = OrderModel;
