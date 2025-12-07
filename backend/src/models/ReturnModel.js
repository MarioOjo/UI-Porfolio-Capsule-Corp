const Return = require('../../models/Return');

class ReturnModel {
  static async createReturn(userId, orderData, items, reason, customerNotes = null) {
    try {
      // Generate unique return number
      const returnNumber = `RET-${Date.now()}-${userId}`;

      // Calculate total refund amount from items
      const refundAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * parseInt(item.quantity));
      }, 0);

      const returnDoc = await Return.create({
        return_number: returnNumber,
        user_id: userId,
        order_id: orderData.orderId,
        order_number: orderData.orderNumber,
        reason,
        refund_amount: refundAmount,
        customer_notes: customerNotes,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.productId,
          product_name: item.productName,
          product_image: item.productImage || null,
          quantity: item.quantity,
          price: item.price,
          reason: item.reason || null,
          condition_notes: item.conditionNotes || null
        }))
      });

      return {
        id: returnDoc._id,
        returnNumber,
        status: 'pending',
        refundAmount,
        createdAt: returnDoc.created_at
      };
    } catch (error) {
      console.error('Error creating return:', error);
      throw error;
    }
  }

  static async getReturnsByUserId(userId, limit = 50, offset = 0) {
    try {
      const returns = await Return.find({ user_id: userId })
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);

      return returns.map(r => ({
        id: r._id,
        return_number: r.return_number,
        user_id: r.user_id,
        order_id: r.order_id,
        order_number: r.order_number,
        reason: r.reason,
        refund_amount: r.refund_amount,
        customer_notes: r.customer_notes,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        item_count: r.items.length,
        items: r.items
      }));
    } catch (error) {
      console.error('Error fetching returns by user ID:', error);
      throw error;
    }
  }

  static async getAllReturns(limit = 100, offset = 0, status = null) {
    try {
      const query = {};
      if (status) query.status = status;

      const returns = await Return.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit);

      // Note: In a real app we might want to populate user email here if we had a ref
      return returns.map(r => ({
        id: r._id,
        return_number: r.return_number,
        user_id: r.user_id,
        order_id: r.order_id,
        order_number: r.order_number,
        reason: r.reason,
        refund_amount: r.refund_amount,
        customer_notes: r.customer_notes,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: r.items
      }));
    } catch (error) {
      console.error('Error fetching all returns:', error);
      throw error;
    }
  }
  
  static async updateStatus(id, status, adminNotes = null) {
    try {
      // adminNotes not in schema but we can add it or ignore
      const update = { status, updated_at: new Date() };
      await Return.findByIdAndUpdate(id, update);
      return true;
    } catch (error) {
      console.error('Error updating return status:', error);
      throw error;
    }
  }
}

module.exports = ReturnModel;
