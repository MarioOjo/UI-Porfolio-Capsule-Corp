const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const ReturnModel = require('../src/models/ReturnModel');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Check if tables exist helper
const ensureTablesExist = async (req, res, next) => {
  try {
    const tablesExist = await ReturnModel.checkTableExists();
    if (!tablesExist) {
      return res.status(503).json({ 
        error: 'Returns feature not yet configured. Please run the database migration.' 
      });
    }
    next();
  } catch (error) {
    console.error('Error checking returns tables:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET /api/returns/user/:userId - Get all returns for a user
router.get('/user/:userId', AuthMiddleware.authenticateToken, ensureTablesExist, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requestingUserId = req.user && req.user.id;
  
  // Users can only see their own returns (unless admin)
  if (parseInt(userId) !== requestingUserId && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  
  const returns = await ReturnModel.getReturnsByUserId(parseInt(userId), limit, offset);
  
  res.json({ 
    returns,
    count: returns.length,
    limit,
    offset
  });
}));

// GET /api/returns/stats - Get return statistics (admin only)
router.get('/stats', AuthMiddleware.requireAdmin, ensureTablesExist, asyncHandler(async (req, res) => {
  const stats = await ReturnModel.getReturnStats();
  res.json({ stats });
}));

// GET /api/returns - Get all returns (admin only)
router.get('/', AuthMiddleware.requireAdmin, ensureTablesExist, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const offset = parseInt(req.query.offset) || 0;
  const status = req.query.status || null;
  
  const returns = await ReturnModel.getAllReturns(limit, offset, status);
  
  res.json({ 
    returns,
    count: returns.length,
    limit,
    offset,
    status: status || 'all'
  });
}));

// POST /api/returns - Create a return request
router.post('/', AuthMiddleware.authenticateToken, ensureTablesExist, asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  const { orderId, orderNumber, reason, items, customerNotes } = req.body;
  
  if (!orderId && !orderNumber) {
    return res.status(400).json({ error: 'Order ID or order number required' });
  }
  
  if (!reason || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Reason and items are required' });
  }

  // Validate items
  for (const item of items) {
    if (!item.productId || !item.productName || !item.quantity || !item.price) {
      return res.status(400).json({ 
        error: 'Each item must have productId, productName, quantity, and price' 
      });
    }
  }
  
  const orderData = {
    orderId: orderId || null,
    orderNumber: orderNumber || `ORD-${Date.now()}`
  };
  
  const returnRecord = await ReturnModel.createReturn(userId, orderData, items, reason, customerNotes);
  
  res.status(201).json({
    success: true,
    message: 'Return request received. Our team will contact you within 24 hours.',
    return: returnRecord
  });
}));

// GET /api/returns/number/:returnNumber - Get return by return number
router.get('/number/:returnNumber', AuthMiddleware.authenticateToken, ensureTablesExist, asyncHandler(async (req, res) => {
  const { returnNumber } = req.params;
  const userId = req.user && req.user.id;
  const isAdmin = req.user && req.user.isAdmin;
  
  const returnRecord = await ReturnModel.getReturnByNumber(returnNumber);
  
  if (!returnRecord) {
    return res.status(404).json({ error: 'Return not found' });
  }
  
  // Users can only see their own returns (unless admin)
  if (returnRecord.user_id !== userId && !isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ return: returnRecord });
}));

// GET /api/returns/:returnId - Get return details
router.get('/:returnId', AuthMiddleware.authenticateToken, ensureTablesExist, asyncHandler(async (req, res) => {
  const { returnId } = req.params;
  const userId = req.user && req.user.id;
  const isAdmin = req.user && req.user.isAdmin;
  
  const returnRecord = await ReturnModel.getReturnById(parseInt(returnId));
  
  if (!returnRecord) {
    return res.status(404).json({ error: 'Return not found' });
  }
  
  // Users can only see their own returns (unless admin)
  if (returnRecord.user_id !== userId && !isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json({ return: returnRecord });
}));

// PATCH /api/returns/:returnId/status - Update return status (admin only)
router.patch('/:returnId/status', AuthMiddleware.requireAdmin, ensureTablesExist, asyncHandler(async (req, res) => {
  const { returnId } = req.params;
  const { status, notes, refundMethod } = req.body;
  const adminId = req.user && req.user.id;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
    });
  }
  
  const updated = await ReturnModel.updateReturnStatus(
    parseInt(returnId), 
    status, 
    adminId, 
    notes, 
    refundMethod
  );
  
  if (!updated) {
    return res.status(404).json({ error: 'Return not found' });
  }
  
  res.json({
    success: true,
    message: 'Return status updated',
    returnId: parseInt(returnId),
    status
  });
}));

// PATCH /api/returns/:returnId/refund - Update refund amount (admin only)
router.patch('/:returnId/refund', AuthMiddleware.requireAdmin, ensureTablesExist, asyncHandler(async (req, res) => {
  const { returnId } = req.params;
  const { refundAmount } = req.body;
  
  if (refundAmount === undefined || refundAmount === null) {
    return res.status(400).json({ error: 'Refund amount is required' });
  }

  if (isNaN(refundAmount) || parseFloat(refundAmount) < 0) {
    return res.status(400).json({ error: 'Invalid refund amount' });
  }
  
  const updated = await ReturnModel.updateRefundAmount(parseInt(returnId), parseFloat(refundAmount));
  
  if (!updated) {
    return res.status(404).json({ error: 'Return not found' });
  }
  
  res.json({
    success: true,
    message: 'Refund amount updated',
    returnId: parseInt(returnId),
    refundAmount: parseFloat(refundAmount)
  });
}));

// POST /api/returns/:returnId/cancel - Cancel a return (user only, must be pending)
router.post('/:returnId/cancel', AuthMiddleware.authenticateToken, ensureTablesExist, asyncHandler(async (req, res) => {
  const { returnId } = req.params;
  const userId = req.user && req.user.id;
  
  const cancelled = await ReturnModel.cancelReturn(parseInt(returnId), userId);
  
  if (!cancelled) {
    return res.status(400).json({ 
      error: 'Return not found, not yours, or cannot be cancelled (must be pending)' 
    });
  }
  
  res.json({
    success: true,
    message: 'Return request cancelled',
    returnId: parseInt(returnId)
  });
}));

module.exports = router;
