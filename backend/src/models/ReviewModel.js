const db = require('../config/database');

class ReviewModel {
  // Get all reviews for a product
  static async findByProductId(productId) {
    const query = `
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS verified,
        r.helpful_count AS helpful,
        r.created_at AS date,
        u.first_name || ' ' || u.last_name AS "userName",
        u.email AS "userEmail"
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [productId]);
    return result.rows;
  }

  // Get reviews by user
  static async findByUserId(userId) {
    const query = `
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS verified,
        r.helpful_count AS helpful,
        r.created_at AS date,
        p.name AS "productName",
        p.slug AS "productSlug",
        p.image AS "productImage"
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Create a new review
  static async create(reviewData) {
    const { productId, userId, rating, title, comment, verifiedPurchase = false } = reviewData;
    
    const query = `
      INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        product_id AS "productId",
        user_id AS "userId",
        rating,
        title,
        comment,
        verified_purchase AS verified,
        helpful_count AS helpful,
        created_at AS date
    `;
    
    try {
      const result = await db.query(query, [productId, userId, rating, title, comment, verifiedPurchase]);
      return result.rows[0];
    } catch (error) {
      // Handle duplicate review error
      if (error.code === '23505') { // Unique violation
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
        rating = COALESCE($1, rating),
        title = COALESCE($2, title),
        comment = COALESCE($3, comment),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING 
        id,
        product_id AS "productId",
        user_id AS "userId",
        rating,
        title,
        comment,
        verified_purchase AS verified,
        helpful_count AS helpful,
        updated_at AS date
    `;
    
    const result = await db.query(query, [rating, title, comment, reviewId, userId]);
    return result.rows[0];
  }

  // Delete a review
  static async delete(reviewId, userId) {
    const query = 'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await db.query(query, [reviewId, userId]);
    return result.rows.length > 0;
  }

  // Mark review as helpful (vote)
  static async markHelpful(reviewId, userId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Try to insert vote (will fail if already voted)
      const voteQuery = `
        INSERT INTO review_helpful_votes (review_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (review_id, user_id) DO NOTHING
        RETURNING id
      `;
      const voteResult = await client.query(voteQuery, [reviewId, userId]);
      
      // If vote was inserted, increment helpful count
      if (voteResult.rows.length > 0) {
        const updateQuery = `
          UPDATE reviews
          SET helpful_count = helpful_count + 1
          WHERE id = $1
          RETURNING helpful_count AS helpful
        `;
        const updateResult = await client.query(updateQuery, [reviewId]);
        await client.query('COMMIT');
        return { success: true, helpful: updateResult.rows[0]?.helpful };
      }
      
      await client.query('COMMIT');
      return { success: false, message: 'Already voted' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get average rating for a product
  static async getAverageRating(productId) {
    const query = `
      SELECT 
        ROUND(AVG(rating)::numeric, 1) AS "averageRating",
        COUNT(*) AS "totalReviews"
      FROM reviews
      WHERE product_id = $1
    `;
    const result = await db.query(query, [productId]);
    return result.rows[0];
  }

  // Get rating distribution for a product
  static async getRatingDistribution(productId) {
    const query = `
      SELECT 
        rating,
        COUNT(*) AS count
      FROM reviews
      WHERE product_id = $1
      GROUP BY rating
      ORDER BY rating DESC
    `;
    const result = await db.query(query, [productId]);
    
    // Initialize all ratings to 0
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result.rows.forEach(row => {
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
        WHERE o.user_id = $1 
        AND oi.product_id = $2
        AND o.status IN ('completed', 'shipped', 'delivered')
      ) AS purchased
    `;
    const result = await db.query(query, [userId, productId]);
    return result.rows[0]?.purchased || false;
  }
}

module.exports = ReviewModel;
