// ...existing code...
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch (e) { bcrypt = require('bcryptjs'); }
const jwt = require('jsonwebtoken');

const {
  DB_HOST='localhost', DB_USER='root', DB_PASS='', DB_NAME='capsule_db', DB_PORT=3306,
  PORT=5000, JWT_SECRET='change_this_secret', JWT_EXPIRES='7d', FRONTEND_ORIGIN='http://localhost:5173'
} = process.env;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

const pool = mysql.createPool({
  host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME, port: Number(DB_PORT),
  waitForConnections: true, connectionLimit: 10, queueLimit: 0
}).promise();

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function signToken(payload){ return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES }); }
function setTokenCookie(res, token){
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, { httpOnly:true, secure:isProd, sameSite:'lax', maxAge:1000*60*60*24*7 });
}
function clearTokenCookie(res){ res.clearCookie('token', { httpOnly:true, sameSite:'lax' }); }

async function getUserByEmail(email) {
  // avoid requesting columns that may not exist (role_id caused the error)
  const [rows] = await pool.query(
    'SELECT id, email, password_hash, is_active, created_at FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, email, is_active, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
}

app.post('/api/auth/signup', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (await getUserByEmail(email)) return res.status(409).json({ error: 'Email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.execute('INSERT INTO users (email, password_hash, is_active) VALUES (?, ?, 1)', [email, hash]);
  const user = { id: result.insertId, email };
  const token = signToken({ sub: user.id, email: user.email });
  setTokenCookie(res, token);
  res.status(201).json({ user });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const row = await getUserByEmail(email);
  if (!row) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, row.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const user = { id: row.id, email: row.email };
  const token = signToken({ sub: user.id, email: user.email });
  setTokenCookie(res, token);
  res.json({ user });
}));

app.post('/api/auth/logout', asyncHandler(async (req, res) => { clearTokenCookie(res); res.json({ ok: true }); }));

app.get('/api/me', asyncHandler(async (req, res) => {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
}));

// ...existing code...
(async () => {
  try { await pool.query('SELECT 1'); console.log(`Connected to DB: ${DB_NAME}`); }
  catch (err) { console.error('Database connection failed:', err.message); process.exit(1); }
  app.listen(Number(PORT), () => console.log(`Server running on port ${PORT}`));
})();