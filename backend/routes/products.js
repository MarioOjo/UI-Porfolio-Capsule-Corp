const express = require('express');
const router = express.Router();
const ProductModel = require('../src/models/ProductModel');
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
  const { category, search, featured } = req.query;
  let products;
  
  if (featured === 'true') {
    products = await ProductModel.getFeatured();
  } else if (category) {
    products = await ProductModel.findByCategory(category);
  } else if (search) {
    products = await ProductModel.search(search);
  } else {
    products = await ProductModel.findAll();
  }
  
  res.json({ products });
}));

// GET /api/products/slug/:slug
// Specific routes MUST come before parameterized routes
router.get('/slug/:slug',
  productSlugValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const product = await ProductModel.findBySlug(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
}));

// GET /api/products/:id
router.get('/:id',
  productIdValidation,
  ValidationMiddleware.handleValidationErrors,
  asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
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

    const product = await ProductModel.create(productData);
    return res.status(201).json({ product });
  }

  // Non-multipart JSON
  const product = await ProductModel.create(req.body);
  res.status(201).json({ product });
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

    const product = await ProductModel.update(req.params.id, productData);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.json({ product });
  }

  // JSON body
  const product = await ProductModel.update(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
}));

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', productIdValidation, ValidationMiddleware.handleValidationErrors, asyncHandler(async (req, res) => {
  const success = await ProductModel.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
}));

module.exports = router;
