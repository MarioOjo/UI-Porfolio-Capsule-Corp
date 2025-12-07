const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const OrderItemSchema = new Schema({
  product_id: { type: Number },
  product_name: { type: String },
  product_slug: { type: String },
  product_image: { type: String },
  category: { type: String },
  power_level: { type: Number },
  quantity: { type: Number },
  price: { type: Number },
  subtotal: { type: Number }
});

const OrderSchema = new Schema({
  legacyId: { type: Number, index: true },
  order_number: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.Mixed, index: true },
  customer_name: { type: String },
  customer_email: { type: String },
  customer_phone: { type: String },
  
  shipping_address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  
  billing_address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },

  subtotal: { type: Number },
  shipping_cost: { type: Number },
  tax: { type: Number },
  total: { type: Number },
  
  payment_method: { type: String },
  payment_status: { type: String },
  transaction_id: { type: String },
  
  status: { type: String, default: 'pending' },
  customer_notes: { type: String },
  
  items: [OrderItemSchema],
  status_history: [{
    status: String,
    notes: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.Order
  ? mongoose.models.Order
  : mongoose.model('Order', OrderSchema, 'orders');
