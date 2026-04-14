const Product = require('../models/Product');
const mongoose = require('mongoose');

const SLUG_ALIASES = {
  'senzu-bean-pack-10': 'senzu-bean-pack',
  'gravity-training-room': 'gravity-chamber-personal',
  'weighted-training-gi': 'weighted-training-clothes',
  'power-level-scouter': 'power-scouter-elite',
  'storage-capsule-1': 'laboratory-capsule',
  'vehicle-capsule-3': 'vehicle-capsule-set',
  'capsule-house-5': 'house-capsule-pro',
};

function buildSlugCandidates(slug) {
  const candidates = [slug];
  const canonical = SLUG_ALIASES[slug];
  if (canonical) candidates.push(canonical);

  for (const [legacySlug, canonicalSlug] of Object.entries(SLUG_ALIASES)) {
    if (canonicalSlug === slug) {
      candidates.push(legacySlug);
    }
  }

  return [...new Set(candidates)];
}

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

function buildListOptions(options = {}) {
  const page = Math.max(1, Number.parseInt(options.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(options.limit, 10) || 20));
  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder === 1 || options.sortOrder === 'asc' ? 1 : -1;
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: { [sortBy]: sortOrder }
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findById(id) {
  if (!Product) throw new Error('Mongo Product model not available');
  // Try numeric legacyId first
  const numeric = Number(id);
  let doc = null;
  if (!Number.isNaN(numeric)) {
    doc = await Product.findOne({ legacyId: numeric }).lean();
    if (doc) return normalize(doc);
  }

  // Try Mongo _id
  if (mongoose.Types.ObjectId.isValid(id)) {
    doc = await Product.findById(id).lean();
    if (doc) return normalize(doc);
  }

  return null;
}

async function findBySlug(slug) {
  if (!Product) throw new Error('Mongo Product model not available');
  const candidates = buildSlugCandidates(slug);
  const docs = await Product.find({ slug: { $in: candidates } }).lean();
  const doc = candidates.map((candidate) => docs.find((d) => d.slug === candidate)).find(Boolean) || null;
  return normalize(doc);
}

async function findAll(options = {}) {
  if (!Product) throw new Error('Mongo Product model not available');
  const list = buildListOptions(options);
  const docs = await Product.find({})
    .sort(list.sort)
    .skip(list.skip)
    .limit(list.limit)
    .lean();
  return docs.map(normalize);
}

async function findByCategory(category, options = {}) {
  if (!Product) throw new Error('Mongo Product model not available');
  const list = buildListOptions(options);
  const docs = await Product.find({ category })
    .sort(list.sort)
    .skip(list.skip)
    .limit(list.limit)
    .lean();
  return docs.map(normalize);
}

async function getFeatured(options = {}) {
  if (!Product) throw new Error('Mongo Product model not available');
  const list = buildListOptions(options);
  const docs = await Product.find({ featured: true })
    .sort(list.sort)
    .skip(list.skip)
    .limit(list.limit)
    .lean();
  return docs.map(normalize);
}

async function search(term, options = {}) {
  if (!Product) throw new Error('Mongo Product model not available');
  const queryText = String(term || '').trim();
  if (!queryText) {
    return findAll(options);
  }

  const list = buildListOptions(options);

  // Try indexed text search first for significantly better latency.
  const textDocs = await Product.find(
    { $text: { $search: queryText } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' }, created_at: -1 })
    .skip(list.skip)
    .limit(list.limit)
    .lean();

  if (textDocs.length > 0) {
    return textDocs.map(normalize);
  }

  // Fallback for terms that don't hit the text index.
  const re = new RegExp(escapeRegex(queryText), 'i');
  const docs = await Product.find({
    $or: [
      { name: re },
      { description: re },
      { category: re },
      { tags: re }
    ]
  })
    .sort(list.sort)
    .skip(list.skip)
    .limit(list.limit)
    .lean();
  return docs.map(normalize);
}

module.exports = { findById, findBySlug, findAll, findByCategory, search, getFeatured };
