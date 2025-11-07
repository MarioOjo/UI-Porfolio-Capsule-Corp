const database = require('../config/database');
const { AppError } = require('../utils/errors');

class CartModel {
  constructor() {
    this.table = 'cart_items';
    this.db = database;
  }

  /**
   * Get user's cart with product details
   */
  async getCart(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const query = `
        SELECT 
          ci.id AS cart_item_id,
          ci.product_id AS productId,
          ci.quantity,
          ci.created_at AS addedAt,
          ci.updated_at AS updatedAt,
          p.id,
          p.name,
          p.description,
          p.price,
          p.image,
          p.gallery,
          p.category,
          p.stock,
          p.in_stock AS inStock,
          p.slug,
          p.power_level AS powerLevel,
          p.featured,
          p.original_price AS originalPrice,
          p.tags
        FROM ${this.table} ci
        LEFT JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
        ORDER BY ci.created_at DESC
      `;
      
      const items = await this.db.executeQuery(query, [userId]);
      
      return items.map(item => ({
        id: item.id,
        cartItemId: item.cart_item_id,
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price) || 0,
        originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
        image: item.image,
        images: item.gallery ? JSON.parse(item.gallery) : [],
        category: item.category,
        stock: parseInt(item.stock) || 0,
        inStock: Boolean(item.inStock),
        slug: item.slug,
        powerLevel: parseInt(item.powerLevel) || 0,
        featured: Boolean(item.featured),
        quantity: parseInt(item.quantity) || 0,
        addedAt: item.addedAt,
        updatedAt: item.updatedAt,
        tags: item.tags ? JSON.parse(item.tags) : [],
        weight: item.weight,
        dimensions: item.dimensions,
        // Calculated fields
        totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
        isLowStock: (parseInt(item.stock) || 0) < (parseInt(item.quantity) || 0),
        hasDiscount: item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price)
      }));
    } catch (error) {
      console.error('CartModel.getCart Error:', error);
      throw new AppError('Failed to retrieve cart', 500);
    }
  }

  /**
   * Add or update item in cart
   */
  async addOrUpdateItem(userId, productId, quantity = 1, options = {}) {
    try {
      if (!userId || !productId) {
        throw new AppError('User ID and Product ID are required', 400);
      }

      const safeQuantity = Math.max(1, Math.min(999, parseInt(quantity) || 1));

      // Check product exists and is in stock
      const productCheck = await this.db.executeQuery(
        'SELECT id, stock, in_stock FROM products WHERE id = ?',
        [productId]
      );

      if (productCheck.length === 0) {
        throw new AppError('Product not found', 404);
      }

      const product = productCheck[0];
      if (!product.in_stock && product.stock <= 0) {
        throw new AppError('Product is out of stock', 400);
      }

      // Check if item already exists in cart
      const existingItem = await this.db.executeQuery(
        `SELECT id, quantity FROM ${this.table} WHERE user_id = ? AND product_id = ? LIMIT 1`,
        [userId, productId]
      );

      if (existingItem.length > 0) {
        // Update quantity
        const newQuantity = existingItem[0].quantity + safeQuantity;
        
        // Check stock availability
        if (product.stock > 0 && newQuantity > product.stock) {
          throw new AppError(`Only ${product.stock} items available in stock`, 400);
        }

        const updateQuery = `
          UPDATE ${this.table} 
          SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ? AND product_id = ?
        `;
        await this.db.executeQuery(updateQuery, [newQuantity, userId, productId]);
        
        return {
          action: 'updated',
          previousQuantity: existingItem[0].quantity,
          newQuantity: newQuantity,
          cartItemId: existingItem[0].id
        };
      } else {
        // Check stock availability for new item
        if (product.stock > 0 && safeQuantity > product.stock) {
          throw new AppError(`Only ${product.stock} items available in stock`, 400);
        }

        // Insert new item
        const insertQuery = `
          INSERT INTO ${this.table} (user_id, product_id, quantity) 
          VALUES (?, ?, ?)
        `;
        const result = await this.db.executeQuery(insertQuery, [userId, productId, safeQuantity]);
        
        return {
          action: 'added',
          quantity: safeQuantity,
          cartItemId: result.insertId
        };
      }
    } catch (error) {
      console.error('CartModel.addOrUpdateItem Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to add item to cart', 500);
    }
  }

  /**
   * Update item quantity by cart item ID
   */
  async updateQuantity(userId, itemId, quantity) {
    try {
      if (!userId || !itemId) {
        throw new AppError('User ID and Item ID are required', 400);
      }

      const safeQuantity = Math.max(0, Math.min(999, parseInt(quantity) || 0));

      if (safeQuantity === 0) {
        // Remove item if quantity is 0
        await this.removeItem(userId, itemId);
        return { action: 'removed', quantity: 0 };
      }

      // Check item exists and get product info for stock validation
      const itemCheck = await this.db.executeQuery(
        `SELECT ci.product_id, p.stock 
         FROM ${this.table} ci 
         LEFT JOIN products p ON ci.product_id = p.id 
         WHERE ci.id = ? AND ci.user_id = ?`,
        [itemId, userId]
      );

      if (itemCheck.length === 0) {
        throw new AppError('Cart item not found', 404);
      }

      const productStock = itemCheck[0].stock;
      if (productStock > 0 && safeQuantity > productStock) {
        throw new AppError(`Only ${productStock} items available in stock`, 400);
      }

      const query = `
        UPDATE ${this.table} 
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND id = ?
      `;
      await this.db.executeQuery(query, [safeQuantity, userId, itemId]);

      return { action: 'updated', quantity: safeQuantity };
    } catch (error) {
      console.error('CartModel.updateQuantity Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update cart item quantity', 500);
    }
  }

  /**
   * Update item quantity by product ID
   */
  async updateQuantityByProduct(userId, productId, quantity) {
    try {
      if (!userId || !productId) {
        throw new AppError('User ID and Product ID are required', 400);
      }

      const safeQuantity = Math.max(0, Math.min(999, parseInt(quantity) || 0));

      if (safeQuantity === 0) {
        await this.removeItemByProduct(userId, productId);
        return { action: 'removed', quantity: 0 };
      }

      // Check product stock
      const productCheck = await this.db.executeQuery(
        'SELECT stock FROM products WHERE id = ?',
        [productId]
      );

      if (productCheck.length === 0) {
        throw new AppError('Product not found', 404);
      }

      const productStock = productCheck[0].stock;
      if (productStock > 0 && safeQuantity > productStock) {
        throw new AppError(`Only ${productStock} items available in stock`, 400);
      }

      const query = `
        UPDATE ${this.table} 
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND product_id = ?
      `;
      const result = await this.db.executeQuery(query, [safeQuantity, userId, productId]);

      if (result.affectedRows === 0) {
        throw new AppError('Cart item not found', 404);
      }

      return { action: 'updated', quantity: safeQuantity };
    } catch (error) {
      console.error('CartModel.updateQuantityByProduct Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update cart item quantity', 500);
    }
  }

  /**
   * Remove item from cart by cart item ID
   */
  async removeItem(userId, itemId) {
    try {
      if (!userId || !itemId) {
        throw new AppError('User ID and Item ID are required', 400);
      }

      const query = `DELETE FROM ${this.table} WHERE user_id = ? AND id = ?`;
      const result = await this.db.executeQuery(query, [userId, itemId]);

      if (result.affectedRows === 0) {
        throw new AppError('Cart item not found', 404);
      }

      return { action: 'removed', itemId };
    } catch (error) {
      console.error('CartModel.removeItem Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to remove item from cart', 500);
    }
  }

  /**
   * Remove item from cart by product ID
   */
  async removeItemByProduct(userId, productId) {
    try {
      if (!userId || !productId) {
        throw new AppError('User ID and Product ID are required', 400);
      }

      const query = `DELETE FROM ${this.table} WHERE user_id = ? AND product_id = ?`;
      const result = await this.db.executeQuery(query, [userId, productId]);

      if (result.affectedRows === 0) {
        throw new AppError('Cart item not found', 404);
      }

      return { action: 'removed', productId };
    } catch (error) {
      console.error('CartModel.removeItemByProduct Error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to remove item from cart', 500);
    }
  }

  /**
   * Clear user's entire cart
   */
  async clearCart(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const query = `DELETE FROM ${this.table} WHERE user_id = ?`;
      const result = await this.db.executeQuery(query, [userId]);

      return { 
        action: 'cleared', 
        itemsRemoved: result.affectedRows 
      };
    } catch (error) {
      console.error('CartModel.clearCart Error:', error);
      throw new AppError('Failed to clear cart', 500);
    }
  }

  /**
   * Get cart statistics
   */
  async getCartStats(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const query = `
        SELECT 
          COUNT(*) as itemCount,
          SUM(ci.quantity) as totalQuantity,
          SUM(ci.quantity * p.price) as subtotal
        FROM ${this.table} ci
        LEFT JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
      `;
      
      const stats = await this.db.executeQuery(query, [userId]);
      const stat = stats[0] || {};
      
      const subtotal = parseFloat(stat.subtotal) || 0;
      const shippingCost = subtotal > 500 ? 0 : 25.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shippingCost + tax;

      return {
        itemCount: parseInt(stat.itemCount) || 0,
        totalQuantity: parseInt(stat.totalQuantity) || 0,
        subtotal,
        shippingCost,
        tax,
        total,
        hasFreeShipping: subtotal > 500,
        freeShippingRemaining: Math.max(0, 500 - subtotal),
        freeShippingProgress: Math.min((subtotal / 500) * 100, 100)
      };
    } catch (error) {
      console.error('CartModel.getCartStats Error:', error);
      throw new AppError('Failed to get cart statistics', 500);
    }
  }

  /**
   * Merge guest cart with user cart (for login/signup)
   */
  async mergeCarts(userId, guestCartItems) {
    try {
      if (!userId || !Array.isArray(guestCartItems)) {
        throw new AppError('User ID and guest cart items are required', 400);
      }

      const results = [];
      
      for (const guestItem of guestCartItems) {
        try {
          if (guestItem.productId && guestItem.quantity) {
            const result = await this.addOrUpdateItem(
              userId, 
              guestItem.productId, 
              guestItem.quantity,
              guestItem.options
            );
            results.push({
              productId: guestItem.productId,
              ...result
            });
          }
        } catch (itemError) {
          console.warn(`Failed to merge cart item ${guestItem.productId}:`, itemError);
          results.push({
            productId: guestItem.productId,
            error: itemError.message,
            success: false
          });
        }
      }

      return {
        merged: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        details: results
      };
    } catch (error) {
      console.error('CartModel.mergeCarts Error:', error);
      throw new AppError('Failed to merge carts', 500);
    }
  }

  /**
   * Validate cart items (check stock, availability, etc.)
   */
  async validateCart(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const cartItems = await this.getCart(userId);
      const validationResults = [];
      const invalidItems = [];

      for (const item of cartItems) {
        const issues = [];

        // Check stock availability
        if (item.stock > 0 && item.quantity > item.stock) {
          issues.push(`Only ${item.stock} items available (requested: ${item.quantity})`);
        }

        // Check if product is in stock
        if (!item.inStock && item.stock <= 0) {
          issues.push('Product is out of stock');
        }

        // Check if product still exists
        if (!item.name) {
          issues.push('Product no longer available');
        }

        const result = {
          productId: item.productId,
          cartItemId: item.cartItemId,
          name: item.name,
          quantity: item.quantity,
          stock: item.stock,
          inStock: item.inStock,
          issues,
          isValid: issues.length === 0
        };

        validationResults.push(result);
        
        if (!result.isValid) {
          invalidItems.push(result);
        }
      }

      return {
        totalItems: cartItems.length,
        validItems: validationResults.filter(r => r.isValid).length,
        invalidItems: invalidItems.length,
        details: validationResults,
        isValid: invalidItems.length === 0
      };
    } catch (error) {
      console.error('CartModel.validateCart Error:', error);
      throw new AppError('Failed to validate cart', 500);
    }
  }

  /**
   * Get cart item count (for badges/indicators)
   */
  async getCartItemCount(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const query = `
        SELECT SUM(quantity) as totalCount 
        FROM ${this.table} 
        WHERE user_id = ?
      `;
      
      const result = await this.db.executeQuery(query, [userId]);
      return parseInt(result[0]?.totalCount) || 0;
    } catch (error) {
      console.error('CartModel.getCartItemCount Error:', error);
      throw new AppError('Failed to get cart item count', 500);
    }
  }
}

module.exports = new CartModel();