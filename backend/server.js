require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// Import custom modules
const database = require('./src/config/database');
const DatabaseMigration = require('./src/utils/DatabaseMigration');
const SecurityMiddleware = require('./src/middleware/SecurityMiddleware');
const ErrorHandler = require('./src/middleware/ErrorHandler');
const AuthMiddleware = require('./src/middleware/AuthMiddleware');

// Import routes (when created)
// const authRoutes = require('./src/routes/authRoutes');
// const productRoutes = require('./src/routes/productRoutes');
// const userRoutes = require('./src/routes/userRoutes');

class CapsuleCorpServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.safeMode = process.env.SAFE_MODE === '1' || process.env.SAFE_MODE === 'true';
  }

  async initialize() {
    try {
      if (this.safeMode) {
        console.log('🟡 SAFE_MODE enabled: Skipping database initialization and migrations.');
      } else {
        // Initialize database connection
        await database.initialize();
        // Run database migrations
        await DatabaseMigration.runMigrations();
      }
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup error handling
      this.setupErrorHandling();
      
      console.log('🚀 Capsule Corp server initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize server:', error);
      process.exit(1);
    }
  }

  setupMiddleware() {
    // Compression for better performance
    this.app.use(compression());
    
    // Security headers
    this.app.use(helmet(SecurityMiddleware.helmetConfig));
    
    // CORS configuration
    this.app.use(cors(SecurityMiddleware.corsOptions));
    
    // Rate limiting
    this.app.use(SecurityMiddleware.strictRateLimit);
    this.app.use('/api/auth', SecurityMiddleware.authRateLimit);
    
    // Request logging
    if (this.isDevelopment) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request validation
    this.app.use(SecurityMiddleware.validateRequest);
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API routes
    this.app.get('/api', (req, res) => {
      res.json({
        message: 'Welcome to Capsule Corp API!',
        version: '1.0.0',
        endpoints: [
          '/api/auth - Authentication endpoints',
          '/api/products - Product management',
          '/api/users - User management',
          '/api/orders - Order management'
        ]
      });
    });

    if (this.safeMode) {
      console.log('⚠️  SAFE_MODE active: mounting mock API endpoints.');
      this.setupMockRoutes();
    } else {
      // Legacy routes (from original server.js) - TO BE REFACTORED
      this.setupLegacyRoutes();
    }
    
    // Future modular routes
    // this.app.use('/api/auth', authRoutes);
    // this.app.use('/api/products', productRoutes);
    // this.app.use('/api/users', userRoutes);

    // === Serve React Frontend (Vite build) ===
    // We build the React app into ../CAPSULE CORP/dist during Heroku postbuild.
    // Heroku slugs retain the space in the folder name, but add a few fallback patterns just in case.
    const candidateDistDirs = [
      path.join(__dirname, '../CAPSULE CORP/dist'),
      path.join(__dirname, '../CAPSULE_CORP/dist'), // fallback if space stripped
      path.join(__dirname, '../frontend/dist'),      // optional future structure
      path.join(__dirname, '../dist')                // last resort
    ];

    const distDir = candidateDistDirs.find(p => fs.existsSync(p));

    if (distDir) {
      console.log('🧩 React build directory found:', distDir);
      this.app.use(express.static(distDir, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      }));
      this.app.get('/__distcheck', (req, res) => {
        try {
          const files = fs.readdirSync(distDir).slice(0, 40);
          return res.json({ distDir, fileCount: files.length, sample: files });
        } catch (err) {
          return res.status(500).json({ error: 'Failed to read dist', message: err.message });
        }
      });
      // Catch-all to support client-side routing, excluding API & health endpoints
      this.app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/__distcheck')) return next();
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }
        return res.status(200).send('<!doctype html><html><head><meta charset="utf-8"/><title>Capsule Corp</title></head><body><h1>Frontend build missing index.html</h1><p>dist directory located but index.html not found.</p></body></html>');
      });
    } else {
      console.warn('⚠️ React dist directory not found in any candidate path. Serving fallback message.');
      this.app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/health')) return next();
        return res.status(200).send('<!doctype html><html><head><meta charset="utf-8"/><title>Capsule Corp (No Build)</title></head><body style="font-family: sans-serif; padding:40px;">\n<h1>Frontend build not found</h1><p>No dist directory detected on the server. If this is Heroku, ensure the heroku-postbuild ran and the folder name matches <code>CAPSULE CORP/dist</code>.</p><ul><li>Check build logs for Vite output.</li><li>Confirm folder name has the space.</li><li>Redeploy if needed.</li></ul></body></html>');
      });
    }
  }

  setupLegacyRoutes() {
    const authService = require('./src/services/AuthService');
    const userModel = require('./src/models/UserModel');

    // Legacy authentication routes
    this.app.post('/api/auth/register', ErrorHandler.handleAsync(async (req, res) => {
      const { username, email, password } = req.body;
      
      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if user exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await authService.hashPassword(password);
      const newUser = await userModel.create({
        username,
        email,
        password_hash: hashedPassword
      });

      // Generate token
      const token = authService.generateToken({ 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email 
      });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });
    }));

    // Add signup route (alias for register to match frontend)
    this.app.post('/api/auth/signup', ErrorHandler.handleAsync(async (req, res) => {
      const { email, password, firstName, lastName } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Check if user exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await authService.hashPassword(password);
      const username = firstName && lastName ? `${firstName} ${lastName}` : email.split('@')[0];
      
      const newUser = await userModel.create({
        username,
        email,
        password_hash: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || ''
      });

      // Generate token
      const token = authService.generateToken({ 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email 
      });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      });
    }));

    this.app.post('/api/auth/login', ErrorHandler.handleAsync(async (req, res) => {
      const { email, password } = req.body;

      // Find user
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await authService.comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await userModel.updateLastLogin(user.id);

      // Generate token
      const token = authService.generateToken({ 
        id: user.id, 
        username: user.username, 
        email: user.email 
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    }));

    // Protected route example
    this.app.get('/api/auth/profile', 
      AuthMiddleware.authenticateToken,
      ErrorHandler.handleAsync(async (req, res) => {
        const user = await userModel.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at,
          lastLogin: user.last_login
        });
      })
    );

    // Add /api/me endpoint for frontend AuthContext (handles both authenticated and unauthenticated)
    this.app.get('/api/me', 
      ErrorHandler.handleAsync(async (req, res) => {
        try {
          // Try to authenticate but don't fail if no token
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authentication token provided' });
          }

          const token = authHeader.substring(7);
          const authService = require('./src/services/AuthService');
          const decoded = authService.verifyToken(token);
          
          const user = await userModel.findById(decoded.id);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.json({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              createdAt: user.created_at,
              lastLogin: user.last_login
            }
          });
        } catch (error) {
          // Token invalid or expired
          res.status(401).json({ error: 'Invalid or expired token' });
        }
      })
    );

    // Product API routes
    const ProductModel = require('./src/models/ProductModel');

    // Get all products
    this.app.get('/api/products', ErrorHandler.handleAsync(async (req, res) => {
      const { category, search, featured } = req.query;
      
      let products;
      
      if (featured === 'true') {
        products = await ProductModel.getFeatured();
      } else if (category) {
        products = await ProductModel.findByCategory(category);
      } else if (search) {
        products = await ProductModel.search(search);
      } else {
        products = await ProductModel.findAll();
      }
      
      res.json({ products });
    }));

    // Get product by ID
    this.app.get('/api/products/:id', ErrorHandler.handleAsync(async (req, res) => {
      const { id } = req.params;
      
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ product });
    }));

    // Get product by slug
    this.app.get('/api/products/slug/:slug', ErrorHandler.handleAsync(async (req, res) => {
      const { slug } = req.params;
      
      const product = await ProductModel.findBySlug(slug);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ product });
    }));

    // Create new product (Admin only)
    this.app.post('/api/products', 
      AuthMiddleware.authenticateToken,
      ErrorHandler.handleAsync(async (req, res) => {
        // Check if user is admin (basic check - you can enhance this)
        const user = await userModel.findById(req.user.id);
        if (!user || (!user.email.includes('admin') && user.email !== 'mario@capsulecorp.com')) {
          return res.status(403).json({ error: 'Admin access required' });
        }
        
        const product = await ProductModel.create(req.body);
        res.status(201).json({ product });
      })
    );

    // Update product (Admin only)
    this.app.put('/api/products/:id',
      AuthMiddleware.authenticateToken,
      ErrorHandler.handleAsync(async (req, res) => {
        // Check if user is admin
        const user = await userModel.findById(req.user.id);
        if (!user || (!user.email.includes('admin') && user.email !== 'mario@capsulecorp.com')) {
          return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { id } = req.params;
        const product = await ProductModel.update(id, req.body);
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ product });
      })
    );

    // Delete product (Admin only)
    this.app.delete('/api/products/:id',
      AuthMiddleware.authenticateToken,
      ErrorHandler.handleAsync(async (req, res) => {
        // Check if user is admin
        const user = await userModel.findById(req.user.id);
        if (!user || (!user.email.includes('admin') && user.email !== 'mario@capsulecorp.com')) {
          return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { id } = req.params;
        const deleted = await ProductModel.delete(id);
        
        if (!deleted) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
      })
    );
  }

  // Mock routes for SAFE_MODE (no DB required)
  setupMockRoutes() {
    const mockProducts = require('./src/mock/mockProducts');

    this.app.get('/api/products', (req, res) => {
      const { search, featured, category } = req.query;
      let results = [...mockProducts];
      if (featured === 'true') {
        results = results.filter(p => p.featured);
      }
      if (category) {
        results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const term = search.toLowerCase();
        results = results.filter(p => p.name.toLowerCase().includes(term));
      }
      res.json({ products: results });
    });

    this.app.get('/api/products/:id', (req, res) => {
      const id = Number(req.params.id);
      const product = mockProducts.find(p => p.id === id);
      if (!product) return res.status(404).json({ error: 'Product not found (SAFE_MODE)' });
      res.json({ product });
    });

    this.app.get('/api/products/slug/:slug', (req, res) => {
      const { slug } = req.params;
      const product = mockProducts.find(p => p.slug === slug);
      if (!product) return res.status(404).json({ error: 'Product not found (SAFE_MODE)' });
      res.json({ product });
    });

    // Auth simulation (always unauthenticated)
    this.app.post('/api/auth/login', (req, res) => {
      return res.status(200).json({
        message: 'SAFE_MODE login simulated',
        token: 'safe.fake.token',
        user: { id: 0, username: 'DemoUser', email: 'demo@example.com' }
      });
    });

    this.app.post('/api/auth/signup', (req, res) => {
      return res.status(201).json({
        message: 'SAFE_MODE signup simulated',
        token: 'safe.fake.token',
        user: { id: 0, username: 'NewUser', email: req.body.email || 'demo@example.com' }
      });
    });

    this.app.get('/api/auth/profile', (req, res) => {
      return res.status(401).json({ error: 'Not authenticated (SAFE_MODE)' });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(ErrorHandler.notFoundHandler);
    
    // Global error handler
    this.app.use(ErrorHandler.globalErrorHandler);
  }

  async start() {
    try {
      await this.initialize();
      
      this.server = this.app.listen(this.port, () => {
        console.log(`🔋 Capsule Corp server is running on port ${this.port}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        if (this.isDevelopment) {
          console.log(`📋 Health check: http://localhost:${this.port}/health`);
          console.log(`🔧 API docs: http://localhost:${this.port}/api`);
        }
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());
      
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async shutdown() {
    console.log('🔄 Shutting down Capsule Corp server...');
    
    if (this.server) {
      this.server.close(() => {
        console.log('✅ HTTP server closed');
      });
    }
    
    await database.closeConnection();
    process.exit(0);
  }
}

// Start the server
const server = new CapsuleCorpServer();
server.start().catch(console.error);

module.exports = CapsuleCorpServer;