const express = require('express');
const router = express.Router();
const ReviewModel = require('../src/models/ReviewModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/products/:productId/reviews - Get all reviews for a product
router.get('/products/:productId/reviews', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const reviews = await ReviewModel.findByProductId(productId);
  const stats = await ReviewModel.getAverageRating(productId);
  const distribution = await ReviewModel.getRatingDistribution(productId);
  
  res.json({ 
    reviews,
    averageRating: parseFloat(stats.averageRating) || 0,
    totalReviews: parseInt(stats.totalReviews) || 0,
    distribution
  });
}));

// POST /api/products/:productId/reviews - Create a new review (requires auth)
router.post('/products/:productId/reviews', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title, comment } = req.body;
  const userId = req.user.id;
  
  // Validate input
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Review title is required' });
  }
  if (!comment || comment.trim().length < 10) {
    return res.status(400).json({ error: 'Review comment must be at least 10 characters' });
  }
  
  // Check if user has purchased the product (for verified badge)
  const hasPurchased = await ReviewModel.hasUserPurchasedProduct(userId, productId);
  
  // Create review
  const review = await ReviewModel.create({
    productId,
    userId,
    rating: parseInt(rating),
    title: title.trim(),
    comment: comment.trim(),
    verifiedPurchase: hasPurchased
  });
  
  // Get user name for response
  const userName = req.user.first_name 
    ? `${req.user.first_name} ${req.user.last_name || ''}`.trim()
    : req.user.username || req.user.email.split('@')[0];
  
  res.status(201).json({ 
    review: {
      ...review,
      userName,
      userEmail: req.user.email
    }
  });
}));

// GET /api/users/me/reviews - Get current user's reviews (requires auth)
router.get('/users/me/reviews', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const reviews = await ReviewModel.findByUserId(req.user.id);
  res.json({ reviews });
}));

// PUT /api/reviews/:reviewId - Update a review (requires auth, own review only)
router.put('/reviews/:reviewId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const userId = req.user.id;
  
  const review = await ReviewModel.update(reviewId, userId, {
    rating: rating ? parseInt(rating) : undefined,
    title: title?.trim(),
    comment: comment?.trim()
  });
  
  if (!review) {
    return res.status(404).json({ error: 'Review not found or unauthorized' });
  }
  
  res.json({ review });
}));

// DELETE /api/reviews/:reviewId - Delete a review (requires auth, own review only)
router.delete('/reviews/:reviewId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  
  const success = await ReviewModel.delete(reviewId, userId);
  
  if (!success) {
    return res.status(404).json({ error: 'Review not found or unauthorized' });
  }
  
  res.json({ message: 'Review deleted successfully' });
}));

// POST /api/reviews/:reviewId/helpful - Mark a review as helpful (requires auth)
router.post('/reviews/:reviewId/helpful', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  
  const result = await ReviewModel.markHelpful(reviewId, userId);
  
  if (!result.success) {
    return res.status(400).json({ error: result.message || 'Could not mark as helpful' });
  }
  
  res.json({ helpful: result.helpful });
}));

module.exports = router;
