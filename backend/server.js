// Local environment setup for development only
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// CORS: Allow localhost and production origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://capsulecorps.dev',
  process.env.FRONTEND_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Request-ID', 'x-user-email', 'x-user-id'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// -------------------
// MongoDB Connection with retry
// -------------------
const MONGO_URI = process.env.MONGO_URI || '';
const MONGO_RETRY_INTERVAL_MS = Number(process.env.MONGO_RETRY_INTERVAL_MS || 5000);

let isMongoConnected = false;

async function connectMongoWithRetry() {
  if (!MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not set. Skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      // Modern options (no useNewUrlParser / useUnifiedTopology needed)
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ MongoDB connected successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.error('❌ MongoDB connection failed:', err.message);
    console.log(`⏱ Retrying MongoDB connection in ${MONGO_RETRY_INTERVAL_MS / 1000}s...`);
    setTimeout(connectMongoWithRetry, MONGO_RETRY_INTERVAL_MS);
  }
}

// Listen for disconnections and automatically retry
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
  isMongoConnected = false;
  setTimeout(connectMongoWithRetry, MONGO_RETRY_INTERVAL_MS);
});

// -------------------
// Health check endpoints
// -------------------
app.get('/health', async (req, res) => {
  // Return OK even if MongoDB is connecting to prevent Render restart loop
  const status = {
    ok: true,
    db: 'mongo',
    state: isMongoConnected ? 'connected' : 'connecting',
    timestamp: new Date().toISOString()
  };
  res.json(status);
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

// -------------------
// API Routes
// -------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api', emergencyRoutes);

// /api/me route
app.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ user: null });

  const token = authHeader.substring(7);
  try {
    const authService = require('./src/services/AuthService');
    const UserModel = require('./src/models/UserModel');
    const decoded = authService.verifyToken(token);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.json({ user: null });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        phone: user.phone || null,
        role: user.role || 'user'
      }
    });
  } catch {
    return res.json({ user: null });
  }
});

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
    const server = app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
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
