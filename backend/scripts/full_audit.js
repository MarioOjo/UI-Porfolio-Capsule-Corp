require('dotenv').config();
const db = require('../src/config/database');
const fs = require('fs');
const path = require('path');

const ISSUES = [];
const WARNINGS = [];
const SUCCESS = [];

function logIssue(category, message) {
  ISSUES.push(`❌ [${category}] ${message}`);
}

function logWarning(category, message) {
  WARNINGS.push(`⚠️  [${category}] ${message}`);
}

function logSuccess(category, message) {
  SUCCESS.push(`✅ [${category}] ${message}`);
}

async function checkDatabaseTables() {
  console.log('\n📋 CHECKING DATABASE TABLES...');
  console.log('='.repeat(70));
  
  const requiredTables = {
    'users': ['id', 'email', 'username', 'password_hash', 'role', 'phone'],
    'products': ['id', 'name', 'slug', 'description', 'price', 'category', 'image', 'gallery', 'in_stock', 'stock'],
    'cart_items': ['id', 'user_id', 'product_id', 'quantity'],
    'orders': ['id', 'user_id', 'order_number', 'status', 'total', 'subtotal'],
    'order_items': ['id', 'order_id', 'quantity'],
    'user_addresses': ['id', 'user_id'],
    'contact_messages': ['id', 'name', 'email', 'message'],
    'wishlists': ['id', 'user_id', 'product_id']
  };
  
  for (const [tableName, requiredColumns] of Object.entries(requiredTables)) {
    try {
      const tableCheck = await db.executeQuery(`SHOW TABLES LIKE '${tableName}'`);
      if (tableCheck.length === 0) {
        logIssue('DATABASE', `Table '${tableName}' does not exist`);
        continue;
      }
      
      const columns = await db.executeQuery(`DESCRIBE ${tableName}`);
      const columnNames = columns.map(c => c.Field);
      
      for (const reqCol of requiredColumns) {
        if (!columnNames.includes(reqCol)) {
          logIssue('DATABASE', `Table '${tableName}' missing column '${reqCol}'`);
        }
      }
      
      logSuccess('DATABASE', `Table '${tableName}' exists with required columns`);
    } catch (err) {
      logIssue('DATABASE', `Error checking table '${tableName}': ${err.message}`);
    }
  }
}

