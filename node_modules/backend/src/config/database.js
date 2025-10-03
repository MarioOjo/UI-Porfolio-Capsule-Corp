const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseConnection {
  constructor() {
    this.pool = null;
    // Support both DB_PASSWORD and legacy DB_PASS
    const password = process.env.DB_PASSWORD || process.env.DB_PASS || '';
    this.baseConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password,
      database: process.env.DB_NAME || 'capsule_db',
      connectionLimit: 20,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z'
    };
  }

  async initialize(options = {}) {
    if (this.pool) return this.pool; // idempotent
    const {
      retries = 5,
      delayMs = 750
    } = options;

    const targetDb = this.baseConfig.database;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Try connecting directly first
        this.pool = mysql.createPool(this.baseConfig);
        const connection = await this.pool.getConnection();
        await connection.ping();
        connection.release();
        console.log(`🔋 Database connected (attempt ${attempt}) to '${targetDb}'`);
        return this.pool;
      } catch (error) {
        const msg = error.message || '';
        // Handle database not existing (ER_BAD_DB_ERROR)
        if (msg.includes('Unknown database') || error.code === 'ER_BAD_DB_ERROR') {
          console.warn(`⚠️  Database '${targetDb}' missing. Attempting to create...`);
          await this._createDatabase(targetDb);
          // Loop will retry creating pool next iteration
        } else if (error.code === 'ECONNREFUSED') {
          console.warn(`⏳ MySQL not reachable (attempt ${attempt}/${retries}) - ECONNREFUSED`);
        } else {
          console.warn(`⚠️  DB connection attempt ${attempt} failed: ${msg}`);
        }

        if (attempt === retries) {
          console.error('❌ Exhausted database connection retries.');
          throw error;
        }
        await this._sleep(delayMs * attempt); // exponential-ish backoff
      }
    }
  }

  async _createDatabase(dbName) {
    const { database, ...noDbConfig } = this.baseConfig; // omit database for creation
    const temp = await mysql.createConnection(noDbConfig);
    try {
      await temp.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Created database '${dbName}'`);
    } finally {
      await temp.end();
    }
  }

  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  getPool() {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  async executeQuery(query, params = []) {
    try {
      const [rows] = await this.getPool().execute(query, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async closeConnection() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('🔌 Database connection closed');
    }
  }
}

module.exports = new DatabaseConnection();