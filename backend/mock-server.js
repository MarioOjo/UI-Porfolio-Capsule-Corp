// Minimal mock server for local frontend testing when MySQL is not available
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'mock-ok' }));
app.get('/health', (req, res) => res.json({ ok: true, db: 'mock' }));
app.get('/api/products', (req, res) => {
  res.json([{ id: 1, name: 'Sample Capsule', price: 9.99 }]);
});
app.get('/api/auth/me', (req, res) => res.json({ user: null }));
app.get('/api/me', (req, res) => res.json({ user: null }));
app.get('/api/profile', (req, res) => res.json({ profile: null }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Mock API server listening on ${port}`));
