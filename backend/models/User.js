const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  legacyId: { type: Number, index: true },
  username: { type: String, index: true },
  email: { type: String, index: true },
  password_hash: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  google_id: { type: String, index: true },
  avatar: { type: String, default: 'goku' },
  role: { type: String, default: 'user' },
  phone: { type: String },
  dateOfBirth: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose && mongoose.models && mongoose.models.User
  ? mongoose.models.User
  : mongoose.model('User', UserSchema, 'users');
