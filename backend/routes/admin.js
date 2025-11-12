const express = require('express');
const router = express.Router();
const ReviewModel = require('../src/models/ReviewModel');

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await ReviewModel.getAll();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete review
router.delete('/reviews/:id', async (req, res) => {
  try {
    const deleted = await ReviewModel.delete(Number(req.params.id));
    res.json({ success: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const UserModel = require('../src/models/UserModel');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');
const OrderModel = require('../src/models/OrderModel');
const ProductModel = require('../src/models/ProductModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

// Configure Cloudinary if credentials are available
const cloudinaryConfigured = !!(process.env.CLOUDINARY_URL || 
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));

if (cloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
  console.log('✅ Cloudinary configured for image uploads');
} else {
  console.warn('⚠️  Cloudinary not configured - products will work without image uploads');
}

// Admin check middleware - FIXED
// Requires a valid authenticated token. Then checks either a role on the token
// (recommended), or an allowlist of admin emails set in ADMIN_EMAILS env (comma-separated).
function requireAdmin(req, res, next) {
  const ensureAndCheck = () => {
    const user = req.user;
    const allowedEmails = (process.env.ADMIN_EMAILS || 'mario@capsulecorp.com,admin@capsulecorp.com').split(',').map(s => s.trim()).filter(Boolean);
    
    // Check if user has admin role or is in allowed emails
    if (user && (user.role === 'admin' || allowedEmails.includes(user.email))) {
      return next();
    }
    return res.status(403).json({ error: 'Admin access required' });
  };

  if (req.user) {
    return ensureAndCheck();
  }

  // Try authenticating the token and then check role
  return AuthMiddleware.authenticateToken(req, res, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    ensureAndCheck();
  });
}

// --- Product Management ---
// Add product
router.post('/products', requireAdmin, upload.array('images'), async (req, res) => {
  try {
    let gallery = [];
    
    // Upload images to Cloudinary if configured and files are present
    if (cloudinaryConfigured && req.files && req.files.length) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
          gallery.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr.message);
          // Continue without this image
        }
      }
    }
    
    // Add any pre-existing gallery URLs from the request
    if (req.body.gallery) {
      try {
        const existingGallery = JSON.parse(req.body.gallery);
        gallery = gallery.concat(existingGallery);
      } catch (e) {
        console.warn('Failed to parse gallery JSON:', e.message);
      }
    }
    
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock || 0,
      power_level: req.body.power_level || 0,
      in_stock: req.body.in_stock === '1' || req.body.in_stock === 'true' || req.body.in_stock === true,
      mainImage: gallery[0] || req.body.mainImage || '',
      gallery
    };
    
    const product = await ProductModel.create(productData);
    res.status(201).json({ product });
  } catch (e) {
    console.error('Product creation error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Edit product
router.put('/products/:id', requireAdmin, upload.array('images'), async (req, res) => {
  try {
    let gallery = [];
    
    // Upload new images to Cloudinary if configured and files are present
    if (cloudinaryConfigured && req.files && req.files.length) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, { folder: 'capsule_products' });
          gallery.push(result.secure_url);
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr.message);
        }
      }
    }
    
    // Add any pre-existing gallery URLs from the request
    if (req.body.gallery) {
      try {
        const existingGallery = JSON.parse(req.body.gallery);
        gallery = gallery.concat(existingGallery);
      } catch (e) {
        console.warn('Failed to parse gallery JSON:', e.message);
      }
    }
    
    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock || 0,
      power_level: req.body.power_level || 0,
      in_stock: req.body.in_stock === '1' || req.body.in_stock === 'true' || req.body.in_stock === true,
      mainImage: req.body.mainImage || gallery[0] || '',
      gallery
    };
    
    const product = await ProductModel.update(req.params.id, productData);
    res.json({ product });
  } catch (e) {
    console.error('Product update error:', e);
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
  try {
    const users = await UserModel.getActiveUsers();
    
    // Enrich each user with order statistics
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      try {
        const userOrders = await OrderModel.findAll({ user_id: user.id });
        const orderCount = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => {
          return sum + (parseFloat(order.total || order.total_amount) || 0);
        }, 0);
        
        return {
          id: user.id,
          name: user.username || user.display_name || user.email?.split('@')[0] || 'Unknown',
          email: user.email,
          role: user.role || 'customer',
          status: user.status || 'active',
          avatar: user.profile_picture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.email)}&background=3B4CCA&color=fff`,
          joinDate: user.created_at || new Date().toISOString(),
          orders: orderCount,
          totalSpent: totalSpent
        };
      } catch (err) {
        console.error(`Error enriching user ${user.id}:`, err);
        return {
          id: user.id,
          name: user.username || user.display_name || user.email?.split('@')[0] || 'Unknown',
          email: user.email,
          role: user.role || 'customer',
          status: user.status || 'active',
          avatar: user.profile_picture || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.email)}&background=3B4CCA&color=fff`,
          joinDate: user.created_at || new Date().toISOString(),
          orders: 0,
          totalSpent: 0
        };
      }
    }));
    
    res.json({ data: enrichedUsers, users: enrichedUsers }); // Support both 'data' and 'users' keys
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = {};
    
    // Only update fields that are provided
    if (req.body.role !== undefined) updates.role = req.body.role;
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.display_name !== undefined) updates.display_name = req.body.display_name;
    if (req.body.email !== undefined) updates.email = req.body.email;
    
    const user = await UserModel.updateProfile(userId, updates);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    await UserModel.softDelete(req.params.id);
    res.json({ success: true, ok: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
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
