const database = require('../config/database');

class AddressModel {
  constructor() {
    this.table = 'user_addresses';
    this.db = database;
  }

  async create(userId, address) {
    const {
      line1, line2 = null, city = null, state = null, zip = null, country = 'USA', label = 'Home'
    } = address;
    const query = `
      INSERT INTO ${this.table} (user_id, line1, line2, city, state, zip, country, label, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const result = await this.db.executeQuery(query, [userId, line1, line2, city, state, zip, country, label]);
    return { id: result.insertId, user_id: userId, ...address };
  }

  async listByUser(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`;
    return await this.db.executeQuery(query, [userId]);
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.table} WHERE id = ? AND deleted_at IS NULL`;
    const rows = await this.db.executeQuery(query, [id]);
    return rows[0] || null;
  }

  async update(id, address) {
    const fields = [];
    const values = [];
    const allowed = ['line1','line2','city','state','zip','country','label'];
    for (const k of allowed) {
      if (k in address) {
        fields.push(`${k} = ?`);
        values.push(address[k]);
      }
    }
    if (fields.length === 0) return null;
    const query = `UPDATE ${this.table} SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(id);
    await this.db.executeQuery(query, values);
    return this.findById(id);
  }

  async remove(id) {
    const query = `UPDATE ${this.table} SET deleted_at = NOW() WHERE id = ?`;
    await this.db.executeQuery(query, [id]);
  }
}

module.exports = new AddressModel();
