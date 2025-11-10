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

  static requireAdmin(req, res, next) {
    try {
      const token = authService.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Access denied. No token provided.' 
        });
      }

      const decoded = authService.verifyToken(token);
      
      // Industry Standard: Graceful migration approach
      // 1. First check if token has role field (new tokens)
      // 2. If not, fall back to admin email list (old tokens)
      const adminEmails = (process.env.ADMIN_EMAILS || 'mario@capsulecorp.com,admin@capsulecorp.com')
        .split(',')
        .map(e => e.trim())
        .filter(Boolean);
      
      const isAdminByRole = decoded.role && decoded.role === 'admin';
      const isAdminByEmail = decoded.email && adminEmails.includes(decoded.email);
      
      if (!isAdminByRole && !isAdminByEmail) {
        return res.status(403).json({ 
          error: 'Access denied. Admin privileges required.' 
        });
      }
      
      // Ensure role is set for downstream middleware (backwards compatibility)
      if (!decoded.role && isAdminByEmail) {
        decoded.role = 'admin';
      }
      
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ 
        error: 'Invalid token.',
        details: error.message 
      });
    }
  }
}

module.exports = AuthMiddleware;