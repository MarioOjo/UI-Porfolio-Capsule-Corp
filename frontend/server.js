import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

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
