class ResponseFormatter {
  /**
   * Success response with data
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Optional success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Success response with pagination
   * @param {Object} res - Express response object
   * @param {Array} items - Array of items
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Optional success message
   */
  static successWithPagination(res, items, pagination, message = 'Success') {
    const response = {
      success: true,
      message,
      data: items,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: pagination.pages,
        hasNext: pagination.page < pagination.pages,
        hasPrev: pagination.page > 1
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(response);
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {Object} errors - Optional detailed errors
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validation error response
   * @param {Object} res - Express response object
   * @param {Object} errors - Validation errors object
   * @param {string} message - Optional error message
   */
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, message, 400, errors);
  }

  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} resource - Resource name
   */
  static notFound(res, resource = 'Resource') {
    return this.error(res, `${resource} not found`, 404);
  }

  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Optional error message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Optional error message
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  /**
   * Created response
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {string} message - Optional success message
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * No content response
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Middleware to add response formatters to res object
   */
  static middleware() {
    return (req, res, next) => {
      res.success = (data, message) => this.success(res, data, message);
      res.successWithPagination = (items, pagination, message) => 
        this.successWithPagination(res, items, pagination, message);
      res.error = (message, statusCode, errors) => this.error(res, message, statusCode, errors);
      res.validationError = (errors, message) => this.validationError(res, errors, message);
      res.notFound = (resource) => this.notFound(res, resource);
      res.unauthorized = (message) => this.unauthorized(res, message);
      res.forbidden = (message) => this.forbidden(res, message);
      res.created = (data, message) => this.created(res, data, message);
      res.noContent = () => this.noContent(res);
      
      next();
    };
  }
}

module.exports = ResponseFormatter;
