const express = require('express');
const router = express.Router();
const OrderModel = require('../src/models/OrderModel');

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
  // In production, implement proper JWT validation
  const userEmail = req.headers['x-user-email'];
  const isAdmin = userEmail?.includes('admin') || userEmail === 'mario@capsulecorp.com';
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Create new order (customer checkout)
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.customer_name || !orderData.customer_email || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await OrderModel.create(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order_id: result.order_id,
      order_number: result.order_number
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// Get all orders (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      payment_status: req.query.payment_status,
      search: req.query.search,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      limit: req.query.limit
    };

    const orders = await OrderModel.findAll(filters);
    
    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get order statistics (admin only)
router.get('/statistics', requireAdmin, async (req, res) => {
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

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await OrderModel.findAll({ user_id: req.params.userId });
    
    res.json({
      success: true,
      orders: orders,
      count: orders.length
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
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

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
router.patch('/:id/tracking', requireAdmin, async (req, res) => {
  try {
    const { tracking_number, carrier } = req.body;
    
    if (!tracking_number) {
      return res.status(400).json({ error: 'Tracking number is required' });
    }

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
router.patch('/:id/notes', requireAdmin, async (req, res) => {
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
router.delete('/:id', requireAdmin, async (req, res) => {
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
