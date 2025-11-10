const database = require('../config/database');

class AddressModel {
  async setDefault(addressId, userId) {
    // Set is_default = 1 for addressId, unset for others
    await this.db.executeQuery(`UPDATE ${this.table} SET is_default = 0 WHERE user_id = ?`, [userId]);
    await this.db.executeQuery(`UPDATE ${this.table} SET is_default = 1 WHERE id = ? AND user_id = ?`, [addressId, userId]);
  }

  async unsetDefault(userId) {
    await this.db.executeQuery(`UPDATE ${this.table} SET is_default = 0 WHERE user_id = ?`, [userId]);
  }
  constructor() {
    this.table = 'user_addresses';
    this.db = database;
  }

  async create(userId, address) {
    // Support both old format (line1, line2, label) and new format (street, fullName, type, name, phone)
    const line1 = address.street || address.line1 || '';
    const line2 = address.line2 || null;
    const city = address.city || null;
    const state = address.state || null;
    const zip = address.zip || null;
    const country = address.country || 'USA';
    const label = address.name || address.label || address.type || 'Home';
    const fullName = address.fullName || '';
    const phone = address.phone || '';
    
    const query = `
      INSERT INTO ${this.table} (user_id, line1, line2, city, state, zip, country, label, full_name, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const result = await this.db.executeQuery(query, [userId, line1, line2, city, state, zip, country, label, fullName, phone]);
    
    // Return in frontend format
    return { 
      id: result.insertId, 
      user_id: userId, 
      street: line1,
      line1,
      line2,
      city,
      state,
      zip,
      country,
      name: label,
      label,
      type: address.type || 'home',
      fullName,
      phone,
      isDefault: false
    };
  }

  async listByUser(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`;
    const rows = await this.db.executeQuery(query, [userId]);
    
    // Map database columns to frontend format
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      street: row.line1,
      line1: row.line1,
      line2: row.line2,
      city: row.city,
      state: row.state,
      zip: row.zip,
      country: row.country,
      name: row.label,
      label: row.label,
      type: row.type || 'home',
      fullName: row.full_name || '',
      phone: row.phone || '',
      isDefault: Boolean(row.is_default),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ? AND deleted_at IS NULL`;
    const rows = await this.db.executeQuery(query, [id]);
    const row = rows[0] || null;
    
    if (!row) return null;
    
    // Map to frontend format
    return {
      id: row.id,
      user_id: row.user_id,
      street: row.line1,
      line1: row.line1,
      line2: row.line2,
      city: row.city,
      state: row.state,
      zip: row.zip,
      country: row.country,
      name: row.label,
      label: row.label,
      type: row.type || 'home',
      fullName: row.full_name || '',
      phone: row.phone || '',
      isDefault: Boolean(row.is_default),
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  async update(id, address) {
    const fields = [];
    const values = [];
    
    // Map frontend fields to database columns
    const fieldMap = {
      street: 'line1',
      line1: 'line1',
      line2: 'line2',
      city: 'city',
      state: 'state',
      zip: 'zip',
      country: 'country',
      name: 'label',
      label: 'label',
      fullName: 'full_name',
      phone: 'phone',
      type: 'type'
    };
    
    for (const [frontendKey, dbColumn] of Object.entries(fieldMap)) {
      if (frontendKey in address) {
        fields.push(`${dbColumn} = ?`);
        values.push(address[frontendKey]);
      }
    }
    
    if (fields.length === 0) return await this.findById(id);
    
    const query = `UPDATE ${this.table} SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);
    await this.db.executeQuery(query, values);
    return await this.findById(id);
  }

  async remove(id) {
    const query = `UPDATE ${this.table} SET deleted_at = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [id]);
  }
}

module.exports = new AddressModel();
