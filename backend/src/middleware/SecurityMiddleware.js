const rateLimit = require('express-rate-limit');

class SecurityMiddleware {
  static createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
    return rateLimit({
      windowMs,
      max,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  static strictRateLimit = this.createRateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes
  static authRateLimit = this.createRateLimiter(15 * 60 * 1000, 10);  // 10 auth attempts per 15 minutes

  static validateRequest(req, res, next) {
    // Basic request validation
    if (req.body && typeof req.body === 'object') {
      // Sanitize request body (remove potentially dangerous properties)
      delete req.body.__proto__;
      delete req.body.constructor;
    }
    
    next();
  }

  static corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count']
  };

  static helmetConfig = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false
  };
}

module.exports = SecurityMiddleware;