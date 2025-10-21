// Local environment setup for development only
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

// Internal modules
const database = require('./src/config/database');
const DatabaseMigration = require('./src/utils/DatabaseMigration');
const emailService = require('./src/utils/emailService');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/orders');
const addressRoutes = require('./routes/addresses');
const profileRoutes = require('./routes/profile');

const app = express();

// CORS: Allow localhost only for development
const allowedOrigins = [
  'http://localhost:3000',
  'https://ui-porfolio-capsule-corp-production.up.railway.app',
  'https://invigorating-mercy-production-9989.up.railway.app'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}. Allowed: ${allowedOrigins.join(', ')}`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Root routes
app.get('/', (req, res) => res.json({ status: 'ok', version: 'db-integrated' }));
app.get('/health', async (req, res) => {
  try {
    await database.executeQuery('SELECT 1 as ok');
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'down', error: e.message });
  }
});

// Optional HTTP endpoint to run a raw TCP check to the resolved DB host/port.
// Enable only when DB_ALLOW_HTTP_TCP_CHECK=true to avoid exposing this in production unintentionally.
app.get('/db-tcp-check', async (req, res) => {
  const allow = ['1', 'true', 'TRUE', 'yes', 'on'].includes(String(process.env.DB_ALLOW_HTTP_TCP_CHECK || '').trim());
  if (!allow) return res.status(404).json({ error: 'Not found' });
  try {
    const cfg = database.getResolvedConfig();
    if (!cfg || !cfg.host) return res.status(400).json({ error: 'DB host not configured' });
    const timeout = Number(process.env.DB_DEBUG_TCP_CHECK_TIMEOUT_MS || 3000);
    await database._tcpCheck(cfg.host, cfg.port || 3306, timeout);
    res.json({ ok: true, host: cfg.host, port: cfg.port || 3306 });
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // For /api/me endpoint
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/profile', profileRoutes);

// Basic error handler
app.use((err, req, res, next) => { // eslint-disable-line
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await database.initialize();
    // Log a masked summary of the resolved DB config to help debugging in hosted logs
    try {
      const dbInfo = database.getResolvedConfig && database.getResolvedConfig();
      if (dbInfo) {
        console.log('🔎 Resolved DB config:', Object.assign({}, dbInfo, { password: '****' }));
      }
    } catch (e) {
      console.warn('⚠️  Could not read resolved DB config for logging:', e.message);
    }
    await DatabaseMigration.runMigrations();
  // await emailService.initialize(); // No longer needed with Resend
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server successfully listening on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
    
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });
  } catch (e) {
    console.error('❌ Startup failure:', e);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in development - just log the error
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Don't exit in development - just log the error
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

start();