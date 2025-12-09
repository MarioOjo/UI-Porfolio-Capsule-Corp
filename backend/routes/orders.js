const express = require('express');
const router = express.Router();
const OrderModel = require('../src/models/OrderModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const ValidationMiddleware = require('../src/middleware/ValidationMiddleware');
const { 
  createOrderValidation, 
  orderIdValidation,
  updateOrderStatusValidation,
  updateTrackingValidation,
  updateNotesValidation
} = require('../src/validators/orderValidators');

// Create new order (customer checkout)
router.post('/', createOrderValidation, ValidationMiddleware.handleValidationErrors, async (req, res) => {
  try {
    const orderData = req.body;
    const result = await OrderModel.create(orderData);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order_id: result.order_id,
      order_number: result.order_number
    });
  } catch (error) {
    // If error is a validation error, return field-specific details
    if (error && error.errors && Array.isArray(error.errors)) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map(e => ({ field: e.param || e.path, message: e.msg, value: e.value }))
      });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get all orders (admin only)
router.get('/', AuthMiddleware.requireAdmin, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      payment_status: req.query.payment_status,
      search: req.query.search,
      date_from: req.query.date_from,
      date_to: req.query.date_to
    };
    
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder === 'asc' ? 1 : -1
    };

    const result = await OrderModel.findAll(filters, options);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get order statistics (admin only)
router.get('/statistics', AuthMiddleware.requireAdmin, async (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    const stats = await OrderModel.getStatistics(date_from, date_to);
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
  }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// Get order by order number
router.get('/number/:orderNumber', async (req, res) => {
  try {
    const order = await OrderModel.findByOrderNumber(req.params.orderNumber);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// Get user's orders (shorthand - requires authentication)
router.get('/my-orders', AuthMiddleware.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder === 'asc' ? 1 : -1
    };
    
    const result = await OrderModel.findAll({ user_id: userId }, options);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get user's orders (by userId)
router.get('/user/:userId', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder === 'asc' ? 1 : -1
    };
    
    const result = await OrderModel.findAll({ user_id: req.params.userId }, options);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get user's order statistics (count, total spent, average)
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const userId = req.params.userId;
    const stats = await OrderModel.getUserStatistics(userId);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching user order stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics', details: error.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', AuthMiddleware.requireAdmin, orderIdValidation, updateOrderStatusValidation, ValidationMiddleware.handleValidationErrors, async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Get user_id from header (in production, extract from JWT)
    const userId = req.headers['x-user-id'];

    // Get order details for email notification
    const order = await OrderModel.findById(req.params.id);
    
    await OrderModel.updateStatus(req.params.id, status, userId, notes);
    
    // Send status update email
    if (order && order.metadata) {
      try {
        const metadata = JSON.parse(order.metadata);
        const customerEmail = metadata.email;
        const customerName = metadata.customer;
        
        if (customerEmail) {
          const emailService = require('../src/utils/emailService');
          await emailService.sendOrderStatusUpdate(
            customerEmail,
            customerName,
            order.order_number,
            status,
            metadata.tracking_number
          );
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the status update if email fails
      }
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status', details: error.message });
  }
});

// Update tracking information (admin only)
router.patch('/:id/tracking', AuthMiddleware.requireAdmin, orderIdValidation, updateTrackingValidation, ValidationMiddleware.handleValidationErrors, async (req, res) => {
  try {
    const { tracking_number, carrier } = req.body;

    await OrderModel.updateTracking(req.params.id, tracking_number, carrier);
    
    res.json({
      success: true,
      message: 'Tracking information updated successfully'
    });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ error: 'Failed to update tracking', details: error.message });
  }
});

// Update admin notes (admin only)
router.patch('/:id/notes', AuthMiddleware.requireAdmin, orderIdValidation, updateNotesValidation, ValidationMiddleware.handleValidationErrors, async (req, res) => {
  try {
    const { notes } = req.body;
    
    await OrderModel.updateAdminNotes(req.params.id, notes);
    
    res.json({
      success: true,
      message: 'Admin notes updated successfully'
    });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Failed to update notes', details: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', AuthMiddleware.requireAdmin, orderIdValidation, ValidationMiddleware.handleValidationErrors, async (req, res) => {
  try {
    const deleted = await OrderModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

module.exports = router;
