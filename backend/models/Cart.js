const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const CartItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  added_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const CartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [CartItemSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.Cart
  ? mongoose.models.Cart
  : mongoose.model('Cart', CartSchema, 'carts');
