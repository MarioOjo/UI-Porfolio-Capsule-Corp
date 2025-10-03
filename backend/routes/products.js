const express = require('express');
const router = express.Router();
const ProductModel = require('../src/models/ProductModel');

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/products
router.get('/', asyncHandler(async (req, res) => {
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
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await ProductModel.findBySlug(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
}));

// GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
}));

// POST /api/products - Create new product (admin only)
router.post('/', asyncHandler(async (req, res) => {
  const product = await ProductModel.create(req.body);
  res.status(201).json({ product });
}));

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', asyncHandler(async (req, res) => {
  const product = await ProductModel.update(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
}));

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', asyncHandler(async (req, res) => {
  const success = await ProductModel.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
}));

module.exports = router;
