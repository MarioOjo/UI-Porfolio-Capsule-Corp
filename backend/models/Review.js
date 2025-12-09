const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const ReviewSchema = new Schema({
  legacyId: { type: Number, index: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true },
  title: { type: String },
  comment: { type: String },
  verifiedPurchase: { type: Boolean, default: false },
  helpful_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes for query optimization
ReviewSchema.index({ productId: 1, created_at: -1 });
ReviewSchema.index({ userId: 1, created_at: -1 });
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose && mongoose.models && mongoose.models.Review
  ? mongoose.models.Review
  : mongoose.model('Review', ReviewSchema, 'reviews');
