const express = require('express');
const router = express.Router();
const ContactModel = require('../src/models/ContactModel');
const emailService = require('../src/utils/emailService');
const ValidationMiddleware = require('../src/middleware/ValidationMiddleware');
const { contactFormValidation } = require('../src/validators/contactValidators');

// Utility async wrapper
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// POST /api/contact - Submit contact form
router.post('/', contactFormValidation, ValidationMiddleware.handleValidationErrors, asyncHandler(async (req, res) => {
  const { name, email, subject, message, user_id } = req.body;

  // Save to database
  const contactMessage = await ContactModel.create({
    name,
    email,
    subject,
    message,
    user_id: user_id || null
  });

  // Send email notifications (non-blocking)
  Promise.all([
    emailService.sendContactNotification({ name, email, subject, message }),
    emailService.sendCustomerConfirmation({ name, email, subject, message })
  ]).catch(err => console.error('Email sending error:', err));

  res.status(201).json({ 
    message: 'Contact message submitted successfully',
    data: contactMessage 
  });
}));

// GET /api/contact - Get all contact messages (admin only)
router.get('/', asyncHandler(async (req, res) => {
  const { status, email, limit } = req.query;
  const filters = {};
  
  if (status) filters.status = status;
  if (email) filters.email = email;
  if (limit) filters.limit = limit;

  const messages = await ContactModel.findAll(filters);
  res.json({ messages });
}));

// GET /api/contact/:id - Get single contact message (admin only)
router.get('/:id', asyncHandler(async (req, res) => {
  const message = await ContactModel.findById(req.params.id);
  if (!message) return res.status(404).json({ error: 'Contact message not found' });
  res.json({ message });
}));

// PUT /api/contact/:id - Update contact message status (admin only)
router.put('/:id', asyncHandler(async (req, res) => {
  const { status, admin_notes } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status',
      validStatuses 
    });
  }

  const message = await ContactModel.updateStatus(req.params.id, status, admin_notes);
  if (!message) return res.status(404).json({ error: 'Contact message not found' });
  
  res.json({ message });
}));

// DELETE /api/contact/:id - Delete contact message (admin only)
router.delete('/:id', asyncHandler(async (req, res) => {
  const success = await ContactModel.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'Contact message not found' });
  res.json({ message: 'Contact message deleted successfully' });
}));

module.exports = router;
