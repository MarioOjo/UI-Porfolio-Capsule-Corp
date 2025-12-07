const Review = require('../models/Review');
const mongoose = require('mongoose');

function normalize(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj.legacyId || (obj._id ? String(obj._id) : null),
    productId: obj.productId,
    userId: obj.userId,
    rating: obj.rating,
    title: obj.title,
    comment: obj.comment,
    verifiedPurchase: Boolean(obj.verifiedPurchase),
    helpful_count: obj.helpful_count || 0,
    created_at: obj.created_at || obj.createdAt || null,
    updated_at: obj.updated_at || obj.updatedAt || null
  };
}

async function findByProductId(productId, options = {}) {
  if (!Review) throw new Error('Mongo Review model not available');
  const { sortBy = 'recent', limit = 50, offset = 0 } = options;
  const q = { productId };
  let sort = { created_at: -1 };
  if (sortBy === 'rating') sort = { rating: -1, created_at: -1 };
  const docs = await Review.find(q).sort(sort).skip(offset).limit(limit).lean();
  return docs.map(normalize);
}

async function getAverageRating(productId) {
  if (!Review) throw new Error('Mongo Review model not available');
  const agg = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (!agg || agg.length === 0) return { averageRating: 0, totalReviews: 0 };
  return { averageRating: agg[0].avg, totalReviews: agg[0].count };
}

async function getRatingDistribution(productId) {
  if (!Review) throw new Error('Mongo Review model not available');
  const agg = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);
  const distribution = { 1:0,2:0,3:0,4:0,5:0 };
  for (const row of agg) {
    distribution[row._id] = row.count;
  }
  return distribution;
}

async function findByUserId(userId) {
  if (!Review) throw new Error('Mongo Review model not available');
  const docs = await Review.find({ userId }).sort({ created_at: -1 }).lean();
  return docs.map(normalize);
}

async function getUserReview(userId, productId) {
  if (!Review) throw new Error('Mongo Review model not available');
  const doc = await Review.findOne({ userId, productId }).lean();
  return normalize(doc);
}

module.exports = { findByProductId, getAverageRating, getRatingDistribution, findByUserId, getUserReview };
