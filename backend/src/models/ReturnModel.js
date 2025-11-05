const database = require('../config/database');

class ReturnModel {
  static async createReturn(userId, orderData, items, reason, customerNotes = null) {
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();

      // Generate unique return number
      const returnNumber = `RET-${Date.now()}-${userId}`;

      // Calculate total refund amount from items
      const refundAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      }, 0);

      // Insert return record
      const [returnResult] = await connection.query(
        `INSERT INTO returns 
        (return_number, user_id, order_id, order_number, reason, refund_amount, customer_notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [returnNumber, userId, orderData.orderId, orderData.orderNumber, reason, refundAmount, customerNotes]
      );

      const returnId = returnResult.insertId;

      // Insert return items
      for (const item of items) {
        await connection.query(
          `INSERT INTO return_items 
          (return_id, product_id, product_name, product_image, quantity, price, reason, condition_notes) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            returnId,
            item.productId,
            item.productName,
            item.productImage || null,
            item.quantity,
            item.price,
            item.reason || null,
            item.conditionNotes || null
          ]
        );
      }

      await connection.commit();

      return {
        id: returnId,
        returnNumber,
        status: 'pending',
        refundAmount,
        createdAt: new Date()
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getReturnsByUserId(userId, limit = 50, offset = 0) {
    const connection = await database.getConnection();
    try {
      const [returns] = await connection.query(
        `SELECT 
          r.*,
          COUNT(ri.id) as item_count
        FROM returns r
        LEFT JOIN return_items ri ON r.id = ri.return_id
        WHERE r.user_id = ?
        GROUP BY r.id
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      // Get items for each return
      for (const returnRecord of returns) {
        const [items] = await connection.query(
          `SELECT * FROM return_items WHERE return_id = ?`,
          [returnRecord.id]
        );
        returnRecord.items = items;
      }

      return returns;
    } finally {
      connection.release();
    }
  }

  static async getAllReturns(limit = 100, offset = 0, status = null) {
    const connection = await database.getConnection();
    try {
      let query = `
        SELECT 
          r.*,
          u.email as user_email,
          u.first_name,
          u.last_name,
          COUNT(ri.id) as item_count
        FROM returns r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN return_items ri ON r.id = ri.return_id
      `;

      const params = [];
      
      if (status) {
        query += ` WHERE r.status = ?`;
        params.push(status);
      }

      query += `
        GROUP BY r.id
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `;
      params.push(limit, offset);

      const [returns] = await connection.query(query, params);

      // Get items for each return
      for (const returnRecord of returns) {
        const [items] = await connection.query(
          `SELECT * FROM return_items WHERE return_id = ?`,
          [returnRecord.id]
        );
        returnRecord.items = items;
      }

      return returns;
    } finally {
      connection.release();
    }
  }

  static async getReturnById(returnId) {
    const connection = await database.getConnection();
    try {
      const [returns] = await connection.query(
        `SELECT 
          r.*,
          u.email as user_email,
          u.first_name,
          u.last_name,
          u.phone,
          o.shipping_address,
          o.total_amount as order_amount
        FROM returns r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN orders o ON r.order_id = o.id
        WHERE r.id = ?`,
        [returnId]
      );

      if (returns.length === 0) {
        return null;
      }

      const returnRecord = returns[0];

      // Get return items
      const [items] = await connection.query(
        `SELECT * FROM return_items WHERE return_id = ?`,
        [returnId]
      );

      returnRecord.items = items;

      return returnRecord;
    } finally {
      connection.release();
    }
  }

  static async getReturnByNumber(returnNumber) {
    const connection = await database.getConnection();
    try {
      const [returns] = await connection.query(
        `SELECT 
          r.*,
          u.email as user_email,
          u.first_name,
          u.last_name
        FROM returns r
        JOIN users u ON r.user_id = u.id
        WHERE r.return_number = ?`,
        [returnNumber]
      );

      if (returns.length === 0) {
        return null;
      }

      const returnRecord = returns[0];

      // Get return items
      const [items] = await connection.query(
        `SELECT * FROM return_items WHERE return_id = ?`,
        [returnRecord.id]
      );

      returnRecord.items = items;

      return returnRecord;
    } finally {
      connection.release();
    }
  }

  static async updateReturnStatus(returnId, status, adminId, adminNotes = null, refundMethod = null) {
    const connection = await database.getConnection();
    try {
      const updates = ['status = ?', 'processed_by = ?', 'processed_at = NOW()'];
      const params = [status, adminId];

      if (adminNotes) {
        updates.push('admin_notes = ?');
        params.push(adminNotes);
      }

      if (refundMethod) {
        updates.push('refund_method = ?');
        params.push(refundMethod);
      }

      params.push(returnId);

      const [result] = await connection.query(
        `UPDATE returns SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async updateRefundAmount(returnId, refundAmount) {
    const connection = await database.getConnection();
    try {
      const [result] = await connection.query(
        `UPDATE returns SET refund_amount = ? WHERE id = ?`,
        [refundAmount, returnId]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async cancelReturn(returnId, userId) {
    const connection = await database.getConnection();
    try {
      const [result] = await connection.query(
        `UPDATE returns 
        SET status = 'cancelled' 
        WHERE id = ? AND user_id = ? AND status = 'pending'`,
        [returnId, userId]
      );

      return result.affectedRows > 0;
    } finally {
      connection.release();
    }
  }

  static async getReturnStats() {
    const connection = await database.getConnection();
    try {
      const [stats] = await connection.query(
        `SELECT 
          COUNT(*) as total_returns,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          SUM(refund_amount) as total_refund_amount,
          AVG(refund_amount) as avg_refund_amount
        FROM returns`
      );

      return stats[0];
    } finally {
      connection.release();
    }
  }

  static async checkTableExists() {
    const connection = await database.getConnection();
    try {
      const [tables] = await connection.query(
        `SHOW TABLES LIKE 'returns'`
      );
      return tables.length > 0;
    } finally {
      connection.release();
    }
  }
}

module.exports = ReturnModel;
