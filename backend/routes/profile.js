const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const UserModel = require('../src/models/UserModel');
let userReader;
try { userReader = require('../adapters/userReader'); } catch (e) { }

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/profile - get current user profile
router.get('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const useMongo = ['1','true','TRUE','yes','on'].includes(String(process.env.USE_MONGO_FOR_USERS || '').trim());
  let user = null;
  if (useMongo && userReader && userReader.findById) {
    try { user = await userReader.findById(userId); } catch (e) { console.warn('userReader error:', e && e.message ? e.message : e); }
  }
  if (!user) user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, phone: user.phone } });
}));

// PUT /api/profile - update current user profile
router.put('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const allowed = ['username','email','firstName','lastName','phone','dateOfBirth'];
  const payload = {};
  for (const k of allowed) if (k in req.body) payload[k] = req.body[k];
  await UserModel.updateProfile(userId, payload);
  const updated = await UserModel.findById(userId);
  res.json({ user: { id: updated.id, email: updated.email, username: updated.username, firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone } });
}));

module.exports = router;
