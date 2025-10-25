// PATCH /api/addresses/:id/default - set default address for user
router.patch('/:id/default', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const addressId = req.params.id;
  // Unset previous default
  await AddressModel.unsetDefault(userId);
  // Set new default
  await AddressModel.setDefault(addressId, userId);
  const updated = await AddressModel.findById(addressId);
  res.json({ address: updated });
}));
const express = require('express');
const router = express.Router();
const AddressModel = require('../src/models/AddressModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/addresses - list for current user
router.get('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const list = await AddressModel.listByUser(userId);
  res.json({ addresses: list });
}));

// POST /api/addresses - create
router.post('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const created = await AddressModel.create(userId, req.body);
  res.status(201).json({ address: created });
}));

// PUT /api/addresses/:id - update
router.put('/:id', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const existing = await AddressModel.findById(req.params.id);
  if (!existing || Number(existing.user_id) !== Number(userId)) return res.status(404).json({ error: 'Address not found' });
  const updated = await AddressModel.update(req.params.id, req.body);
  res.json({ address: updated });
}));

// DELETE /api/addresses/:id - soft delete
router.delete('/:id', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const existing = await AddressModel.findById(req.params.id);
  if (!existing || Number(existing.user_id) !== Number(userId)) return res.status(404).json({ error: 'Address not found' });
  await AddressModel.remove(req.params.id);
  res.json({ ok: true });
}));

module.exports = router;
