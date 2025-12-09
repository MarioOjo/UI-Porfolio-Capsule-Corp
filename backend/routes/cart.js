const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const CartModel = require('../src/models/CartModel');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/cart - fetch user's cart
router.get('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res, next) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// POST /api/cart - add/update items in cart
router.post('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product and quantity required' });
  }
  await CartModel.addOrUpdateItem(userId, productId, quantity);
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// PUT /api/cart/:productId - update item quantity by product ID
router.put('/:productId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { quantity } = req.body;
  const productId = req.params.productId;
  if (!quantity) return res.status(400).json({ error: 'Quantity required' });
  await CartModel.updateQuantityByProduct(userId, productId, quantity);
  const cart = await CartModel.getCart(userId);
  res.json({ cart });
}));

// DELETE /api/cart/:productId - remove item from cart by product ID
router.delete('/:productId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const productId = req.params.productId;
  try {
    await CartModel.removeItemByProduct(userId, productId);
    const cart = await CartModel.getCart(userId);
    res.json({ cart });
  } catch (err) {
    throw err;
  }
}));

// POST /api/cart/sync - sync cart items (bulk operation)
router.post('/sync', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { items } = req.body;
  
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array' });
  }
  
  try {
    // Clear existing cart and add new items
    for (const item of items) {
      if (item.productId && item.quantity) {
        await CartModel.addOrUpdateItem(userId, item.productId, item.quantity);
      }
    }
    
    const cart = await CartModel.getCart(userId);
    res.json({ cart, synced: true });
  } catch (err) {
    throw err;
  }
}));

// POST /api/cart/clear - clear user's cart
router.post('/clear', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    await CartModel.clearCart(userId);
    res.json({ success: true, cart: [] });
  } catch (err) {
    throw err;
  }
}));

// POST /api/cart/merge - merge guest cart with user cart (on login/signup)
router.post('/merge', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { guestCart } = req.body;
  
  if (!Array.isArray(guestCart)) {
    return res.status(400).json({ error: 'Guest cart must be an array' });
  }
  
  try {
    const result = await CartModel.mergeCarts(userId, guestCart);
    const cart = await CartModel.getCart(userId);
    res.json({ cart, merged: result.merged, failed: result.failed });
  } catch (err) {
    throw err;
  }
}));

module.exports = router;