async function checkForeignKeys() {
  console.log('\n🔗 CHECKING FOREIGN KEY INTEGRITY...');
  console.log('='.repeat(70));
  
  try {
    // Check cart_items foreign keys
    const cartFK = await db.executeQuery(`
      SELECT CONSTRAINT_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'cart_items' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    if (cartFK.length < 2) {
      logWarning('FOREIGN_KEYS', `cart_items should have 2 FKs (user_id, product_id), found ${cartFK.length}`);
    } else {
      logSuccess('FOREIGN_KEYS', 'cart_items has proper foreign keys');
    }
    
    // Check orders foreign keys
    const ordersFK = await db.executeQuery(`
      SELECT CONSTRAINT_NAME 
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'orders' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    if (ordersFK.length === 0) {
      logWarning('FOREIGN_KEYS', 'orders table has no foreign keys');
    } else {
      logSuccess('FOREIGN_KEYS', `orders has ${ordersFK.length} foreign key(s)`);
    }
    
  } catch (err) {
    logIssue('FOREIGN_KEYS', `Error checking foreign keys: ${err.message}`);
  }
}

async function checkAPIEndpoints() {
  console.log('\n🌐 CHECKING API ROUTES...');
  console.log('='.repeat(70));
  
  const routeFiles = [
    'routes/auth.js',
    'routes/products.js',
    'routes/cart.js',
    'routes/orders.js',
    'routes/profile.js',
    'routes/addresses.js',
    'routes/admin.js',
    'routes/contact.js'
  ];
  
  for (const routeFile of routeFiles) {
    const filePath = path.join(__dirname, '..', routeFile);
    if (!fs.existsSync(filePath)) {
      logIssue('ROUTES', `Route file missing: ${routeFile}`);
    } else {
      logSuccess('ROUTES', `Route file exists: ${routeFile}`);
      
      // Check for common issues in route files
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for missing error handlers
      if (!content.includes('asyncHandler') && !content.includes('catch')) {
        logWarning('ROUTES', `${routeFile} may be missing error handling`);
      }
      
      // Check for validation middleware
      if (routeFile === 'routes/products.js' && !content.includes('Validation')) {
        logWarning('ROUTES', `${routeFile} may be missing validation`);
      }
    }
  }
}

async function checkModels() {
  console.log('\n📦 CHECKING MODELS...');
  console.log('='.repeat(70));
  
  const modelFiles = [
    'src/models/UserModel.js',
    'src/models/ProductModel.js',
    'src/models/CartModel.js',
    'src/models/OrderModel.js',
    'src/models/AddressModel.js',
    'src/models/ContactModel.js'
  ];
  
  for (const modelFile of modelFiles) {
    const filePath = path.join(__dirname, '..', modelFile);
    if (!fs.existsSync(filePath)) {
      logIssue('MODELS', `Model file missing: ${modelFile}`);
    } else {
      logSuccess('MODELS', `Model exists: ${modelFile}`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for SQL injection protection
      if (content.includes('executeQuery') && !content.includes('?')) {
        logWarning('MODELS', `${modelFile} may not use parameterized queries`);
      }
      
      // Check for database import
      if (!content.includes('require') || !content.includes('database')) {
        logIssue('MODELS', `${modelFile} may not import database module`);
      }
    }
  }
}

async function checkMiddleware() {
  console.log('\n🛡️  CHECKING MIDDLEWARE...');
  console.log('='.repeat(70));
  
  const middlewareFiles = [
    'src/middleware/AuthMiddleware.js',
    'src/middleware/ErrorHandler.js',
    'src/middleware/SecurityMiddleware.js',
    'src/middleware/ValidationMiddleware.js'
  ];
  
  for (const middlewareFile of middlewareFiles) {
    const filePath = path.join(__dirname, '..', middlewareFile);
    if (!fs.existsSync(filePath)) {
      logWarning('MIDDLEWARE', `Middleware file missing: ${middlewareFile}`);
    } else {
      logSuccess('MIDDLEWARE', `Middleware exists: ${middlewareFile}`);
    }
  }
}

async function checkEnvironmentVariables() {
  console.log('\n⚙️  CHECKING ENVIRONMENT VARIABLES...');
  console.log('='.repeat(70));
  
  const requiredEnvVars = {
    'MYSQL_URL': 'Database connection string',
    'JWT_SECRET': 'JWT secret key',
    'ADMIN_EMAILS': 'Admin email addresses',
    'FRONTEND_ORIGIN': 'Frontend URL for CORS',
    'NODE_ENV': 'Environment (production/development)',
    'PORT': 'Server port'
  };
  
  for (const [envVar, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[envVar]) {
      logIssue('ENV', `Missing required variable: ${envVar} (${description})`);
    } else {
      logSuccess('ENV', `${envVar} is set`);
    }
  }
  
  // Check for secure JWT secret
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logWarning('ENV', 'JWT_SECRET should be at least 32 characters for security');
  }
}

async function checkServerConfiguration() {
  console.log('\n🖥️  CHECKING SERVER CONFIGURATION...');
  console.log('='.repeat(70));
  
  const serverPath = path.join(__dirname, '..', 'server.js');
  if (!fs.existsSync(serverPath)) {
    logIssue('SERVER', 'server.js not found');
    return;
  }
  
  const content = fs.readFileSync(serverPath, 'utf8');
  
  // Check for CORS
  if (!content.includes('cors')) {
    logIssue('SERVER', 'CORS middleware not configured');
  } else {
    logSuccess('SERVER', 'CORS middleware configured');
  }
  
  // Check for error handler
  if (!content.includes('app.use') || (!content.includes('err, req, res, next') && !content.includes('ErrorHandler'))) {
    logWarning('SERVER', 'Global error handler may not be configured');
  } else {
    logSuccess('SERVER', 'Error handler configured');
  }
  
  // Check for body parser
  if (!content.includes('express.json')) {
    logWarning('SERVER', 'JSON body parser may not be configured');
  } else {
    logSuccess('SERVER', 'JSON body parser configured');
  }
  
  // Check route imports
  const routes = ['auth', 'products', 'cart', 'orders', 'profile', 'admin'];
  for (const route of routes) {
    if (!content.includes(`/${route}`) && !content.includes(`'${route}'`)) {
      logWarning('SERVER', `Route '${route}' may not be mounted`);
    }
  }
}

async function checkValidators() {
  console.log('\n✅ CHECKING VALIDATORS...');
  console.log('='.repeat(70));
  
  const validatorPath = path.join(__dirname, '..', 'src/validators');
  
  if (!fs.existsSync(validatorPath)) {
    logWarning('VALIDATORS', 'Validators directory not found');
    return;
  }
  
  const validatorFiles = fs.readdirSync(validatorPath);
  
  if (validatorFiles.length === 0) {
    logWarning('VALIDATORS', 'No validator files found');
  } else {
    logSuccess('VALIDATORS', `Found ${validatorFiles.length} validator file(s)`);
    
    for (const file of validatorFiles) {
      const content = fs.readFileSync(path.join(validatorPath, file), 'utf8');
      
      // Check for express-validator usage
      if (!content.includes('express-validator')) {
        logWarning('VALIDATORS', `${file} may not use express-validator`);
      }
    }
  }
}

async function checkDuplicateRoutes() {
  console.log('\n🔍 CHECKING FOR DUPLICATE ROUTES...');
  console.log('='.repeat(70));
  
  const serverPath = path.join(__dirname, '..', 'server.js');
  if (!fs.existsSync(serverPath)) return;
  
  const content = fs.readFileSync(serverPath, 'utf8');
  const routes = [];
  
  // Extract route definitions with their router files
  const routeRegex = /app\.use\(['"]([^'"]+)['"],\s*(\w+)\)/g;
  let match;
  const routeMap = {};
  
  while ((match = routeRegex.exec(content)) !== null) {
    const path = match[1];
    const routerName = match[2];
    
    if (!routeMap[path]) {
      routeMap[path] = [];
    }
    routeMap[path].push(routerName);
  }
  
  // Check for actual conflicts (same exact path with different routers that might conflict)
  let foundConflict = false;
  for (const [path, routers] of Object.entries(routeMap)) {
    if (routers.length > 1) {
      // Multiple routers on same path - this is OK if they define different sub-paths
      // Only warn if it's the same router or likely to conflict
      const uniqueRouters = [...new Set(routers)];
      if (routers.length > uniqueRouters.length) {
        logIssue('ROUTES', `Same router mounted multiple times on ${path}: ${routers.join(', ')}`);
        foundConflict = true;
      } else {
        // Multiple different routers on same base path (e.g., /api) - this is usually OK
        logSuccess('ROUTES', `Multiple routers on ${path} (${routers.join(', ')}) - verify no conflicts`);
      }
    }
  }
  
  if (!foundConflict && Object.keys(routeMap).length > 0) {
    logSuccess('ROUTES', 'No duplicate route conflicts detected');
  }
}

async function testCriticalQueries() {
  console.log('\n🧪 TESTING CRITICAL QUERIES...');
  console.log('='.repeat(70));
  
  try {
    // Test user lookup
    const users = await db.executeQuery('SELECT id, email FROM users LIMIT 1');
    if (users.length > 0) {
      logSuccess('QUERIES', 'User query works');
      
      const testUserId = users[0].id;
      
      // Test cart query
      try {
        await db.executeQuery(`
          SELECT ci.*, p.name, p.price, p.image 
          FROM cart_items ci
          JOIN products p ON p.id = ci.product_id
          WHERE ci.user_id = ?
        `, [testUserId]);
        logSuccess('QUERIES', 'Cart JOIN query works');
      } catch (err) {
        logIssue('QUERIES', `Cart query failed: ${err.message}`);
      }
      
      // Test orders query
      try {
        await db.executeQuery(`
          SELECT * FROM orders WHERE user_id = ? LIMIT 1
        `, [testUserId]);
        logSuccess('QUERIES', 'Orders query works');
      } catch (err) {
        logIssue('QUERIES', `Orders query failed: ${err.message}`);
      }
      
      // Test wishlist query
      try {
        await db.executeQuery(`
          SELECT w.*, p.name, p.price 
          FROM wishlists w
          JOIN products p ON p.id = w.product_id
          WHERE w.user_id = ?
        `, [testUserId]);
        logSuccess('QUERIES', 'Wishlist JOIN query works');
      } catch (err) {
        logIssue('QUERIES', `Wishlist query failed: ${err.message}`);
      }
    }
    
    // Test product queries
    const products = await db.executeQuery('SELECT * FROM products WHERE in_stock = 1 LIMIT 1');
    if (products.length > 0) {
      logSuccess('QUERIES', 'Products query works');
    }
    
    // Test admin stats query
    try {
      await db.executeQuery(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
          SUM(total) as revenue
        FROM orders
      `);
      logSuccess('QUERIES', 'Admin stats query works');
    } catch (err) {
      logIssue('QUERIES', `Admin stats query failed: ${err.message}`);
    }
    
  } catch (err) {
    logIssue('QUERIES', `Query test failed: ${err.message}`);
  }
}

async function checkAdminAccess() {
  console.log('\n👨‍💼 CHECKING ADMIN ACCESS...');
  console.log('='.repeat(70));
  
  try {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(e => e);
    
    if (adminEmails.length === 0) {
      logIssue('ADMIN', 'No admin emails configured in ADMIN_EMAILS');
      return;
    }
    
    logSuccess('ADMIN', `${adminEmails.length} admin email(s) configured`);
    
    for (const email of adminEmails) {
      const user = await db.executeQuery('SELECT id, email, role FROM users WHERE email = ?', [email]);
      if (user.length === 0) {
        logWarning('ADMIN', `Admin user not found: ${email}`);
      } else if (user[0].role !== 'admin') {
        logWarning('ADMIN', `User ${email} exists but role is '${user[0].role}', not 'admin'`);
      } else {
        logSuccess('ADMIN', `Admin user verified: ${email} (ID: ${user[0].id})`);
      }
    }
  } catch (err) {
    logIssue('ADMIN', `Error checking admin access: ${err.message}`);
  }
}

async function checkPackageDependencies() {
  console.log('\n📚 CHECKING PACKAGE DEPENDENCIES...');
  console.log('='.repeat(70));
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packagePath)) {
    logIssue('DEPENDENCIES', 'package.json not found');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const criticalDeps = [
    'express',
    'mysql2',
    'dotenv',
    'cors',
    'jsonwebtoken'
  ];
  
  // Check for either bcrypt or bcryptjs
  if (!deps['bcrypt'] && !deps['bcryptjs']) {
    logIssue('DEPENDENCIES', 'Missing bcrypt or bcryptjs for password hashing');
  } else {
    const bcryptPkg = deps['bcrypt'] || deps['bcryptjs'];
    logSuccess('DEPENDENCIES', `Password hashing available (${deps['bcrypt'] ? 'bcrypt' : 'bcryptjs'} ${bcryptPkg})`);
  }
  
  // Check for express-validator
  if (!deps['express-validator']) {
    logWarning('DEPENDENCIES', 'express-validator not found - validation may not be configured');
  } else {
    logSuccess('DEPENDENCIES', `express-validator installed (${deps['express-validator']})`);
  }
  for (const dep of criticalDeps) {
    if (!deps[dep]) {
      logIssue('DEPENDENCIES', `Missing critical dependency: ${dep}`);
    } else {
      logSuccess('DEPENDENCIES', `${dep} installed (${deps[dep]})`);
    }
  }
}

async function fullAudit() {
  console.log('\n🔍 FULL SYSTEM AUDIT');
  console.log('='.repeat(70));
  console.log('Checking backend for issues before deployment...\n');
  
  try {
    await db.initialize();
    
    // Run all checks
    await checkEnvironmentVariables();
    await checkPackageDependencies();
    await checkDatabaseTables();
    await checkForeignKeys();
    await testCriticalQueries();
    await checkAdminAccess();
    await checkServerConfiguration();
    await checkAPIEndpoints();
    await checkModels();
    await checkMiddleware();
    await checkValidators();
    await checkDuplicateRoutes();
    
    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 AUDIT SUMMARY');
    console.log('='.repeat(70));
    
    console.log(`\n✅ SUCCESS: ${SUCCESS.length} checks passed`);
    console.log(`⚠️  WARNINGS: ${WARNINGS.length} potential issues`);
    console.log(`❌ ERRORS: ${ISSUES.length} critical issues`);
    
    if (ISSUES.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES FOUND:');
      console.log('-'.repeat(70));
      ISSUES.forEach(issue => console.log(issue));
    }
    
    if (WARNINGS.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      console.log('-'.repeat(70));
      WARNINGS.forEach(warning => console.log(warning));
    }
    
    console.log('\n' + '='.repeat(70));
    
    if (ISSUES.length === 0) {
      console.log('✅ SYSTEM READY FOR DEPLOYMENT');
    } else {
      console.log('❌ FIX CRITICAL ISSUES BEFORE DEPLOYING');
    }
    
    console.log('='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
  } finally {
    await db.closeConnection();
  }
  
  // Exit with error code if issues found
  process.exit(ISSUES.length > 0 ? 1 : 0);
}

fullAudit();
