const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'capsule-corp-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.saltRounds = 12;
  }

  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

  generateToken(payload) {
    try {
      // Allow optional expiresIn override: generateToken(payload, expiresIn)
      let expiresIn = this.jwtExpiresIn;
      if (arguments.length >= 2) {
        const maybe = arguments[1];
        if (typeof maybe === 'string' || typeof maybe === 'number') expiresIn = maybe;
        else if (maybe && maybe.expiresIn) expiresIn = maybe.expiresIn;
      }
      return jwt.sign(payload, this.jwtSecret, { 
        expiresIn,
        issuer: 'capsule-corp',
        audience: 'capsule-corp-users'
      });
    } catch (error) {
      throw new Error('Token generation failed');
    }
  }

  // Sign a token for a server-trusted user object. Derives role from DB user
  // or from ADMIN_EMAILS env as a fallback. Ensures token contains id/sub/email/role.
  signUserToken(user, opts = {}) {
    if (!user || (!user.id && !user.sub) || !user.email) throw new Error('Invalid user for token');
    const id = user.id || user.sub;
    const envAdmins = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const role = (user.role || '').toString().toLowerCase() || (envAdmins.includes((user.email || '').toString().toLowerCase()) ? 'admin' : 'user');
    const payload = {
      sub: id,
      id,
      email: user.email,
      role
    };
    return this.generateToken(payload, opts);
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'capsule-corp',
        audience: 'capsule-corp-users'
      });
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

module.exports = new AuthService();