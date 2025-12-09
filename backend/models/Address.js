const { mongoose } = require('../db/mongo');
const { Schema } = require('mongoose');

const AddressSchema = new Schema({
  legacyId: { type: Number, index: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: 'USA' },
  label: { type: String, default: 'Home' },
  full_name: { type: String },
  phone: { type: String },
  is_default: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date }
});

module.exports = mongoose && mongoose.models && mongoose.models.Address
  ? mongoose.models.Address
  : mongoose.model('Address', AddressSchema, 'user_addresses');
