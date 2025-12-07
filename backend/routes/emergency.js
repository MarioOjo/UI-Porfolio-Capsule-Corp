const express = require('express');
const router = express.Router();
const UserModel = require('../src/models/UserModel');

// Emergency admin promotion endpoint
// Call this once to promote a user to admin, then remove/disable this file
router.post('/emergency-promote-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    
    // Simple security check - use a secret key
    const EMERGENCY_SECRET = process.env.EMERGENCY_ADMIN_SECRET || 'capsule-emergency-2025';
    
    if (secret !== EMERGENCY_SECRET) {
      return res.status(403).json({ error: 'Invalid secret' });
    }
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    // Find user
    const user = await UserModel.findByEmail(email.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Promote to admin
    // Assuming UserModel has an update method or we can use updateProfile
    // But updateProfile might not allow role update.
    // Let's use the Mongoose model directly if needed, or add a method to UserModel.
    // UserModel doesn't have updateRole.
    // I'll use the User model directly here for simplicity, or add a method.
    // Actually, I can just use the User model directly.
    const User = require('../models/User');
    await User.findByIdAndUpdate(user.id, { role: 'admin' });
    
    res.json({ 
      success: true, 
      message: 'User promoted to admin',
      user: {
        id: user.id,
        email: user.email,
        role: 'admin'
      }
    });
    
  } catch (error) {
    console.error('Emergency admin promotion error:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

module.exports = router;
