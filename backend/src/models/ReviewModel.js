const db = require('../config/database');

class ReviewModel {
  // Get all reviews (admin)
  static async getAll() {
    const query = `
      SELECT id, product_id AS productId, user_id AS userId, rating, title, body AS comment, is_approved AS verified, DATE_FORMAT(created_at, '%Y-%m-%d') AS date
      FROM reviews
      ORDER BY created_at DESC
    `;
    return await db.executeQuery(query);
  }

  // Get all reviews for a product
  static async findByProductId(productId, options = {}) {
    const { sortBy = 'recent', limit = 50, offset = 0 } = options;
    let orderClause;
    switch (sortBy) {
      case 'helpful':
        orderClause = 'r.created_at DESC';
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

    const rows = await db.executeQuery(
      `SELECT
         r.id,
         r.product_id AS productId,
         r.user_id AS userId,
         r.rating,
         r.title,
         r.body AS comment,
         r.is_approved AS verified,
         DATE_FORMAT(r.created_at, '%Y-%m-%d') AS date,
         CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS userName,
         u.email AS userEmail
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY ${orderClause}
       LIMIT ? OFFSET ?`,
      [productId, limit, offset]
    );

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
        r.body AS comment,
        r.is_approved AS verified,
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
    // Validate rating is between 1 and 7
    if (!Number.isInteger(rating) || rating < 1 || rating > 7) {
      throw new Error('Rating must be an integer between 1 and 7');
    }

    const query = `
      INSERT INTO reviews (product_id, user_id, rating, title, body, is_approved)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.executeQuery(query, [productId, userId, rating, title, comment, verifiedPurchase ? 1 : 0]);

      const selectQuery = `
        SELECT
          id,
          product_id AS productId,
          user_id AS userId,
          rating,
          title,
          body AS comment,
          is_approved AS verified,
          DATE_FORMAT(created_at, '%Y-%m-%d') AS date
        FROM reviews
        WHERE id = ?
      `;
      const rows = await db.executeQuery(selectQuery, [result.insertId]);
      return rows[0];
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('You have already reviewed this product');
      }
      throw error;
    }
  }

  // Update a review
  static async update(reviewId, userId, updateData) {
    const { rating, title, comment } = updateData;
    // Validate rating if provided
    if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 7)) {
      throw new Error('Rating must be an integer between 1 and 7');
    }

    const query = `
      UPDATE reviews
      SET
        rating = COALESCE(?, rating),
        title = COALESCE(?, title),
        body = COALESCE(?, body),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;

    const result = await db.executeQuery(query, [rating, title, comment, reviewId, userId]);
    if (result.affectedRows === 0) return null;

    const selectQuery = `
      SELECT
        id,
        product_id AS productId,
        user_id AS userId,
        rating,
        title,
        body AS comment,
        is_approved AS verified,
        DATE_FORMAT(updated_at, '%Y-%m-%d') AS date
      FROM reviews
      WHERE id = ?
    `;
    const rows = await db.executeQuery(selectQuery, [reviewId]);
    return rows[0];
  }

  // Delete a review (if userId provided deletes only that user's review, otherwise admin delete)
  static async delete(reviewId, userId = null) {
    if (userId) {
      const result = await db.executeQuery('DELETE FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId]);
      return result.affectedRows > 0;
    }
    const result = await db.executeQuery('DELETE FROM reviews WHERE id = ?', [reviewId]);
    return result.affectedRows > 0;
  }

  // Mark review as helpful (vote)
  static async markHelpful(reviewId, userId) {
    try {
      const voteQuery = `INSERT INTO review_helpful_votes (review_id, user_id) VALUES (?, ?)`;
      try {
        await db.executeQuery(voteQuery, [reviewId, userId]);
        // Try to increment helpful_count if column exists; ignore errors
        try {
          await db.executeQuery('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?', [reviewId]);
        } catch (e) {
          // column might not exist; ignore
        }
        const rows = await db.executeQuery('SELECT helpful_count AS helpful FROM reviews WHERE id = ?', [reviewId]);
        return { success: true, helpful: rows[0]?.helpful || 0 };
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return { success: false, message: 'You have already marked this review as helpful' };
        throw error;
      }
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }

  // Get average rating for a product
  static async getAverageRating(productId) {
    const query = `SELECT ROUND(AVG(rating), 1) AS averageRating, COUNT(*) AS totalReviews FROM reviews WHERE product_id = ?`;
    const rows = await db.executeQuery(query, [productId]);
    return rows[0] || { averageRating: 0, totalReviews: 0 };
  }

  // Get rating distribution for a product
  static async getRatingDistribution(productId) {
  const query = `SELECT rating, COUNT(*) AS count FROM reviews WHERE product_id = ? GROUP BY rating ORDER BY rating DESC`;
  const rows = await db.executeQuery(query, [productId]);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  rows.forEach(row => { if (distribution.hasOwnProperty(row.rating)) distribution[row.rating] = parseInt(row.count); });
  return distribution;
  }

  // Check if user has purchased product (for verified purchase badge)
  static async hasUserPurchasedProduct(userId, productId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('completed','shipped','delivered')
      ) AS purchased
    `;
    const rows = await db.executeQuery(query, [userId, productId]);
    return rows[0]?.purchased === 1;
  }

  // Get user's review for a specific product
  static async getUserReview(userId, productId) {
    const query = `
      SELECT id, product_id AS productId, user_id AS userId, rating, title, body AS comment, is_approved AS verified, DATE_FORMAT(created_at, '%Y-%m-%d') AS date
      FROM reviews
      WHERE user_id = ? AND product_id = ?
    `;
    const rows = await db.executeQuery(query, [userId, productId]);
    return rows[0] || null;
  }
}

module.exports = ReviewModel;

