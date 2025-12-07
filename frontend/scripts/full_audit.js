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

function checkFileExists(filePath, category, description) {
  if (fs.existsSync(filePath)) {
    logSuccess(category, `${description} exists`);
    return true;
  } else {
    logIssue(category, `${description} missing: ${filePath}`);
    return false;
  }
}

function checkImports(filePath, requiredImports, category) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  for (const [importName, description] of Object.entries(requiredImports)) {
    if (!content.includes(importName)) {
      logWarning(category, `${path.basename(filePath)} may be missing import: ${description}`);
    }
  }
}

function findBrokenImports(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findBrokenImports(fullPath, baseDir);
    } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js') || item.endsWith('.tsx') || item.endsWith('.ts'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for relative imports
      const relativeImports = content.match(/from ['"]\.\.?\/[^'"]+['"]/g) || [];
      
      for (const importStr of relativeImports) {
        const match = importStr.match(/from ['"]([^'"]+)['"]/);
        if (!match) continue;
        
        let importPath = match[1];
        
        // Resolve the import path
        const dirPath = path.dirname(fullPath);
        let resolvedPath = path.resolve(dirPath, importPath);
        
        // Try different extensions if no extension specified
        const extensions = ['', '.js', '.jsx', '.ts', '.tsx'];
        let found = false;
        
        for (const ext of extensions) {
          const testPath = resolvedPath + ext;
          if (fs.existsSync(testPath)) {
            found = true;
            break;
          }
        }
        
        // Also check for index files
        if (!found && fs.existsSync(resolvedPath)) {
          const indexFiles = ['index.js', 'index.jsx', 'index.ts', 'index.tsx'];
          for (const indexFile of indexFiles) {
            if (fs.existsSync(path.join(resolvedPath, indexFile))) {
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          const relativePath = path.relative(baseDir, fullPath);
          logIssue('IMPORTS', `Broken import in ${relativePath}: ${importPath}`);
        }
      }
      
      // Check for imports with .js extension on JSX files
      if (item.endsWith('.jsx') || item.endsWith('.tsx')) {
        const jsxImports = content.match(/from ['"][^'"]+\.jsx?['"]/g) || [];
        if (jsxImports.length > 0) {
          const relativePath = path.relative(baseDir, fullPath);
          logWarning('IMPORTS', `${relativePath} has imports with .js/.jsx extension - Vite may not require this`);
        }
      }
    }
  }
}

