const db = require('../config/database');

class ReviewModel {
  // Get all reviews for a product
  static async findByProductId(productId, options = {}) {
    const { sortBy = 'recent', limit = 50, offset = 0 } = options;
    
    // Determine ORDER BY clause based on sortBy
    let orderClause;
    switch(sortBy) {
      case 'helpful':
        orderClause = 'r.helpful_count DESC, r.created_at DESC';
        break;
      case 'rating_high':
        orderClause = 'r.rating DESC, r.created_at DESC';
        break;
      case 'rating_low':
        orderClause = 'r.rating ASC, r.created_at DESC';
        break;
      case 'recent':
      default:
        orderClause = 'r.created_at DESC';
        break;
    }
    
    const query = `
      SELECT 
        r.id,
        r.product_id AS productId,
        r.user_id AS userId,
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS verified,
        r.helpful_count AS helpful,
        DATE_FORMAT(r.created_at, '%Y-%m-%d') AS date,
        CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS userName,
        u.email AS userEmail
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY ${orderClause}
      LIMIT ? OFFSET ?
    `;
    const rows = await db.executeQuery(query, [productId, limit, offset]);
    return rows || [];
  }

  // Get reviews by user
  static async findByUserId(userId) {
    const query = `
      SELECT 
        r.id,
        r.product_id AS productId,
        r.user_id AS userId,
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS verified,
        r.helpful_count AS helpful,
        DATE_FORMAT(r.created_at, '%Y-%m-%d') AS date,
        p.name AS productName,
        p.slug AS productSlug,
        p.image AS productImage
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    const rows = await db.executeQuery(query, [userId]);
    return rows || [];
  }

  // Create a new review
  static async create(reviewData) {
    const { productId, userId, rating, title, comment, verifiedPurchase = false } = reviewData;
    
    const query = `
      INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.executeQuery(query, [productId, userId, rating, title, comment, verifiedPurchase]);
      
      // Fetch the newly created review
      const selectQuery = `
        SELECT 
          id,
          product_id AS productId,
          user_id AS userId,
          rating,
          title,
          comment,
          verified_purchase AS verified,
          helpful_count AS helpful,
          DATE_FORMAT(created_at, '%Y-%m-%d') AS date
        FROM reviews
        WHERE id = ?
      `;
      const rows = await db.executeQuery(selectQuery, [result.insertId]);
      return rows[0];
    } catch (error) {
      // Handle duplicate review error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('You have already reviewed this product');
      }
      throw error;
    }
  }

  // Update a review
  static async update(reviewId, userId, updateData) {
    const { rating, title, comment } = updateData;
    
    const query = `
      UPDATE reviews
      SET 
        rating = COALESCE(?, rating),
        title = COALESCE(?, title),
        comment = COALESCE(?, comment),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    
    const result = await db.executeQuery(query, [rating, title, comment, reviewId, userId]);
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    // Fetch the updated review
    const selectQuery = `
      SELECT 
        id,
        product_id AS productId,
        user_id AS userId,
        rating,
        title,
        comment,
        verified_purchase AS verified,
        helpful_count AS helpful,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS date
      FROM reviews
      WHERE id = ?
    `;
    const rows = await db.executeQuery(selectQuery, [reviewId]);
    return rows[0];
  }

  // Delete a review
  static async delete(reviewId, userId) {
    const query = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
    const result = await db.executeQuery(query, [reviewId, userId]);
    return result.affectedRows > 0;
  }

  // Mark review as helpful (vote)
  static async markHelpful(reviewId, userId) {
    try {
      // Try to insert vote (will fail if already voted due to unique constraint)
      const voteQuery = `
        INSERT INTO review_helpful_votes (review_id, user_id)
        VALUES (?, ?)
      `;
      
      try {
        await db.executeQuery(voteQuery, [reviewId, userId]);
        
        // If vote was inserted, increment helpful count
        const updateQuery = `
          UPDATE reviews
          SET helpful_count = helpful_count + 1
          WHERE id = ?
        `;
        await db.executeQuery(updateQuery, [reviewId]);
        
        // Get updated count
        const selectQuery = 'SELECT helpful_count AS helpful FROM reviews WHERE id = ?';
        const rows = await db.executeQuery(selectQuery, [reviewId]);
        
        return { success: true, helpful: rows[0]?.helpful || 0 };
      } catch (error) {
        // Duplicate entry (already voted)
        if (error.code === 'ER_DUP_ENTRY') {
          return { success: false, message: 'You have already marked this review as helpful' };
        }
        throw error;
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }

  // Get average rating for a product
  static async getAverageRating(productId) {
    const query = `
      SELECT 
        ROUND(AVG(rating), 1) AS averageRating,
        COUNT(*) AS totalReviews
      FROM reviews
      WHERE product_id = ?
    `;
    const rows = await db.executeQuery(query, [productId]);
    return rows[0] || { averageRating: 0, totalReviews: 0 };
  }

  // Get rating distribution for a product
  static async getRatingDistribution(productId) {
    const query = `
      SELECT 
        rating,
        COUNT(*) AS count
      FROM reviews
      WHERE product_id = ?
      GROUP BY rating
      ORDER BY rating DESC
    `;
    const rows = await db.executeQuery(query, [productId]);
    
    // Initialize all ratings to 0
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach(row => {
      distribution[row.rating] = parseInt(row.count);
    });
    
    return distribution;
  }

  // Check if user has purchased product (for verified purchase badge)
  static async hasUserPurchasedProduct(userId, productId) {
    const query = `
      SELECT EXISTS(
        SELECT 1
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = ? 
        AND oi.product_id = ?
        AND o.status IN ('completed', 'shipped', 'delivered')
      ) AS purchased
    `;
    const rows = await db.executeQuery(query, [userId, productId]);
    return rows[0]?.purchased === 1;
  }
  
  // Get user's review for a specific product
  static async getUserReview(userId, productId) {
    const query = `
      SELECT 
        id,
        product_id AS productId,
        user_id AS userId,
        rating,
        title,
        comment,
        verified_purchase AS verified,
        helpful_count AS helpful,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS date
      FROM reviews
      WHERE user_id = ? AND product_id = ?
    `;
    const rows = await db.executeQuery(query, [userId, productId]);
    return rows[0] || null;
  }
}

module.exports = ReviewModel;

