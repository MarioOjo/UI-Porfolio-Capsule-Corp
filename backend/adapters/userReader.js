const User = require('../models/User');
const mongoose = require('mongoose');

function normalize(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj.legacyId || (obj._id ? String(obj._id) : null),
    username: obj.username,
    email: obj.email,
    password_hash: obj.password_hash,
    firstName: obj.firstName || null,
    lastName: obj.lastName || null,
    google_id: obj.google_id || null,
    avatar: obj.avatar || 'goku',
    role: obj.role || 'user',
    phone: obj.phone || null,
    dateOfBirth: obj.dateOfBirth || null,
    created_at: obj.created_at || obj.createdAt || null,
    updated_at: obj.updated_at || obj.updatedAt || null
  };
}

async function findById(id) {
  if (!User) throw new Error('Mongo User model not available');
  const numeric = Number(id);
  let doc = null;
  if (!Number.isNaN(numeric)) {
    doc = await User.findOne({ legacyId: numeric }).lean();
    if (doc) return normalize(doc);
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    doc = await User.findById(id).lean();
    if (doc) return normalize(doc);
  }
  return null;
}

async function findByEmail(email) {
  if (!User) throw new Error('Mongo User model not available');
  const doc = await User.findOne({ email }).lean();
  return normalize(doc);
}

async function findByGoogleId(googleId) {
  if (!User) throw new Error('Mongo User model not available');
  const doc = await User.findOne({ google_id: googleId }).lean();
  return normalize(doc);
}

module.exports = { findById, findByEmail, findByGoogleId };
