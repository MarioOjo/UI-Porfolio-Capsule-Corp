const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');
const OrderModel = require('../src/models/OrderModel');
const ProductModel = require('../src/models/ProductModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

// Simple admin check middleware
function requireAdmin(req, res, next) {
  // Accept admin via JWT or hardcoded credentials for demo
  const user = req.user;
  if (user && user.email === 'admin@gmail.com' && user.username === 'admin') return next();
  if (
    req.body?.username === 'admin' &&
    req.body?.password === 'AdminAccess123' &&
    req.body?.email === 'admin@gmail.com'
  ) return next();
  return res.status(403).json({ error: 'Admin access required' });
}

// --- Product Management ---
// Add product
router.post('/products', requireAdmin, upload.array('images'), async (req, res) => {
  try {
    let gallery = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
        gallery.push(result.secure_url);
      }
    }
    if (req.body.gallery) {
      gallery = gallery.concat(JSON.parse(req.body.gallery));
    }
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      mainImage: gallery[0] || '',
      gallery
    };
    const product = await ProductModel.create(productData);
    res.status(201).json({ product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Edit product
router.put('/products/:id', requireAdmin, upload.array('images'), async (req, res) => {
  try {
    let gallery = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
        gallery.push(result.secure_url);
      }
    }
    if (req.body.gallery) {
      gallery = gallery.concat(JSON.parse(req.body.gallery));
    }
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      mainImage: req.body.mainImage || gallery[0] || '',
      gallery
    };
    const product = await ProductModel.update(req.params.id, productData);
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete product
router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    await ProductModel.remove(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Remove image from product gallery
router.delete('/products/:id/image', requireAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    await ProductModel.removeImage(req.params.id, imageUrl);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- User Management ---
router.get('/users', requireAdmin, async (req, res) => {
  const users = await UserModel.getActiveUsers();
  res.json({ users });
});
router.put('/users/:id', requireAdmin, async (req, res) => {
  const user = await UserModel.updateProfile(req.params.id, req.body);
  res.json({ user });
});
router.delete('/users/:id', requireAdmin, async (req, res) => {
  await UserModel.softDelete(req.params.id);
  res.json({ ok: true });
});

// --- Order Management ---
router.get('/orders', requireAdmin, async (req, res) => {
  const orders = await OrderModel.findAll();
  res.json({ orders });
});
router.put('/orders/:id', requireAdmin, async (req, res) => {
  const order = await OrderModel.update(req.params.id, req.body);
  res.json({ order });
});
router.delete('/orders/:id', requireAdmin, async (req, res) => {
  await OrderModel.remove(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
