// Local environment setup for development only
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Validate environment variables before starting
const EnvValidator = require('./src/utils/EnvValidator');
EnvValidator.validate();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const compression = require('compression');
const { configureCloudinary } = require('./src/config/cloudinary');
const { connectMongoWithRetry, isMongoConnected } = require('./src/config/mongodb');
const SecurityMiddleware = require('./src/middleware/SecurityMiddleware');
const HealthCheck = require('./src/utils/HealthCheck');
const ResponseFormatter = require('./src/utils/ResponseFormatter');
const CacheManager = require('./src/utils/CacheManager');

// Internal modules
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
const returnsRoutes = require('./routes/returns');
const cartRoutes = require('./routes/cart');
const emergencyRoutes = require('./routes/emergency');

const app = express();

// Security headers
app.use(helmet());

// Logging and Compression
app.use(morgan('dev'));
app.use(compression());

// CORS: Allow localhost and production origins
const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

const defaultProductionOrigins = [
  'https://porfolio-app-ub7q.onrender.com',
  'https://capsule-corp-frontend.onrender.com',
  'https://capsulecorps.dev',
  'https://www.capsulecorps.dev'
];

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  ...defaultProductionOrigins,
  ...(process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim()) : []),
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : [])
].filter(Boolean).map(normalizeOrigin);

console.log('🔐 CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow Render frontends by host pattern to avoid brittle env mismatches.
    try {
      const parsed = new URL(normalizedOrigin);
      if (parsed.protocol === 'https:' && parsed.hostname.endsWith('.onrender.com')) {
        return callback(null, true);
      }
    } catch (_) {
      // ignore malformed origins and continue to rejection
    }

    // Log rejected origins for debugging
    console.warn('⚠️  CORS blocked origin:', normalizedOrigin);
    // Return false instead of throwing so browser sees a normal CORS rejection,
    // not a backend 500 response.
    callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Request-ID', 'x-user-email', 'x-user-id'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Workaround for express-mongo-sanitize compatibility with Express 5
// See: https://github.com/fiznool/express-mongo-sanitize/issues/202
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: req.query,
    writable: true,
    enumerable: true,
    configurable: true
  });
  next();
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// -------------------
// Cloudinary Configuration
// -------------------
const isCloudinaryConfigured = configureCloudinary();
if (isCloudinaryConfigured) {
  console.log('✅ Cloudinary configured for image uploads');
} else {
  console.warn('⚠️  Cloudinary not configured - products will work without image uploads');
}

// -------------------
// Health check endpoints
// -------------------
app.get('/health', async (req, res) => {
  const health = await HealthCheck.getStatus();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

app.get('/health/detailed', async (req, res) => {
  const health = await HealthCheck.getDetailedHealth();
  res.json(health);
});

// -------------------
// Public runtime config
// -------------------
app.get('/env.json', (req, res) => {
  const publicConfig = {
    VITE_API_BASE: process.env.VITE_API_BASE || process.env.FRONTEND_API_BASE || '',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || ''
  };
  res.set('Cache-Control', 'public, max-age=60');
  res.json(publicConfig);
});

// Apply rate limiting after health and runtime config endpoints so platform
// probes do not get blocked and trigger false-negative restarts.
app.use(SecurityMiddleware.strictRateLimit);

// Add response formatter to all routes
app.use(ResponseFormatter.middleware());

// -------------------
// API Routes
// -------------------
app.use('/api/auth', SecurityMiddleware.authRateLimit, authRoutes);
app.use('/api/products', CacheManager.middleware(300), productRoutes); // Cache products for 5 minutes
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api', emergencyRoutes);

// Note: /api/me is handled in auth routes

// -------------------
// Error handler
// -------------------
app.use((err, req, res, next) => { // eslint-disable-line
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// -------------------
// Server startup
// -------------------
async function start() {
  try {
    console.log('ℹ️  Starting server in Mongo-only mode...');
    await connectMongoWithRetry();

    const PORT = process.env.PORT || 5000;
    const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'; // Use localhost for dev, 0.0.0.0 for production
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ Server listening on ${HOST}:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (e) {
    console.error('❌ Startup failure:', e?.message || String(e));
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') process.exit(1);
});

start();
