require('dotenv').config();
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

const app = express();

// CORS: in development reflect the request origin so Vite can run on different ports.
// In production use an explicit FRONTEND_ORIGIN environment variable.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const corsOptions = (process.env.NODE_ENV === 'development')
  ? { origin: true, credentials: true } // reflect request origin (safe for dev only)
  : { origin: FRONTEND_ORIGIN, credentials: true };

app.use(cors(corsOptions));

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // For /api/me endpoint
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// Basic error handler
app.use((err, req, res, next) => { // eslint-disable-line
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

async function start() {
  try {
    await database.initialize();
    await DatabaseMigration.runMigrations();
    await emailService.initialize(); // Initialize email service
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