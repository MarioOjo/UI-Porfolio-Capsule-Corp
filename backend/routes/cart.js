const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const CartModel = require('../src/models/CartModel');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/cart - fetch user's cart
router.get('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// POST /api/cart - add/update items in cart
router.post('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ error: 'Product and quantity required' });
  await CartModel.addOrUpdateItem(userId, productId, quantity);
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// PUT /api/cart/:itemId - update item quantity
router.put('/:itemId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { quantity } = req.body;
  const itemId = req.params.itemId;
  if (!quantity) return res.status(400).json({ error: 'Quantity required' });
  await CartModel.updateQuantity(userId, itemId, quantity);
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// DELETE /api/cart/:itemId - remove item from cart
router.delete('/:itemId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const itemId = req.params.itemId;
  await CartModel.removeItem(userId, itemId);
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

module.exports = router;
