const { body, param, query } = require('express-validator');

/**
 * Validation rules for product routes
 */

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),
  
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Product slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Battle Gear', 'Training', 'Capsules', 'Technology', 'Accessories', 'Weapons'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),
  
  body('powerLevel')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Power level must be between 0 and 999999'),
  
  body('image')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL'),
  
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Gallery must be an array'),
  
  body('gallery.*')
    .optional()
    .isURL()
    .withMessage('Each gallery item must be a valid URL')
];

const updateProductValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['Battle Gear', 'Training', 'Capsules', 'Technology', 'Accessories', 'Weapons'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('powerLevel')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Power level must be between 0 and 999999')
];

const productIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID')
];

const productSlugValidation = [
  param('slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Invalid product slug format')
];

const productQueryValidation = [
  query('category')
    .optional()
    .trim()
    .isIn(['Battle Gear', 'Training', 'Capsules', 'Technology', 'Accessories', 'Weapons', 'battle-gear', 'training', 'capsules', 'technology', 'accessories', 'weapons'])
    .withMessage('Invalid category'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('featured')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Featured must be true or false')
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productSlugValidation,
  productQueryValidation
};
