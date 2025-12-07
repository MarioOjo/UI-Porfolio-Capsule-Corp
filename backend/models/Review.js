const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const ReviewSchema = new Schema({
  legacyId: { type: Number, index: true },
  productId: { type: Schema.Types.Mixed, index: true },
  userId: { type: Schema.Types.Mixed, index: true },
  rating: { type: Number, required: true },
  title: { type: String },
  comment: { type: String },
  verifiedPurchase: { type: Boolean, default: false },
  helpful_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.Review
  ? mongoose.models.Review
  : mongoose.model('Review', ReviewSchema, 'reviews');
