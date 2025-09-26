const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'capsule_db',
      connectionLimit: 20,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z'
    };
  }

  async initialize() {
    try {
      this.pool = mysql.createPool(this.config);
      
      // Test connection
      const connection = await this.pool.getConnection();
      console.log('🔋 Database connected successfully!');
      connection.release();
      
      return this.pool;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  getPool() {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  async executeQuery(query, params = []) {
    try {
      const [rows] = await this.pool.execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async closeConnection() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Export singleton instance
module.exports = new DatabaseConnection();