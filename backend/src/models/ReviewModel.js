const Review = require('../../models/Review');
const User = require('../../models/User');
const Product = require('../../models/Product');

class ReviewModel {
  // Get all reviews (admin)
  static async getAll() {
    const reviews = await Review.find().sort({ created_at: -1 });
    return reviews.map(r => ({
      id: r._id,
      productId: r.productId,
      userId: r.userId,
      rating: r.rating,
      title: r.title,
      comment: r.body,
      verified: r.is_approved,
      date: r.created_at.toISOString().split('T')[0]
    }));
  }

  // Get all reviews for a product
  static async findByProductId(productId, options = {}) {
    const { sortBy = 'recent', limit = 50, offset = 0 } = options;
    let sort = { created_at: -1 };
    if (sortBy === 'rating_high') sort = { rating: -1, created_at: -1 };
    if (sortBy === 'rating_low') sort = { rating: 1, created_at: -1 };

    const reviews = await Review.find({ productId: productId })
      .sort(sort)
      .skip(offset)
      .limit(limit);

    // Populate user details manually
    const userIds = [...new Set(reviews.map(r => r.userId))];
    const users = await User.find({ _id: { $in: userIds } });
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    return reviews.map(r => {
      const u = userMap.get(r.userId.toString());
      return {
        id: r._id,
        productId: r.productId,
        userId: r.userId,
        rating: r.rating,
        title: r.title,
        comment: r.body,
        verified: r.is_approved,
        date: r.created_at.toISOString().split('T')[0],
        userName: u ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : 'Unknown',
        userEmail: u ? u.email : ''
      };
    });
  }

  // Get reviews by user
  static async findByUserId(userId) {
    const reviews = await Review.find({ userId: userId }).sort({ created_at: -1 });
    
    // Populate product details
    const productIds = [...new Set(reviews.map(r => r.productId))];
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    return reviews.map(r => {
      const p = productMap.get(r.productId.toString());
      return {
        id: r._id,
        productId: r.productId,
        userId: r.userId,
        rating: r.rating,
        title: r.title,
        comment: r.body,
        verified: r.is_approved,
        date: r.created_at.toISOString().split('T')[0],
        productName: p ? p.name : 'Unknown Product',
        productSlug: p ? p.slug : '',
        productImage: p ? p.image : ''
      };
    });
  }

  // Create a new review
  static async create(reviewData) {
    const { productId, userId, rating, title, comment, verifiedPurchase = false } = reviewData;
    if (!Number.isInteger(rating) || rating < 1 || rating > 7) {
      throw new Error('Rating must be an integer between 1 and 7');
    }

    const review = await Review.create({
      productId: productId,
      userId: userId,
      rating,
      title,
      body: comment,
      is_approved: verifiedPurchase
    });

    const u = await User.findById(userId);

    return {
      id: review._id,
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      title: review.title,
      comment: review.body,
      verified: review.is_approved,
      date: review.created_at.toISOString().split('T')[0],
      userName: u ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : 'Unknown'
    };
  }
  
  static async delete(id) {
    await Review.findByIdAndDelete(id);
    return true;
  }
}

module.exports = ReviewModel;

