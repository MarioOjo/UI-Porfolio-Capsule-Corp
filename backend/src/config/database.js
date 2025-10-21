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

    // Support a single connection string commonly provided by hosts like
    // Railway / Render (e.g. MYSQL_URL or DATABASE_URL with mysql://user:pass@host:port/db)
    // Accept several possible connection string env names (Railway/Render and custom)
  const rawConnString = process.env.MYSQL_URL || process.env.RAILWAY_MYSQL_URL || process.env.DATABASE_URL || process.env.CLEARDB_DATABASE_URL || process.env.MYSQL_CONNECTION_STRING;
    // If the environment explicitly provides DB_HOST (private networking on Railway
    // or similar) prefer the explicit host/user/password parts. This avoids accidentally
    // using a public/proxy host from MYSQL_URL which may present different credentials
    // or connectivity semantics. If DB_HOST is not set, fall back to parsing the
    // connection string.
    const preferParts = !!process.env.DB_HOST;
    const connString = !preferParts ? rawConnString : null;
    if (connString) {
      try {
        // URL API requires a scheme; connection strings from providers usually include it.
        const parsed = new URL(connString);
        // Only proceed if scheme looks like mysql
        if (['mysql:', 'mysql2:'].includes(parsed.protocol)) {
          const urlUser = parsed.username ? decodeURIComponent(parsed.username) : undefined;
          const urlPass = parsed.password ? decodeURIComponent(parsed.password) : undefined;
          const urlHost = parsed.hostname;
          const urlPort = parsed.port ? Number(parsed.port) : undefined;
          const urlDb = parsed.pathname && parsed.pathname.length > 1 ? decodeURIComponent(parsed.pathname.slice(1)) : undefined;

          if (urlHost) this.baseConfig.host = urlHost;
          if (urlUser) this.baseConfig.user = urlUser;
          if (urlPass) this.baseConfig.password = urlPass;
          if (urlDb) this.baseConfig.database = urlDb;
          if (urlPort) this.baseConfig.port = urlPort;
        }
      } catch (e) {
        console.warn('\u26a0\ufe0f  Could not parse connection string in MYSQL_URL/DATABASE_URL:', e.message);
      }
    }

    // If no URL-style connection string was provided (or we deliberately prefer
    // explicit parts via DB_HOST), support Railway-provided parts as a fallback
    if (!connString) {
      const partHost = process.env.MYSQLHOST || process.env.RAILWAY_PRIVATE_DOMAIN || process.env.DB_HOST;
      const partUser = process.env.MYSQLUSER || process.env.DB_USER;
      const partPass = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD;
      const partDb = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME;
      const partPort = process.env.MYSQLPORT || process.env.DB_PORT;
      if (partHost) {
        if (partHost) this.baseConfig.host = partHost;
        if (partUser) this.baseConfig.user = partUser;
        if (partPass) this.baseConfig.password = partPass;
        if (partDb) this.baseConfig.database = partDb;
        if (partPort) this.baseConfig.port = Number(partPort);
      }
    }

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
    // Optional raw TCP-level check to help diagnose private-network overlays (fd12 IPv6 addresses).
    // Enable by setting DB_DEBUG_TCP_CHECK=true in the environment where the backend runs.
    const doTcpDebug = ['1', 'true', 'TRUE', 'yes', 'on'].includes(String(process.env.DB_DEBUG_TCP_CHECK || '').trim());
    const tcpTimeout = Number(process.env.DB_DEBUG_TCP_CHECK_TIMEOUT_MS || 3000);
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // If configured, attempt a raw TCP connect to the resolved host/port to get clearer socket errors in logs.
        if (doTcpDebug && this.baseConfig && this.baseConfig.host) {
          try {
            await this._tcpCheck(this.baseConfig.host, this.baseConfig.port || 3306, tcpTimeout);
            console.log(`🔍 TCP check succeeded to ${this.baseConfig.host}:${this.baseConfig.port || 3306}`);
          } catch (tcpErr) {
            console.warn(`🔍 TCP check failed to ${this.baseConfig.host}:${this.baseConfig.port || 3306} — ${tcpErr.message}`);
            // Continue — we'll still try the mysql driver connection which will produce the original error.
          }
        }
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

  // Perform a raw TCP connect to help differentiate overlay/DNS issues vs MySQL server not listening.
  _tcpCheck(host, port, timeoutMs = 3000) {
    return new Promise((resolve, reject) => {
      try {
        const net = require('net');
        const socket = new net.Socket();
        let resolved = false;
        const onError = (err) => {
          if (resolved) return;
          resolved = true;
          socket.destroy();
          reject(err);
        };
        socket.setTimeout(timeoutMs, () => onError(new Error('TCP timeout')));
        socket.once('error', onError);
        socket.once('connect', () => {
          if (resolved) return;
          resolved = true;
          socket.end();
          resolve();
        });
        socket.connect(port, host);
      } catch (e) {
        reject(e);
      }
    });
  }

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

  // Return a small masked summary of the resolved DB config for logging/debugging.
  getResolvedConfig() {
    const cfg = this.baseConfig || {};
    return {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      database: cfg.database,
      ssl: !!cfg.ssl,
      // Never reveal passwords in logs
      password: cfg.password ? '****' : undefined
    };
  }
}

module.exports = new DatabaseConnection();