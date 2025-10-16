const database = require('../config/database');

class UserModel {
  constructor() {
    this.table = 'users';
    this.db = database;
  }

  async create(userData) {
    const { 
      username, 
      email, 
      password_hash, 
      firstName = null, 
      lastName = null, 
      google_id = null 
    } = userData;
    
    const query = `
      INSERT INTO ${this.table} (username, email, password_hash, firstName, lastName, google_id, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const result = await this.db.executeQuery(query, [username, email, password_hash, firstName, lastName, google_id]);
    return { id: result.insertId, ...userData };
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ?`;
    const users = await this.db.executeQuery(query, [id]);
    return users[0] || null;
  }

  async findByEmail(email) {
    const query = `SELECT * FROM ${this.table} WHERE email = ?`;
    const users = await this.db.executeQuery(query, [email]);
    return users[0] || null;
  }

  async findByGoogleId(googleId) {
    const query = `SELECT * FROM ${this.table} WHERE google_id = ?`;
    const users = await this.db.executeQuery(query, [googleId]);
    return users[0] || null;
  }

  async updateLastLogin(id) {
    const query = `UPDATE ${this.table} SET last_login = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [id]);
  }

  async updatePassword(id, newPasswordHash) {
    const query = `UPDATE ${this.table} SET password_hash = ?, updated_at = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [newPasswordHash, id]);
  }

  async linkGoogleAccount(userId, googleId) {
    const query = `UPDATE ${this.table} SET google_id = ?, updated_at = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [googleId, userId]);
  }

  async updateProfile(id, profileData) {
    // Accept all editable fields, but only update those present in profileData
    const allowedFields = ['username', 'email', 'firstName', 'lastName', 'phone', 'dateOfBirth'];
    const updates = [];
    const values = [];
    for (const field of allowedFields) {
      if (field in profileData) {
        updates.push(`${field} = ?`);
        values.push(profileData[field]);
      }
    }
    if (updates.length === 0) return; // Nothing to update
    const query = `UPDATE ${this.table} SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);
    await this.db.executeQuery(query, values);
  }

  async softDelete(id) {
    const query = `UPDATE ${this.table} SET deleted_at = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [id]);
  }

  async getActiveUsers() {
    const query = `SELECT id, username, email, created_at, last_login FROM ${this.table} WHERE deleted_at IS NULL`;
    return await this.db.executeQuery(query);
  }
}

module.exports = new UserModel();