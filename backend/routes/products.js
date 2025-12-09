const express = require('express');
const router = express.Router();
let productReader;
try {
  productReader = require('../adapters/productReader');
} catch (e) {
  // Adapter optional; if missing we'll just use SQL model
}
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const os = require('os');
const ValidationMiddleware = require('../src/middleware/ValidationMiddleware');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productSlugValidation,
  productQueryValidation
} = require('../src/validators/productValidators');

// Configure Cloudinary if env present
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
}

const upload = multer({ dest: os.tmpdir() });

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/products
router.get('/',
  productQueryValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { category, search, featured, page, limit, sortBy, sortOrder } = req.query;
    if (!productReader) return res.status(501).json({ error: 'Mongo product reader not available' });
    try {
      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sortBy: sortBy || 'created_at',
        sortOrder: sortOrder === 'asc' ? 1 : -1
      };
      
      let result;
      if (featured === 'true') {
        const products = await productReader.getFeatured();
        result = { products };
      } else if (category) {
        result = await productReader.findByCategory(category, options);
      } else if (search) {
        result = await productReader.search(search, options);
      } else {
        result = await productReader.findAll(options);
      }
      
      return res.json(result);
    } catch (err) {
      console.error('ProductReader (Mongo) list error:', err && err.message ? err.message : err);
      return res.status(500).json({ error: 'Failed to list products' });
    }
  }));

// GET /api/products/slug/:slug
// Specific routes MUST come before parameterized routes
router.get('/slug/:slug',
  productSlugValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  if (!productReader || !productReader.findBySlug) return res.status(501).json({ error: 'Mongo product reader not available' });
  try {
    const p = await productReader.findBySlug(req.params.slug);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product: p });
  } catch (err) {
    console.error('ProductReader (Mongo) slug error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
}));

// GET /api/products/:id
router.get('/:id',
  productIdValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  if (!productReader || !productReader.findById) return res.status(501).json({ error: 'Mongo product reader not available' });
  try {
    const p = await productReader.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product: p });
  } catch (err) {
    console.error('ProductReader (Mongo) error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
}));

// POST /api/products - Create new product (admin only)
router.post('/', upload.array('images'), createProductValidation, ValidationMiddleware.handleValidationErrors, asyncHandler(async (req, res) => {
  // If multipart/form-data with files
  if (req.files && req.files.length) {
    const uploadedUrls = [];
    try {
      for (const file of req.files) {
        if (process.env.CLOUDINARY_URL) {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
          uploadedUrls.push(result.secure_url);
        } else if (req.body.imageUrl) {
          // if Cloudinary not configured, use imageUrl (single)
          uploadedUrls.push(req.body.imageUrl);
        }
        try { fs.unlinkSync(file.path); } catch (e) { /* ignore */ }
      }
    } catch (uploadErr) {
      // cleanup any remaining temp files
      for (const file of req.files) { try { fs.unlinkSync(file.path); } catch (e) {} }
      throw uploadErr;
    }

    // Merge uploaded URLs with existing gallery URLs
    const existingGallery = req.body.gallery ? JSON.parse(req.body.gallery) : [];
    const gallery = [...uploadedUrls, ...existingGallery];
    
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      original_price: parseFloat(req.body.original_price),
      power_level: parseInt(req.body.power_level) || 0,
      image: gallery[0] || null,
      gallery,
      in_stock: req.body.in_stock === '1' || req.body.in_stock === 'true' || req.body.in_stock === 1,
      stock: parseInt(req.body.stock) || 0,
      featured: req.body.featured === '1' || req.body.featured === 'true' || req.body.featured === 1,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : {}
    };

    const useMongoWrite = ['1','true','TRUE','yes','on'].includes(String(process.env.USE_MONGO_WRITE_FOR_PRODUCTS || '').trim());
      // Always prefer Mongo writer
      let writer;
      try { writer = require('../adapters/productWriter'); } catch (e) { writer = null; }
      if (writer && writer.create) {
        const product = await writer.create(productData);
        return res.status(201).json({ product });
      }
      return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
  }

  // Non-multipart JSON
  const useMongoWrite = ['1','true','TRUE','yes','on'].includes(String(process.env.USE_MONGO_WRITE_FOR_PRODUCTS || '').trim());
  if (useMongoWrite) {
    let writer;
    try { writer = require('../adapters/productWriter'); } catch (e) { writer = null; }
    if (writer && writer.create) {
      const product = await writer.create(req.body);
      return res.status(201).json({ product });
    }
    return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
  }
  // Fallback: try to use Mongo writer if present
  let writerFallback;
  try { writerFallback = require('../adapters/productWriter'); } catch (e) { writerFallback = null; }
  if (writerFallback && writerFallback.create) {
    const product = await writerFallback.create(req.body);
    return res.status(201).json({ product });
  }
  return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
}));

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', upload.array('images'), updateProductValidation, ValidationMiddleware.handleValidationErrors, asyncHandler(async (req, res) => {
  if (req.files && req.files.length) {
    const uploadedUrls = [];
    try {
      for (const file of req.files) {
        if (process.env.CLOUDINARY_URL) {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
          uploadedUrls.push(result.secure_url);
        } else if (req.body.imageUrl) {
          uploadedUrls.push(req.body.imageUrl);
        }
        try { fs.unlinkSync(file.path); } catch (e) { }
      }
    } catch (uploadErr) {
      for (const file of req.files) { try { fs.unlinkSync(file.path); } catch (e) {} }
      throw uploadErr;
    }

    // Merge uploaded URLs with existing gallery URLs
    const existingGallery = req.body.gallery ? JSON.parse(req.body.gallery) : [];
    const gallery = [...uploadedUrls, ...existingGallery];
    
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      original_price: parseFloat(req.body.original_price),
      power_level: parseInt(req.body.power_level) || 0,
      image: gallery[0] || req.body.imageUrl || null,
      gallery,
      in_stock: req.body.in_stock === '1' || req.body.in_stock === 'true' || req.body.in_stock === 1,
      stock: parseInt(req.body.stock) || 0,
      featured: req.body.featured === '1' || req.body.featured === 'true' || req.body.featured === 1,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      specifications: req.body.specifications ? JSON.parse(req.body.specifications) : {}
    };

    let writer;
    try { writer = require('../adapters/productWriter'); } catch (e) { writer = null; }
    if (writer && writer.update) {
      const product = await writer.update(req.params.id, productData);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json({ product });
    }
    return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
  }

  // JSON body
  let writer;
  try { writer = require('../adapters/productWriter'); } catch (e) { writer = null; }
  if (writer && writer.update) {
    const product = await writer.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product });
  }
  return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
}));

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', productIdValidation, ValidationMiddleware.handleValidationErrors, asyncHandler(async (req, res) => {
  let writer;
  try { writer = require('../adapters/productWriter'); } catch (e) { writer = null; }
  if (writer && writer.remove) {
    const success = await writer.remove(req.params.id);
    if (!success) return res.status(404).json({ error: 'Product not found' });
    return res.json({ message: 'Product deleted successfully' });
  }
  return res.status(501).json({ error: 'Product write path not available (no Mongo writer)'});
}));

module.exports = router;
