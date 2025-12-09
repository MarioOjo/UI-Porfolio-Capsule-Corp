const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const ContactSchema = new Schema({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  status: { type: String, default: 'new', enum: ['new', 'read', 'replied', 'archived'] },
  admin_notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.Contact
  ? mongoose.models.Contact
  : mongoose.model('Contact', ContactSchema, 'contact_messages');
