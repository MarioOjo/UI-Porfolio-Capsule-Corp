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
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');

const app = express();
// No explicit app.options handler needed — the CORS middleware configured
// below will handle OPTIONS (preflight) requests. Removing the explicit
// handler avoids path-to-regexp parsing issues on some router versions.

// CORS: Allow localhost only for development
const allowedOrigins = [
  'http://localhost:3000',
  'https://capsulecorps.dev',
  process.env.FRONTEND_ORIGIN,
  'https://invigorating-mercy-production-9989.up.railway.app'
].filter(Boolean);
app.use(cors({
  origin: function(origin, callback) {
    // Always allow OPTIONS requests for CORS preflight
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // For OPTIONS, don't throw error, just deny
    callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Request-ID'],
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

// Runtime public config for frontend (small, safe set)
// This endpoint returns a JSON with only safe-to-expose values the frontend
// can read at runtime without a rebuild. Keep the surface minimal.
app.get('/env.json', (req, res) => {
  const publicConfig = {
    VITE_API_BASE: process.env.VITE_API_BASE || process.env.FRONTEND_API_BASE || '',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || ''
  };
  // Short cache header to allow updates within minutes but still be cached by CDNs
  res.set('Cache-Control', 'public, max-age=60');
  res.json(publicConfig);
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

// Dev-only DB info endpoint (guarded)
// Enable by setting ENABLE_DB_INFO=true in the environment for a running instance.
// Returns a masked summary of the resolved DB config to help confirm which DB a
// deployed instance is talking to (useful for debugging mismatched environments).
app.get('/_debug/db-info', (req, res) => {
  const enabled = ['1', 'true', 'TRUE', 'yes', 'on'].includes(String(process.env.ENABLE_DB_INFO || '').trim());
  if (!enabled) return res.status(404).json({ error: 'Not found' });
  try {
    const cfg = database.getResolvedConfig && database.getResolvedConfig();
    if (!cfg) return res.status(500).json({ error: 'DB config unavailable' });

    // Mask host for safety (show only first and last segments when possible)
    const maskHost = (h = '') => {
      try {
        if (!h) return h;
        const parts = h.split('.');
        if (parts.length <= 2) return `${parts[0][0]}***.${parts[parts.length - 1]}`;
        return `${parts[0][0]}***.${parts.slice(-2).join('.')}`;
      } catch (e) {
        return '***';
      }
    };

    const masked = Object.assign({}, cfg, { host: maskHost(cfg.host) });
    return res.json({ ok: true, db: masked });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
  }
});

// API Routes
app.use('/api/auth', authRoutes);

// Expose a single /api/me endpoint (keeps API surface explicit and avoids mounting
// the entire auth router under both /api and /api/auth which can cause route
// collisions). This handler mirrors the logic in `routes/auth.js` for the /me
// route but lives here to keep the top-level `/api` namespace predictable.
app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ user: null });
  }
  const token = authHeader.substring(7);
  try {
    const authService = require('./src/services/AuthService');
    const UserModel = require('./src/models/UserModel');
    const decoded = authService.verifyToken(token);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.json({ user: null });
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null
    };
    return res.json({ user: payload });
  } catch (e) {
    return res.json({ user: null });
  }
});
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/profile', profileRoutes);
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes); // Review routes include /api/products/:id/reviews and /api/reviews/:id

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
        // Print a short, masked summary including the source if the DB module set it.
  const summary = { host: dbInfo.host, port: dbInfo.port, database: dbInfo.database, ssl: dbInfo.ssl };
  if (dbInfo.source) summary.source = dbInfo.source;
        console.log('🔎 Resolved DB config:', summary);
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
    // Show only a concise startup failure message to avoid noisy objects in logs.
    console.error('❌ Startup failure:', e && e.message ? e.message : String(e));
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