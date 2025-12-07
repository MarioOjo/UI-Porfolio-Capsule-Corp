const Contact = require('../../models/Contact');

class ContactModel {
  static async create(messageData) {
    try {
      const { name, email, subject, message, user_id = null } = messageData;
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        user_id,
        status: 'new'
      });
      return this.findById(contact._id);
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const contact = await Contact.findById(id);
      if (!contact) return null;
      return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        user_id: contact.user_id,
        admin_notes: contact.admin_notes,
        created_at: contact.created_at,
        updated_at: contact.updated_at
      };
    } catch (error) {
      console.error('Error fetching contact message by ID:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      const query = {};
      if (filters.status) query.status = filters.status;
      if (filters.email) query.email = filters.email;

      const contacts = await Contact.find(query).sort({ created_at: -1 }).limit(filters.limit ? parseInt(filters.limit) : 100);
      
      return contacts.map(c => ({
        id: c._id,
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        status: c.status,
        user_id: c.user_id,
        admin_notes: c.admin_notes,
        created_at: c.created_at,
        updated_at: c.updated_at
      }));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  }

  static async updateStatus(id, status, adminNotes = null) {
    try {
      const update = { status, updated_at: new Date() };
      if (adminNotes !== null) update.admin_notes = adminNotes;
      
      await Contact.findByIdAndUpdate(id, update);
      return this.findById(id);
    } catch (error) {
      console.error('Error updating contact message status:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await Contact.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error('Error deleting contact message:', error);
      throw error;
    }
  }
}

module.exports = ContactModel;
