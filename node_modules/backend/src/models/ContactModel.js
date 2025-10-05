const dbConnection = require('../config/database');

class ContactModel {
  static async create(messageData) {
    try {
      const pool = dbConnection.getPool();
      const { name, email, subject, message, user_id = null } = messageData;

      const query = `
        INSERT INTO contact_messages (
          name, email, subject, message, user_id, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'new', NOW(), NOW())
      `;

      const values = [name, email, subject, message, user_id];
      const [result] = await pool.execute(query, values);
      
      return this.findById(result.insertId);
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        SELECT 
          id, name, email, subject, message, status, user_id, admin_notes,
          created_at, updated_at
        FROM contact_messages 
        WHERE id = ?
      `;
      
      const [results] = await pool.execute(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error fetching contact message by ID:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      const pool = dbConnection.getPool();
      let query = `
        SELECT 
          id, name, email, subject, message, status, user_id, admin_notes,
          created_at, updated_at
        FROM contact_messages 
        WHERE 1=1
      `;
      const params = [];

      if (filters.status) {
        query += ` AND status = ?`;
        params.push(filters.status);
      }

      if (filters.email) {
        query += ` AND email = ?`;
        params.push(filters.email);
      }

      query += ` ORDER BY created_at DESC`;

      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(filters.limit));
      }

      const [results] = await pool.execute(query, params);
      return results;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }

  static async updateStatus(id, status, adminNotes = null) {
    try {
      const pool = dbConnection.getPool();
      const query = `
        UPDATE contact_messages 
        SET status = ?, admin_notes = ?, updated_at = NOW()
        WHERE id = ?
      `;

      await pool.execute(query, [status, adminNotes, id]);
      return this.findById(id);
    } catch (error) {
      console.error('Error updating contact message status:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const pool = dbConnection.getPool();
      const query = 'DELETE FROM contact_messages WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  }
}

module.exports = ContactModel;
