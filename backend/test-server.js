// Quick server test without migrations
require('dotenv').config();
const express = require('express');
const app = express();

app.get('/health', (req, res) => res.json({ ok: true, test: 'simple' }));
app.get('/test', (req, res) => res.json({ message: 'Server alive!' }));

const PORT = 5001; // different port to avoid conflicts
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/health`);
});

// Keep alive
setInterval(() => {
  console.log(`[${new Date().toLocaleTimeString()}] Server still running...`);
}, 30000);
