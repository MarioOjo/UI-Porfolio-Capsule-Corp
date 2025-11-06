const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const OrderModel = require('../src/models/OrderModel');
const ProductModel = require('../src/models/ProductModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

// Admin check middleware
// Requires a valid authenticated token. Then checks either a role on the token
// (recommended), or an allowlist of admin emails set in ADMIN_EMAILS env (comma-separated).
function requireAdmin(req, res, next) {
  // If req.user exists (maybe set by earlier middleware), use it; otherwise
  // attempt to authenticate the token.
  const ensureAndCheck = () => {
    const user = req.user;
    const allowedEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (user && (user.role === 'admin' || allowedEmails.includes(user.email))) return next();
    return res.status(403).json({ error: 'Admin access required' });
  };

  if (req.user) return ensureAndCheck();

  // Try authenticating the token and then check role
  return AuthMiddleware.authenticateToken(req, res, () => ensureAndCheck());
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

// Admin dashboard stats
router.get('/orders/stats', requireAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.findAll();
    const total_orders = orders.length;
    const total_revenue = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_amount) || 0);
    }, 0);
    res.json({ 
      total_orders, 
      total_revenue: total_revenue.toFixed(2)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
