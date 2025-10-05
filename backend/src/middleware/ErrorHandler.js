class ErrorHandler {
  static handleAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  static globalErrorHandler(err, req, res, next) {
    console.error('🚨 Error occurred:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: isDevelopment ? err.message : 'Invalid input provided'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid token'
      });
    }

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Duplicate entry',
        details: 'Resource already exists'
      });
    }

    // Default error response
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      ...(isDevelopment && { stack: err.stack })
    });
  }

  static notFoundHandler(req, res) {
    res.status(404).json({
      error: 'Route not found',
      message: `Cannot ${req.method} ${req.url}`
    });
  }
}

module.exports = ErrorHandler;