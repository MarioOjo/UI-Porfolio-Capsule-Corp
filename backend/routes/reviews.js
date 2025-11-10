const express = require('express');
const router = express.Router();
const ReviewModel = require('../src/models/ReviewModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/products/:productId/reviews - Get all reviews for a product
router.get('/products/:productId/reviews', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { sortBy = 'recent', limit = 50, offset = 0 } = req.query;
  
  const reviews = await ReviewModel.findByProductId(productId, { 
    sortBy, 
    limit: parseInt(limit), 
    offset: parseInt(offset) 
  });
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
  if (!title || title.trim().length > 200) {
    return res.status(400).json({ error: 'Review title must be less than 200 characters' });
  }
  if (!comment || comment.trim().length < 10) {
    return res.status(400).json({ error: 'Review comment must be at least 10 characters' });
  }
  if (comment.trim().length > 2000) {
    return res.status(400).json({ error: 'Review comment must be less than 2000 characters' });
  }
  
  // Check if user already reviewed this product
  const existingReview = await ReviewModel.getUserReview(userId, productId);
  if (existingReview) {
    return res.status(400).json({ 
      error: 'You have already reviewed this product. Please edit your existing review instead.',
      reviewId: existingReview.id
    });
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
    success: true,
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
  
  // Validate input if provided
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  if (title && title.trim().length > 200) {
    return res.status(400).json({ error: 'Review title must be less than 200 characters' });
  }
  if (comment && comment.trim().length < 10) {
    return res.status(400).json({ error: 'Review comment must be at least 10 characters' });
  }
  if (comment && comment.trim().length > 2000) {
    return res.status(400).json({ error: 'Review comment must be less than 2000 characters' });
  }
  
  const review = await ReviewModel.update(reviewId, userId, {
    rating: rating ? parseInt(rating) : undefined,
    title: title?.trim(),
    comment: comment?.trim()
  });
  
  if (!review) {
    return res.status(404).json({ error: 'Review not found or you are not authorized to edit it' });
  }
  
  res.json({ success: true, review });
}));

// DELETE /api/reviews/:reviewId - Delete a review (requires auth, own review only)
router.delete('/reviews/:reviewId', AuthMiddleware.authenticateToken, asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;
  
  const success = await ReviewModel.delete(reviewId, userId);
  
  if (!success) {
    return res.status(404).json({ error: 'Review not found or you are not authorized to delete it' });
  }
  
  res.json({ success: true, message: 'Review deleted successfully' });
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
