const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors from express-validator
 * Use this after your validation chains to check for errors
 */
class ValidationMiddleware {
  /**
   * Check validation results and return 400 with error details if validation fails
   */
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
          value: err.value
        }))
      });
    }
    
    next();
  }

  /**
   * Extract only validated fields from request body
   * Useful to prevent mass assignment vulnerabilities
   */
  static sanitizeBody(allowedFields) {
    return (req, res, next) => {
      if (!req.body || typeof req.body !== 'object') {
        return next();
      }

      const sanitized = {};
      allowedFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
          sanitized[field] = req.body[field];
        }
      });

      req.body = sanitized;
      next();
    };
  }
}

module.exports = ValidationMiddleware;
