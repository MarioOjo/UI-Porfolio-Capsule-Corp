const mysql = require('mysql2/promise');

class DatabaseConnection {
  constructor() {
    this.pool = null;
    // Support both DB_PASSWORD and legacy DB_PASS
    const password = process.env.DB_PASSWORD || process.env.DB_PASS || '';
    const port = Number(process.env.DB_PORT || 3306);
    this.baseConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password,
      database: process.env.DB_NAME || 'capsule_db',
      port,
      connectionLimit: 20,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z'
    };

    // Optional SSL support for managed MySQL providers
    // Enable by setting DB_SSL=true (or 1). Optionally provide CA via DB_SSL_CA or base64 via DB_SSL_CA_B64.
    const wantSSL = ['1', 'true', 'TRUE', 'yes', 'on'].includes(String(process.env.DB_SSL || '').trim());
    if (wantSSL) {
      const ssl = { rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false' };
      if (process.env.DB_SSL_CA) ssl.ca = process.env.DB_SSL_CA;
      if (process.env.DB_SSL_CA_B64) {
        try { ssl.ca = Buffer.from(process.env.DB_SSL_CA_B64, 'base64').toString('utf8'); } catch (e) {
          console.warn('⚠️  DB_SSL_CA_B64 could not be decoded:', e.message);
        }
      }
      this.baseConfig.ssl = ssl;
    }
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
      const trimmed = query.trim();
      // Skip USE commands entirely (pool already selects DB)
      if (/^USE\s+/i.test(trimmed)) {
        console.log('[DB] ℹ️  Skipping redundant USE statement:', trimmed.slice(0, 50));
        return [];
      }
      // Use .query() for DDL/admin commands (CREATE, DROP, etc.) to avoid ER_UNSUPPORTED_PS
      // Use .execute() for parameterized DML (INSERT, SELECT, UPDATE, DELETE)
      const method = params.length > 0 ? 'execute' : 'query';
      const [rows] = await this.getPool()[method](query, params);
      return rows;
    } catch (error) {
      console.error('[DB] Query error for:', query.slice(0, 80), error.message);
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