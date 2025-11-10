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
      google_id = null,
      avatar = 'goku' 
    } = userData;
    
    // DB uses snake_case column names (first_name, last_name)
    const query = `
      INSERT INTO ${this.table} (username, email, password_hash, first_name, last_name, google_id, avatar, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await this.db.executeQuery(query, [username, email, password_hash, firstName, lastName, google_id, avatar]);
    return { id: result.insertId, username, email, firstName, lastName, google_id, avatar };
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ? LIMIT 1`;
    const users = await this.db.executeQuery(query, [id]);
    const row = users[0] || null;
    return row ? this._normalize(row) : null;
  }

  async findByEmail(email) {
    const query = `SELECT * FROM ${this.table} WHERE email = ? LIMIT 1`;
    const users = await this.db.executeQuery(query, [email]);
    const row = users[0] || null;
    return row ? this._normalize(row) : null;
  }

  async findByGoogleId(googleId) {
    const query = `SELECT * FROM ${this.table} WHERE google_id = ? LIMIT 1`;
    const users = await this.db.executeQuery(query, [googleId]);
    const row = users[0] || null;
    return row ? this._normalize(row) : null;
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
    // Map camelCase incoming fields to DB snake_case columns
    const fieldMap = {
      username: 'username',
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      dateOfBirth: 'date_of_birth'
    };
    const updates = [];
    const values = [];
    for (const [incomingKey, dbCol] of Object.entries(fieldMap)) {
      if (incomingKey in profileData) {
        updates.push(`${dbCol} = ?`);
        values.push(profileData[incomingKey]);
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
    const query = `SELECT id, username, email, created_at, last_login, first_name, last_name FROM ${this.table} WHERE deleted_at IS NULL`;
    const rows = await this.db.executeQuery(query);
    return rows.map(r => this._normalize(r));
  }

  // Normalize DB row (snake_case) into camelCase object used by the app
  _normalize(row) {
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      password_hash: row.password_hash,
      firstName: row.first_name || row.firstName || null,
      lastName: row.last_name || row.lastName || null,
      google_id: row.google_id || row.googleId || null,
      avatar: row.avatar || 'goku',
      role: row.role || 'user', // Include role field (defaults to 'user')
      role_id: row.role_id || row.roleId || null,
      is_active: typeof row.is_active !== 'undefined' ? row.is_active : row.isActive,
      last_login: row.last_login,
      deleted_at: row.deleted_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      phone: row.phone || null,
      dateOfBirth: row.date_of_birth || row.dateOfBirth || null
    };
  }
}

module.exports = new UserModel();