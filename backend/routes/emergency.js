const express = require('express');
const router = express.Router();
const db = require('../src/config/database');

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
    const users = await db.executeQuery(
      'SELECT id, email, role FROM users WHERE LOWER(email) = ?',
      [email.toLowerCase()]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Promote to admin
    await db.executeQuery(
      'UPDATE users SET role = ? WHERE id = ?',
      ['admin', users[0].id]
    );
    
    res.json({ 
      success: true, 
      message: 'User promoted to admin',
      user: {
        id: users[0].id,
        email: users[0].email,
        role: 'admin'
      }
    });
    
  } catch (error) {
    console.error('Emergency admin promotion error:', error);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

module.exports = router;
