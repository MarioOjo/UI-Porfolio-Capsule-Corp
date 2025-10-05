const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch (e) { bcrypt = require('bcryptjs'); }

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// POST /api/auth/signup
router.post('/signup', asyncHandler(async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const existing = await UserModel.findByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already exists' });
  
  const password_hash = await bcrypt.hash(password, 10);
  
  // Create username from firstName + lastName or email
  const generatedUsername = firstName && lastName 
    ? `${firstName} ${lastName}`.trim()
    : username || email.split('@')[0];
  
  const newUser = await UserModel.create({ 
    username: generatedUsername, 
    email, 
    password_hash 
  });
  
  // Return user wrapped in user property for frontend compatibility
  res.status(201).json({ 
    user: { 
      id: newUser.id, 
      email: newUser.email, 
      username: newUser.username 
    }
  });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  
  // Return user wrapped in user property for frontend compatibility
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username 
    }
  });
}));

// POST /api/auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  // For now just return success - could clear sessions here
  res.json({ message: 'Logged out successfully' });
}));

// GET /api/me
router.get('/me', asyncHandler(async (req, res) => {
  // For now return null - would check auth token here
  res.json({ user: null });
}));

module.exports = router;
