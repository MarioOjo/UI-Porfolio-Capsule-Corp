const Order = require('../../models/Order');

class OrderModel {
  // Create new order
  static async create(orderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = await Order.create({
        order_number: orderNumber,
        user_id: orderData.user_id || null,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone || null,
        
        shipping_address: {
          line1: orderData.shipping_address.street || orderData.shipping_address.line1,
          line2: orderData.shipping_address.line2 || null,
          city: orderData.shipping_address.city,
          state: orderData.shipping_address.state,
          zip: orderData.shipping_address.postal_code || orderData.shipping_address.zip,
          country: orderData.shipping_address.country || 'USA'
        },
        
        billing_address: {
          line1: orderData.billing_address?.street || orderData.billing_address?.line1 || orderData.shipping_address.street || orderData.shipping_address.line1,
          line2: orderData.billing_address?.line2 || orderData.shipping_address.line2 || null,
          city: orderData.billing_address?.city || orderData.shipping_address.city,
          state: orderData.billing_address?.state || orderData.shipping_address.state,
          zip: orderData.billing_address?.postal_code || orderData.billing_address?.zip || orderData.shipping_address.postal_code || orderData.shipping_address.zip,
          country: orderData.billing_address?.country || orderData.shipping_address.country || 'USA'
        },

        subtotal: orderData.subtotal,
        shipping_cost: orderData.shipping_cost || 0,
        tax: orderData.tax || 0,
        total: orderData.total,
        
        payment_method: orderData.payment_method,
        payment_status: orderData.payment_status || 'pending',
        transaction_id: orderData.transaction_id || null,
        
        status: 'pending',
        customer_notes: orderData.customer_notes || null,
        
        items: orderData.items.map(item => ({
          product_id: item.product_id || item.id,
          product_name: item.name,
          product_slug: item.slug || null,
          product_image: item.image || null,
          category: item.category || null,
          power_level: item.power_level || item.powerLevel || 0,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.quantity * item.price
        })),
        
        status_history: [{
          status: 'pending',
          notes: 'Order created'
        }]
      });
      
      return {
        order_id: order._id,
        order_number: orderNumber
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get all orders with filters
  static async findAll(filters = {}) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.user_id) query.user_id = filters.user_id;

      const orders = await Order.find(query).sort({ created_at: -1 });
      return orders.map(this._mapOrder);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const order = await Order.findById(id);
      if (!order) return null;
      return this._mapOrder(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }
  
  static async findByOrderNumber(orderNumber) {
    try {
      const order = await Order.findOne({ order_number: orderNumber });
      if (!order) return null;
      return this._mapOrder(order);
    } catch (error) {
      console.error('Error fetching order by number:', error);
      throw error;
    }
  }

  static async updateStatus(id, status, notes = null) {
    try {
      const order = await Order.findById(id);
      if (!order) return null;
      
      order.status = status;
      order.status_history.push({
        status,
        notes: notes || `Status updated to ${status}`,
        timestamp: new Date()
      });
      order.updated_at = new Date();
      
      await order.save();
      return this._mapOrder(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static _mapOrder(order) {
    return {
      id: order._id,
      order_number: order.order_number,
      user_id: order.user_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      tax: order.tax,
      total: order.total,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      transaction_id: order.transaction_id,
      status: order.status,
      customer_notes: order.customer_notes,
      items: order.items,
      status_history: order.status_history,
      created_at: order.created_at,
      updated_at: order.updated_at
    };
  }
}

module.exports = OrderModel;
