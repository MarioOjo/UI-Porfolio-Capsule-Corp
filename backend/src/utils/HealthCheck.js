/**
 * Enhanced Health Check Endpoint
 * Returns detailed system status
 */

const { mongoose } = require('../../db/mongo');

class HealthCheck {
  static startTime = Date.now();

  static async getStatus() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Check MongoDB connection
    const mongoStatus = this.getMongoStatus();
    
    // Memory usage
    const memUsage = process.memoryUsage();
    const memory = {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
    };

    return {
      status: mongoStatus.connected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: `${uptime}s`,
      environment: process.env.NODE_ENV || 'development',
      services: {
        mongodb: mongoStatus,
        cloudinary: !!process.env.CLOUDINARY_URL,
        email: !!(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY)
      },
      memory,
      version: process.env.npm_package_version || '1.0.0'
    };
  }

  static getMongoStatus() {
    if (!mongoose || !mongoose.connection) {
      return { connected: false, status: 'not_initialized' };
    }

    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      connected: state === 1,
      status: states[state] || 'unknown',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    };
  }

  static async getDetailedHealth() {
    const basic = await this.getStatus();
    
    // Test database with ping
    let dbResponseTime = null;
    if (mongoose?.connection?.readyState === 1) {
      const start = Date.now();
      try {
        await mongoose.connection.db.admin().ping();
        dbResponseTime = `${Date.now() - start}ms`;
      } catch (error) {
        dbResponseTime = 'error';
      }
    }

    return {
      ...basic,
      details: {
        databaseResponseTime: dbResponseTime,
        nodeVersion: process.version,
        platform: process.platform
      }
    };
  }
}

module.exports = HealthCheck;