function checkAPIEndpoints() {
  console.log('\n🌐 CHECKING API ENDPOINT USAGE...');
  console.log('='.repeat(70));
  
  const srcDir = path.join(__dirname, '..', 'src');
  if (!fs.existsSync(srcDir)) {
    logIssue('STRUCTURE', 'src directory not found');
    return;
  }
  
  // Check for API configuration
  const apiUtilPath = path.join(srcDir, 'utils', 'api.js');
  const apiUtilPathJsx = path.join(srcDir, 'utils', 'api.jsx');
  
  if (fs.existsSync(apiUtilPath) || fs.existsSync(apiUtilPathJsx)) {
    logSuccess('API', 'API utility file exists');
  } else {
    logWarning('API', 'No centralized API utility found (utils/api.js)');
  }
  
  // Check for hardcoded API URLs
  function checkHardcodedURLs(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        checkHardcodedURLs(fullPath);
      } else if (stat.isFile() && (item.endsWith('.jsx') || item.endsWith('.js'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Look for hardcoded localhost URLs
        if (content.match(/['"]https?:\/\/localhost:\d+/)) {
          const relativePath = path.relative(srcDir, fullPath);
          logWarning('API', `${relativePath} contains hardcoded localhost URL`);
        }
        
        // Look for hardcoded production URLs
        if (content.match(/['"]https?:\/\/(?!localhost)[^'"]+\.(?:render|vercel|netlify)/)) {
          const relativePath = path.relative(srcDir, fullPath);
          logWarning('API', `${relativePath} contains hardcoded production URL`);
        }
      }
    }
  }
  
  checkHardcodedURLs(srcDir);
}

function checkEnvironmentConfig() {
  console.log('\n⚙️  CHECKING ENVIRONMENT CONFIGURATION...');
  console.log('='.repeat(70));
  
  const rootDir = path.join(__dirname, '..');
  
  // Check for .env files (should NOT be committed)
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    logWarning('ENV', '.env file exists - ensure it is in .gitignore');
  } else {
    logSuccess('ENV', 'No .env file in frontend (good for production)');
  }
  
  // Check for env.json
  const envJsonPath = path.join(rootDir, 'public', 'env.json');
  if (fs.existsSync(envJsonPath)) {
    logSuccess('ENV', 'env.json exists in public directory');
    
    try {
      const envJson = JSON.parse(fs.readFileSync(envJsonPath, 'utf8'));
      if (envJson.VITE_API_BASE) {
        logSuccess('ENV', `VITE_API_BASE configured: ${envJson.VITE_API_BASE}`);
      } else {
        logWarning('ENV', 'VITE_API_BASE not set in env.json');
      }
    } catch (err) {
      logIssue('ENV', `Failed to parse env.json: ${err.message}`);
    }
  } else {
    logWarning('ENV', 'env.json not found in public directory');
  }
  
  // Check vite.config.js
  const viteConfigPath = path.join(rootDir, 'vite.config.js');
  if (fs.existsSync(viteConfigPath)) {
    logSuccess('CONFIG', 'vite.config.js exists');
  } else {
    logIssue('CONFIG', 'vite.config.js missing');
  }
}

function checkCriticalComponents() {
  console.log('\n🧩 CHECKING CRITICAL COMPONENTS...');
  console.log('='.repeat(70));
  
  const srcDir = path.join(__dirname, '..', 'src');
  
  const criticalFiles = {
    'App.jsx': 'Main app component',
    'main.jsx': 'Entry point',
    'contexts/AuthContext.jsx': 'Authentication context',
    'utils/api.js': 'API utility',
    'pages/Admin/AdminProducts.jsx': 'Admin products page',
    'pages/Admin/AdminOrders.jsx': 'Admin orders page'
  };
  
  for (const [file, description] of Object.entries(criticalFiles)) {
    checkFileExists(path.join(srcDir, file), 'COMPONENTS', description);
  }
}

function checkAuthContext() {
  console.log('\n🔐 CHECKING AUTHENTICATION...');
  console.log('='.repeat(70));
  
  const authContextPath = path.join(__dirname, '..', 'src', 'contexts', 'AuthContext.jsx');
  
  if (!fs.existsSync(authContextPath)) {
    logIssue('AUTH', 'AuthContext.jsx not found');
    return;
  }
  
  const content = fs.readFileSync(authContextPath, 'utf8');
  
  // Check for the logout bug we identified earlier
  if (content.includes('localStorage.removeItem') && content.includes('/api/me')) {
    logWarning('AUTH', 'AuthContext may have logout loop bug (removes token when /api/me returns null)');
  }
  
  // Check for proper token storage
  if (!content.includes('localStorage') && !content.includes('sessionStorage')) {
    logWarning('AUTH', 'AuthContext may not persist tokens');
  } else {
    logSuccess('AUTH', 'Token persistence implemented');
  }
  
  // Check for login/logout functions
  if (content.includes('login') && content.includes('logout')) {
    logSuccess('AUTH', 'Login and logout functions present');
  } else {
    logWarning('AUTH', 'Login or logout functions may be missing');
  }
}

function checkPackageJson() {
  console.log('\n📦 CHECKING PACKAGE.JSON...');
  console.log('='.repeat(70));
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    logIssue('DEPENDENCIES', 'package.json not found');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const criticalDeps = {
    'react': 'React library',
    'react-dom': 'React DOM',
    'react-router-dom': 'Routing',
    'vite': 'Build tool'
  };
  
  for (const [dep, description] of Object.entries(criticalDeps)) {
    if (!deps[dep]) {
      logIssue('DEPENDENCIES', `Missing ${description}: ${dep}`);
    } else {
      logSuccess('DEPENDENCIES', `${dep} installed (${deps[dep]})`);
    }
  }
  
  // Check build scripts
  if (packageJson.scripts) {
    if (packageJson.scripts.build) {
      logSuccess('SCRIPTS', 'Build script configured');
    } else {
      logIssue('SCRIPTS', 'No build script found');
    }
    
    if (packageJson.scripts.dev || packageJson.scripts.start) {
      logSuccess('SCRIPTS', 'Dev/start script configured');
    } else {
      logWarning('SCRIPTS', 'No dev/start script found');
    }
  }
}

function fullAudit() {
  console.log('\n🔍 FRONTEND FULL AUDIT');
  console.log('='.repeat(70));
  console.log('Checking frontend for issues before deployment...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  
  checkPackageJson();
  checkEnvironmentConfig();
  checkCriticalComponents();
  checkAuthContext();
  checkAPIEndpoints();
  
  console.log('\n🔍 CHECKING FOR BROKEN IMPORTS...');
  console.log('='.repeat(70));
  findBrokenImports(srcDir);
  
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
    console.log('✅ FRONTEND READY FOR DEPLOYMENT');
  } else {
    console.log('❌ FIX CRITICAL ISSUES BEFORE DEPLOYING');
  }
  
  console.log('='.repeat(70) + '\n');
  
  // Exit with error code if issues found
  process.exit(ISSUES.length > 0 ? 1 : 0);
}

fullAudit();
