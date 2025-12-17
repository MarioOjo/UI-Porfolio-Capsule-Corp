const Cart = require('../../models/Cart');
const Product = require('../../models/Product'); // Mongoose product model
const { AppError } = require('../utils/errors');

class CartModel {
  /**
   * Get user's cart with product details
   */
  async getCart(userId) {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      let cart = await Cart.findOne({ user_id: userId });
      if (!cart) return [];

      const productIds = cart.items.map(i => i.product_id);
      const products = await Product.find({ _id: { $in: productIds } });
      const productMap = new Map(products.map(p => [p._id.toString(), p]));

      return cart.items.map(item => {
        const p = productMap.get(item.product_id.toString());
        if (!p) return null; // Product might be deleted

        return {
          id: item._id, // cart item id
          cartItemId: item._id,
          productId: p._id,
          name: p.name,
          description: p.description,
          price: parseFloat(p.price) || 0,
          originalPrice: p.original_price ? parseFloat(p.original_price) : null,
          image: p.image,
          images: p.gallery || [],
          category: p.category,
          stock: parseInt(p.stock) || 0,
          inStock: Boolean(p.in_stock),
          slug: p.slug,
          powerLevel: parseInt(p.power_level) || 0,
          featured: Boolean(p.featured),
          quantity: parseInt(item.quantity) || 0,
          addedAt: item.added_at,
          updatedAt: item.updated_at,
          tags: p.tags || [],
          // Calculated fields
          totalPrice: (parseFloat(p.price) || 0) * (parseInt(item.quantity) || 0),
          isLowStock: (parseInt(p.stock) || 0) < (parseInt(item.quantity) || 0),
          hasDiscount: p.original_price && parseFloat(p.original_price) > parseFloat(p.price)
        };
      }).filter(Boolean); // Remove nulls
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
      const product = await Product.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (!product.in_stock || product.stock < safeQuantity) {
        throw new AppError('Product out of stock or insufficient quantity', 400);
      }

      let cart = await Cart.findOne({ user_id: userId });
      if (!cart) {
        cart = await Cart.create({ user_id: userId, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(i => i.product_id.toString() === productId.toString());

      if (existingItemIndex > -1) {
        // Update existing
        if (options.mode === 'set') {
          cart.items[existingItemIndex].quantity = safeQuantity;
        } else {
          cart.items[existingItemIndex].quantity += safeQuantity;
        }
        cart.items[existingItemIndex].updated_at = new Date();
      } else {
        // Add new
        cart.items.push({
          product_id: productId,
          quantity: safeQuantity,
          added_at: new Date(),
          updated_at: new Date()
        });
      }
      
      cart.updated_at = new Date();
      await cart.save();

      return this.getCart(userId);
    } catch (error) {
      console.error('CartModel.addOrUpdateItem Error:', error);
      throw error instanceof AppError ? error : new AppError('Failed to update cart', 500);
    }
  }
  
  async removeItem(userId, productId) {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      if (cart) {
        cart.items = cart.items.filter(i => i.product_id.toString() !== productId.toString());
        await cart.save();
      }
      return this.getCart(userId);
    } catch (error) {
      console.error('CartModel.removeItem Error:', error);
      throw new AppError('Failed to remove item from cart', 500);
    }
  }

  async clearCart(userId) {
    try {
      await Cart.deleteOne({ user_id: userId });
      return [];
    } catch (error) {
      console.error('CartModel.clearCart Error:', error);
      throw new AppError('Failed to clear cart', 500);
    }
  }
}

module.exports = new CartModel();
