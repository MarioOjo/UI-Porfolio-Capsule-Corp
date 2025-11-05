const { body, param } = require('express-validator');

/**
 * Validation rules for order routes
 */

const createOrderValidation = [
  body('customer_name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('customer_email')
    .trim()
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),
  
  body('customer_phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 999 })
    .withMessage('Quantity must be between 1 and 999'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('shipping_address')
    .notEmpty()
    .withMessage('Shipping address is required'),
  
  body('shipping_address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('shipping_address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('shipping_address.state')
    .optional()
    .trim(),
  
  body('shipping_address.postal_code')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  
  body('shipping_address.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('payment_method')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  
  body('subtotal')
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  
  body('shipping_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Shipping cost must be a positive number'),
  
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a positive number'),
  
  body('total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number')
];

const orderIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid order ID')
];

const updateOrderStatusValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid order ID'),
  
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters')
];

const updateTrackingValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid order ID'),
  
  body('tracking_number')
    .trim()
    .notEmpty()
    .withMessage('Tracking number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
  
  body('carrier')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Carrier name must be less than 100 characters')
];

const updateNotesValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid order ID'),
  
  body('notes')
    .trim()
    .notEmpty()
    .withMessage('Notes cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters')
];

module.exports = {
  createOrderValidation,
  orderIdValidation,
  updateOrderStatusValidation,
  updateTrackingValidation,
  updateNotesValidation
};
