const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

const PORT = process.env.PORT || 3000;
const API_BASE = process.env.VITE_API_BASE || process.env.API_URL || 'https://capsule-corp-backend.onrender.com';

// Enable gzip compression
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve dynamic env.json with environment variables.
// Keep this route BEFORE static middleware so it isn't shadowed by dist/env.json.
app.get('/env.json', (req, res) => {
  const config = {
    VITE_API_BASE: process.env.VITE_API_BASE || process.env.API_URL || 'https://capsule-corp-backend.onrender.com',
    VITE_GA_ID: process.env.VITE_GA_ID || '',
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || '',
    VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || '',
    VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || ''
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(config);
});

// Serve static files from the dist directory with cache headers
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  etag: true,
  lastModified: true
}));

// For SPA routing, serve index.html for any unknown path
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

async function logBackendReachability() {
  if (!API_BASE) return;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      console.warn(`[startup] API health probe returned ${response.status} from ${API_BASE}/health`);
    } else {
      console.log(`[startup] API health probe OK: ${API_BASE}`);
    }
  } catch (error) {
    console.warn(`[startup] API health probe failed for ${API_BASE}: ${error.message || error}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on port ${PORT}`);
  console.log(`API Base: ${API_BASE}`);
  void logBackendReachability();
});
