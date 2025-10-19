import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Simple runtime API proxy: forwards requests from the frontend server to your backend
// This lets the deployed frontend call /api/* without requiring Vite to inline VITE_API_BASE
// Set the backend URL with the environment variable VITE_API_BASE or API_PROXY_TARGET
const API_TARGET = (process.env.VITE_API_BASE || process.env.API_PROXY_TARGET || '').replace(/\/$/, '') || null;

// Proxy middleware: only enable when API_TARGET is configured
if (API_TARGET) {
  app.use('/api', async (req, res, next) => {
    try {
      // Build target URL
      const targetUrl = API_TARGET + req.originalUrl;

      // Clone headers but remove host to avoid host mismatch
      const headers = Object.assign({}, req.headers);
      delete headers.host;

      // For non-GET requests, forward the request body stream; for GET, omit body
      const fetchOptions = {
        method: req.method,
        headers,
        redirect: 'manual'
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        // req is a readable stream; node-fetch / global fetch accepts a stream as body
        fetchOptions.body = req;
      }

      const proxyRes = await fetch(targetUrl, fetchOptions);

      // Forward status and headers
      res.status(proxyRes.status);
      proxyRes.headers.forEach((value, name) => {
        // Don't forward hop-by-hop headers that might interfere
        if (!['transfer-encoding', 'connection', 'keep-alive', 'upgrade'].includes(name.toLowerCase())) {
          res.setHeader(name, value);
        }
      });

      // Stream response body to client
      const reader = proxyRes.body?.getReader?.();
      if (reader) {
        // If Response.body is a stream with getReader (WHATWG), read chunks
        const stream = new ReadableStream({
          start(controller) {
            function pump() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                pump();
              }).catch(err => controller.error(err));
            }
            pump();
          }
        });
        const respBuffer = await new Response(stream).arrayBuffer();
        return res.send(Buffer.from(respBuffer));
      }

      // Fallback: buffer entire response
      const buf = Buffer.from(await proxyRes.arrayBuffer());
      return res.send(buf);
    } catch (err) {
      // If proxying fails, log and return 502 so client sees an error
      console.error('API proxy error:', err);
      return res.status(502).json({ error: 'API proxy error', detail: String(err) });
    }
  });
} else {
  console.warn('API proxy disabled: set VITE_API_BASE or API_PROXY_TARGET to enable /api proxying');
}

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, { maxAge: '1y', etag: true, immutable: true }));

// SPA fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Lightweight health endpoint for probes
app.get('/health', (req, res) => {
  try {
    // Optionally ensure the built index exists
    const indexPath = path.join(distPath, 'index.html');
    const fs = require('fs');
    const exists = fs.existsSync(indexPath);
    return res.json({ ok: true, built: exists });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Frontend listening on port ${port}`);
});
