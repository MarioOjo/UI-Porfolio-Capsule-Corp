const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch (e) { bcrypt = require('bcryptjs'); }

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// POST /api/auth/request-password-reset
router.post('/request-password-reset', asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // Generate reset token (JWT, short expiry)
  const authService = require('../src/services/AuthService');
  const token = authService.generateToken({ id: user.id, email: user.email, type: 'password-reset' }, '1h');
  // Send email (use Resend/emailService)
  const emailService = require('../../src/utils/emailService');
  await emailService.sendPasswordResetEmail(user.email, token);
  res.json({ message: 'Password reset email sent' });
}));

// POST /api/auth/reset-password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
  const authService = require('../src/services/AuthService');
  let decoded;
  try {
    decoded = authService.verifyToken(token);
    if (decoded.type !== 'password-reset') throw new Error('Invalid token type');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  const user = await UserModel.findById(decoded.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const password_hash = await authService.hashPassword(newPassword);
  await UserModel.updatePassword(user.id, password_hash);
  res.json({ message: 'Password updated successfully' });
}));

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
  // Generate JWT token for new user
  const authService = require('../src/services/AuthService');
  const token = authService.generateToken(newUser);
  // Return user and token for frontend compatibility
  res.status(201).json({ 
    user: { 
      id: newUser.id, 
      email: newUser.email, 
      username: newUser.username,
      firstName: newUser.firstName || '',
      lastName: newUser.lastName || '',
      displayName: newUser.firstName && newUser.lastName ? `${newUser.firstName} ${newUser.lastName}` : newUser.username,
      photoURL: newUser.photoURL || '',
    },
    token
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
  // Generate JWT token for user
  const authService = require('../src/services/AuthService');
  const token = authService.generateToken(user);
  // Return user and token for frontend compatibility
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      displayName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
      photoURL: user.photoURL || '',
    },
    token
  });
}));

// POST /api/auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  // For now just return success - could clear sessions here
  res.json({ message: 'Logged out successfully' });
}));

// GET /api/me
router.get('/me', asyncHandler(async (req, res) => {
  // Return user from our backend JWT if present
  const authHeader = req.headers.authorization;
  const authService = require('../src/services/AuthService');
  const UserModel = require('../src/models/UserModel');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ user: null });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = authService.verifyToken(token);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.json({ user: null });
    // Normalize user shape returned to frontend
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null
    };
    return res.json({ user: payload });
  } catch (e) {
    return res.json({ user: null });
  }
}));

// POST /api/auth/firebase-sync
// Accepts Firebase user info from the frontend after successful Firebase sign-in
// and creates or finds a backend user record, returning a backend JWT for API calls.
router.post('/firebase-sync', asyncHandler(async (req, res) => {
  const { uid, email, displayName } = req.body;
  if (!email || !uid) return res.status(400).json({ error: 'uid and email required' });
  const UserModel = require('../src/models/UserModel');
  const authService = require('../src/services/AuthService');

  // Try finding by google_id first, then by email
  let user = await UserModel.findByGoogleId(uid);
  if (!user) user = await UserModel.findByEmail(email);

  if (!user) {
    // Create a new user record linked to Google
    const names = (displayName || '').split(' ');
    const firstName = names.shift() || null;
    const lastName = names.join(' ') || null;
    const created = await UserModel.create({
      username: email.split('@')[0],
      email,
      password_hash: null,
      firstName,
      lastName,
      google_id: uid
    });
    user = await UserModel.findById(created.id);
  } else if (!user.google_id) {
    // If user exists by email but not linked, link the google_id
    await UserModel.linkGoogleAccount(user.id, uid);
    user = await UserModel.findById(user.id);
  }

  // Generate our backend JWT so frontend can call protected endpoints
  const token = authService.generateToken({ id: user.id, email: user.email });
  res.json({ user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName }, token });
}));

module.exports = router;
