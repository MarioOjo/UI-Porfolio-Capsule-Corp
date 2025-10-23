const database = require('../config/database');

class CartModel {
  constructor() {
    this.table = 'cart_items';
    this.db = database;
  }

  async getCart(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_id = ?`;
    const items = await this.db.executeQuery(query, [userId]);
    return items.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity
    }));
  }

  async addOrUpdateItem(userId, productId, quantity) {
    // Check if item exists
    const query = `SELECT * FROM ${this.table} WHERE user_id = ? AND product_id = ? LIMIT 1`;
    const items = await this.db.executeQuery(query, [userId, productId]);
    if (items.length > 0) {
      // Update quantity
      const updateQuery = `UPDATE ${this.table} SET quantity = ? WHERE user_id = ? AND product_id = ?`;
      await this.db.executeQuery(updateQuery, [quantity, userId, productId]);
    } else {
      // Insert new item
      const insertQuery = `INSERT INTO ${this.table} (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      await this.db.executeQuery(insertQuery, [userId, productId, quantity]);
    }
  }

  async updateQuantity(userId, itemId, quantity) {
    const query = `UPDATE ${this.table} SET quantity = ? WHERE user_id = ? AND id = ?`;
    await this.db.executeQuery(query, [quantity, userId, itemId]);
  }

  async removeItem(userId, itemId) {
    const query = `DELETE FROM ${this.table} WHERE user_id = ? AND id = ?`;
    await this.db.executeQuery(query, [userId, itemId]);
  }
}

module.exports = new CartModel();
