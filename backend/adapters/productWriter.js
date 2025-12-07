const Product = require('../models/Product');

function normalize(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj.legacyId || (obj._id ? String(obj._id) : null),
    name: obj.name,
    slug: obj.slug,
    description: obj.description,
    category: obj.category,
    price: obj.price,
    original_price: obj.original_price,
    power_level: obj.power_level,
    image: obj.image,
    gallery: Array.isArray(obj.gallery) ? obj.gallery : [],
    in_stock: Boolean(obj.in_stock),
    stock: obj.stock || 0,
    featured: Boolean(obj.featured),
    tags: Array.isArray(obj.tags) ? obj.tags : [],
    specifications: typeof obj.specifications === 'object' && obj.specifications !== null ? obj.specifications : {},
    created_at: obj.created_at || obj.createdAt || null,
    updated_at: obj.updated_at || obj.updatedAt || null
  };
}

async function create(productData) {
  const doc = new Product(Object.assign({}, productData));
  await doc.save();
  return normalize(doc);
}

async function update(id, productData) {
  const numeric = Number(id);
  let q = null;
  if (!Number.isNaN(numeric)) q = { legacyId: numeric };
  else q = { _id: id };
  const res = await Product.findOneAndUpdate(q, { $set: productData }, { new: true });
  return normalize(res);
}

async function remove(id) {
  const numeric = Number(id);
  let q = null;
  if (!Number.isNaN(numeric)) q = { legacyId: numeric };
  else q = { _id: id };
  const r = await Product.deleteOne(q);
  return r.deletedCount > 0;
}

module.exports = { create, update, remove };
