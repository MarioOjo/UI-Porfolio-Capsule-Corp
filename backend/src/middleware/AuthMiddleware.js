const authService = require('../services/AuthService');

class AuthMiddleware {
  static authenticateToken(req, res, next) {
    try {
      const token = authService.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Access denied. No token provided.' 
        });
      }

      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ 
        error: 'Invalid token.',
        details: error.message 
      });
    }
  }

  static optionalAuth(req, res, next) {
    try {
      const token = authService.extractTokenFromHeader(req.headers.authorization);
      
      if (token) {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error) {
      // For optional auth, continue even if token is invalid
      next();
    }
  }
}

module.exports = AuthMiddleware;