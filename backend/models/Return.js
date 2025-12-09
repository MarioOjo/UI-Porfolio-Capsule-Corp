const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const ReturnItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  product_name: { type: String },
  product_image: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  reason: { type: String },
  condition_notes: { type: String }
});

const ReturnSchema = new Schema({
  legacyId: { type: Number, index: true },
  return_number: { type: String, required: true, unique: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  order_number: { type: String, required: true },
  reason: { type: String, required: true },
  refund_amount: { type: Number, required: true },
  customer_notes: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'completed'] },
  items: [ReturnItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.Return
  ? mongoose.models.Return
  : mongoose.model('Return', ReturnSchema, 'returns');
