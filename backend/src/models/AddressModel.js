const Address = require('../../models/Address');

class AddressModel {
  async setDefault(addressId, userId) {
    // Unset all for user
    await Address.updateMany({ user_id: userId }, { is_default: false });
    // Set specific one
    await Address.findByIdAndUpdate(addressId, { is_default: true });
  }

  async unsetDefault(userId) {
    await Address.updateMany({ user_id: userId }, { is_default: false });
  }

  async create(userId, address) {
    const line1 = address.street || address.line1 || '';
    const line2 = address.line2 || null;
    const city = address.city || null;
    const state = address.state || null;
    const zip = address.zip || null;
    const country = address.country || 'USA';
    const label = address.name || address.label || address.type || 'Home';
    const fullName = address.fullName || '';
    const phone = address.phone || '';
    
    const newAddress = await Address.create({
      user_id: userId,
      line1,
      line2,
      city,
      state,
      zip,
      country,
      label,
      full_name: fullName,
      phone,
      is_default: false
    });
    
    return { 
      id: newAddress._id, 
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
    const addresses = await Address.find({ user_id: userId, deleted_at: null }).sort({ created_at: -1 });
    
    return addresses.map(row => ({
      id: row._id,
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
      type: 'home', // default or derive from label
      fullName: row.full_name || '',
      phone: row.phone || '',
      isDefault: row.is_default,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  async findById(id) {
    const row = await Address.findOne({ _id: id, deleted_at: null });
    
    if (!row) return null;
    
    return {
      id: row._id,
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
      type: 'home',
      fullName: row.full_name || '',
      phone: row.phone || '',
      isDefault: row.is_default,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
  
  async update(id, userId, data) {
    const update = { updated_at: new Date() };
    if (data.street || data.line1) update.line1 = data.street || data.line1;
    if (data.line2 !== undefined) update.line2 = data.line2;
    if (data.city) update.city = data.city;
    if (data.state) update.state = data.state;
    if (data.zip) update.zip = data.zip;
    if (data.country) update.country = data.country;
    if (data.name || data.label) update.label = data.name || data.label;
    if (data.fullName) update.full_name = data.fullName;
    if (data.phone) update.phone = data.phone;

    const updated = await Address.findOneAndUpdate(
      { _id: id, user_id: userId, deleted_at: null },
      update,
      { new: true }
    );
    
    if (!updated) return null;
    return this.findById(id);
  }

  async delete(id, userId) {
    const result = await Address.findOneAndUpdate(
      { _id: id, user_id: userId },
      { deleted_at: new Date() }
    );
    return !!result;
  }
}

module.exports = new AddressModel();
