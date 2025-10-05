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
      return jwt.sign(payload, this.jwtSecret, { 
        expiresIn: this.jwtExpiresIn,
        issuer: 'capsule-corp',
        audience: 'capsule-corp-users'
      });
    } catch (error) {
      throw new Error('Token generation failed');
    }
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