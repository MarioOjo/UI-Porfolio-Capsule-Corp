const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');
let bcrypt;
try { bcrypt = require('bcrypt'); } catch (e) { bcrypt = require('bcryptjs'); }
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const ValidationMiddleware = require('../src/middleware/ValidationMiddleware');
const {
  signupValidation,
  loginValidation,
  changePasswordValidation,
  passwordResetRequestValidation,
  passwordResetValidation
} = require('../src/validators/authValidators');

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// POST /api/auth/request-password-reset
router.post('/request-password-reset', 
  passwordResetRequestValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // Generate reset token (JWT, short expiry)
  const authService = require('../src/services/AuthService');
  const token = authService.generateToken({ id: user.id, email: user.email, type: 'password-reset' }, '1h');
  // Send email (use Resend/emailService)
  const emailService = require('../src/utils/emailService');
  await emailService.sendPasswordResetEmail(user.email, token);
  res.json({ message: 'Password reset email sent' });
}));

// POST /api/auth/reset-password
router.post('/reset-password',
  passwordResetValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
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

// POST /api/auth/change-password - authenticated route
router.post('/change-password',
  AuthMiddleware.authenticateToken,
  changePasswordValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // If there is no password hash (e.g., social login), disallow this flow
  if (!user.password_hash) return res.status(400).json({ error: 'Password change not supported for social login users' });

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

  const authService = require('../src/services/AuthService');
  const newHash = await authService.hashPassword(newPassword);
  await UserModel.updatePassword(userId, newHash);

  res.json({ message: 'Password changed successfully' });
}));

// POST /api/auth/signup
router.post('/signup',
  signupValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { email, password, username, firstName, lastName, avatar } = req.body;
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
    password_hash,
    firstName,
    lastName,
    avatar: avatar || 'goku'
  });
  // Fetch full user to get role
  const fullUser = await UserModel.findById(newUser.id);
  // Generate JWT token for new user
  const authService = require('../src/services/AuthService');
  const token = authService.signUserToken(fullUser);
  
  // Create avatar URL from selected avatar
  const avatarMap = {
    'goku': '🐉',
    'vegeta': '👑',
    'gohan': '📚',
    'piccolo': '👽',
    'bulma': '🔬',
    'krillin': '💪',
    'frieza': '😈',
    'trunks': '⚔️'
  };
  const avatarEmoji = avatarMap[fullUser.avatar] || '🐉';
  
  // Return user and token for frontend compatibility
  res.status(201).json({ 
    user: { 
      id: fullUser.id, 
      email: fullUser.email, 
      username: fullUser.username,
      firstName: fullUser.firstName || '',
      lastName: fullUser.lastName || '',
      displayName: fullUser.firstName && fullUser.lastName ? `${fullUser.firstName} ${fullUser.lastName}` : fullUser.username,
      photoURL: avatarEmoji,
      avatar: fullUser.avatar,
      role: fullUser.role || 'user'
    },
    token
  });
}));

// POST /api/auth/login
router.post('/login',
  loginValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  if (!user.password_hash) {
    console.error(`Login failed: User ${email} has no password hash`);
    return res.status(401).json({ error: 'Invalid credentials (no password set)' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  // Generate JWT token for user (includes role)
  const authService = require('../src/services/AuthService');
  const token = authService.signUserToken(user);
  
  // Create avatar URL from selected avatar
  const avatarMap = {
    'goku': '🐉',
    'vegeta': '👑',
    'gohan': '📚',
    'piccolo': '👽',
    'bulma': '🔬',
    'krillin': '💪',
    'frieza': '😈',
    'trunks': '⚔️'
  };
  const avatarEmoji = avatarMap[user.avatar] || '🐉';
  
  // Return user and token for frontend compatibility
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      displayName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
      photoURL: avatarEmoji,
      avatar: user.avatar,
      role: user.role || 'user'
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
    
    // Create avatar URL from selected avatar
    const avatarMap = {
      'goku': '🐉',
      'vegeta': '👑',
      'gohan': '📚',
      'piccolo': '👽',
      'bulma': '🔬',
      'krillin': '💪',
      'frieza': '😈',
      'trunks': '⚔️'
    };
    const avatarEmoji = avatarMap[user.avatar] || '🐉';
    
    // Normalize user shape returned to frontend
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      photoURL: avatarEmoji,
      avatar: user.avatar,
      role: user.role || 'user'
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
  const useMongo3 = ['1','true','TRUE','yes','on'].includes(String(process.env.USE_MONGO_FOR_USERS || '').trim());
  let user = null;
  if (useMongo3 && userReader && userReader.findByGoogleId) {
    try { user = await userReader.findByGoogleId(uid); } catch (e) { console.warn('userReader error:', e && e.message ? e.message : e); }
  }
  if (!user) user = await UserModel.findByGoogleId(uid);
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
  const token = authService.signUserToken(user);
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username, 
      firstName: user.firstName, 
      lastName: user.lastName,
      role: user.role || 'user'
    }, 
    token 
  });
}));

module.exports = router;
