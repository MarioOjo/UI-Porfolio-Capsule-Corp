/**
 * Environment Variables Validator
 * Validates required environment variables on server startup
 */

class EnvValidator {
  static requiredVars = {
    // Core
    NODE_ENV: 'development',
    PORT: '5000',
    
    // Database
    MONGO_URI: null, // Required, no default
    
    // Authentication
    JWT_SECRET: null, // Required, no default
    
    // Email Service (one of these required)
    // RESEND_API_KEY or SENDGRID_API_KEY
    
    // Optional but recommended
    CLOUDINARY_URL: null,
    ADMIN_EMAILS: 'admin@capsulecorp.com',
    FRONTEND_URL: 'http://localhost:5173'
  };

  static optionalVars = [
    'CLOUDINARY_URL',
    'RESEND_API_KEY', 
    'SENDGRID_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  static validate() {
    const errors = [];
    const warnings = [];

    // Check required vars
    if (!process.env.MONGO_URI) {
      errors.push('MONGO_URI is required for database connection');
    }

    if (!process.env.JWT_SECRET) {
      errors.push('JWT_SECRET is required for authentication');
    }

    // Check email service
    const hasEmailService = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;
    if (!hasEmailService) {
      warnings.push('No email service configured (RESEND_API_KEY or SENDGRID_API_KEY)');
    }

    // Check optional but recommended
    if (!process.env.CLOUDINARY_URL) {
      warnings.push('CLOUDINARY_URL not set - image uploads may not work');
    }

    // Set defaults for optional vars
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = 'development';
    }

    if (!process.env.PORT) {
      process.env.PORT = '5000';
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET should be at least 32 characters for security');
    }

    // Report results
    if (errors.length > 0) {
      console.error('\n❌ Environment Variable Errors:');
      errors.forEach(err => console.error(`   - ${err}`));
      console.error('\nServer cannot start without required environment variables.\n');
      process.exit(1);
    }

    if (warnings.length > 0) {
      console.warn('\n⚠️  Environment Variable Warnings:');
      warnings.forEach(warn => console.warn(`   - ${warn}`));
      console.warn('');
    }

    // Success message
    console.log('✅ Environment variables validated\n');
  }

  static getConfig() {
    return {
      nodeEnv: process.env.NODE_ENV,
      port: parseInt(process.env.PORT || '5000'),
      mongoUri: process.env.MONGO_URI,
      jwtSecret: process.env.JWT_SECRET,
      cloudinaryUrl: process.env.CLOUDINARY_URL,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      adminEmails: (process.env.ADMIN_EMAILS || 'admin@capsulecorp.com').split(',').map(e => e.trim()),
      hasCloudinary: !!process.env.CLOUDINARY_URL,
      hasEmailService: !!(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY)
    };
  }
}

module.exports = EnvValidator;
