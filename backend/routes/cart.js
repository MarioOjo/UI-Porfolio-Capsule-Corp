const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const CartModel = require('../src/models/CartModel');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// helper to detect missing-table errors from MySQL
const isNoSuchTableError = (err) => {
  if (!err) return false;
  // mysql2 sets err.code for ER_NO_SUCH_TABLE, message may vary in different environments
  if (err.code === 'ER_NO_SUCH_TABLE') return true;
  const msg = String(err.message || '').toLowerCase();
  return msg.includes("doesn't exist") || msg.includes('does not exist') || msg.includes('unknown table');
};

// GET /api/cart - fetch user's cart
router.get('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res, next) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const cart = await CartModel.getCart(userId);
    res.json({ cart });
  } catch (err) {
    // If the cart table is missing in production, return an empty cart (temporary mitigation)
    if (isNoSuchTableError(err)) {
      console.warn('[cart] missing table detected, returning empty cart (temporary)');
      return res.json({ cart: [] });
    }
    throw err; // let asyncHandler / error handler process other errors
  }
}));

// POST /api/cart - add/update items in cart
router.post('/', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ error: 'Product and quantity required' });
  try {
    await CartModel.addOrUpdateItem(userId, productId, quantity);
    const cart = await CartModel.getCart(userId);
    res.json({ cart });
  } catch (err) {
    if (isNoSuchTableError(err)) {
      console.warn('[cart] missing table detected on add/update, returning empty cart (temporary)');
      return res.json({ cart: [] });
    }
    throw err;
  }
}));

// PUT /api/cart/:productId - update item quantity by product ID
router.put('/:productId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { quantity } = req.body;
  const productId = req.params.productId;
  if (!quantity) return res.status(400).json({ error: 'Quantity required' });
  try {
    await CartModel.updateQuantityByProduct(userId, productId, quantity);
    const cart = await CartModel.getCart(userId);
    res.json({ cart });
  } catch (err) {
    if (isNoSuchTableError(err)) {
      console.warn('[cart] missing table detected on update, returning empty cart (temporary)');
      return res.json({ cart: [] });
    }
    throw err;
  }
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
    if (isNoSuchTableError(err)) {
      console.warn('[cart] missing table detected on delete, returning empty cart (temporary)');
      return res.json({ cart: [] });
    }
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
    if (isNoSuchTableError(err)) {
      console.warn('[cart] missing table detected on sync, returning empty cart (temporary)');
      return res.json({ cart: [], synced: false });
    }
    throw err;
  }
}));

module.exports = router;
