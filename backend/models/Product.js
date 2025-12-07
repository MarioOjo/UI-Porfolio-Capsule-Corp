const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const ProductSchema = new Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true },
  slug: { type: String, index: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number },
  original_price: { type: Number },
  power_level: { type: Number, default: 0 },
  image: { type: String },
  gallery: { type: [String], default: [] },
  in_stock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  specifications: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Use collection name 'products' to mirror SQL table for easier mapping
module.exports = mongoose && mongoose.models && mongoose.models.Product
  ? mongoose.models.Product
  : mongoose.model('Product', ProductSchema, 'products');
