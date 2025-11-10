/**
 * Admin API Test Script
 * Tests all admin endpoints to ensure they work correctly
 */

const API_BASE = process.env.API_BASE || 'http://localhost:5000';

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, token = null, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    log(`\nTesting: ${name}`, 'cyan');
    log(`${method} ${url}`, 'blue');
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ SUCCESS (${response.status})`, 'green');
      return { success: true, data, status: response.status };
    } else {
      log(`❌ FAILED (${response.status})`, 'red');
      log(`Error: ${data.error || JSON.stringify(data)}`, 'red');
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n🚀 Starting Admin API Tests...', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  let adminToken = null;
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  // Test 1: Health Check
  testResults.total++;
  const health = await testEndpoint(
    'Health Check',
    'GET',
    `${API_BASE}/health`
  );
  if (health.success) testResults.passed++;
  else testResults.failed++;
  
  // Test 2: Login as admin
  testResults.total++;
  const login = await testEndpoint(
    'Admin Login',
    'POST',
    `${API_BASE}/api/auth/login`,
    null,
    {
      email: 'mario@capsulecorp.com',
      password: 'Admin123!'  // You'll need to set this or use your actual password
    }
  );
  
  if (login.success && login.data.token) {
    testResults.passed++;
    adminToken = login.data.token;
    log(`Token: ${adminToken.substring(0, 20)}...`, 'yellow');
    log(`User role: ${login.data.user?.role || 'N/A'}`, 'yellow');
    
    if (login.data.user?.role !== 'admin') {
      log('⚠️  WARNING: User logged in but role is not admin!', 'yellow');
    }
  } else {
    testResults.failed++;
    log('⚠️  Cannot continue without admin token. Please update credentials.', 'yellow');
  }
  
  // Test 3: Get current user (/api/me)
  if (adminToken) {
    testResults.total++;
    const me = await testEndpoint(
      'Get Current User',
      'GET',
      `${API_BASE}/api/me`,
      adminToken
    );
    if (me.success) {
      testResults.passed++;
      log(`User: ${me.data.user?.email} (${me.data.user?.role})`, 'yellow');
    } else {
      testResults.failed++;
    }
  }
  
  // Test 4: Get all users (admin endpoint)
  if (adminToken) {
    testResults.total++;
    const users = await testEndpoint(
      'Get All Users',
      'GET',
      `${API_BASE}/api/admin/users`,
      adminToken
    );
    if (users.success) {
      testResults.passed++;
      log(`Found ${users.data.users?.length || 0} users`, 'yellow');
    } else {
      testResults.failed++;
    }
  }
  
  // Test 5: Get orders stats
  if (adminToken) {
    testResults.total++;
    const stats = await testEndpoint(
      'Get Order Stats',
      'GET',
      `${API_BASE}/api/admin/orders/stats`,
      adminToken
    );
    if (stats.success) {
      testResults.passed++;
      log(`Orders: ${stats.data.total_orders || 0}, Revenue: $${stats.data.total_revenue || 0}`, 'yellow');
    } else {
      testResults.failed++;
    }
  }
  
  // Test 6: Get all orders
  if (adminToken) {
    testResults.total++;
    const orders = await testEndpoint(
      'Get All Orders',
      'GET',
      `${API_BASE}/api/admin/orders`,
      adminToken
    );
    if (orders.success) {
      testResults.passed++;
      log(`Found ${orders.data.orders?.length || 0} orders`, 'yellow');
    } else {
      testResults.failed++;
    }
  }
  
  // Test 7: Get products (public endpoint)
  testResults.total++;
  const products = await testEndpoint(
    'Get Products',
    'GET',
    `${API_BASE}/api/products`
  );
  if (products.success) {
    testResults.passed++;
    log(`Found ${products.data?.length || 0} products`, 'yellow');
  } else {
    testResults.failed++;
  }
  
  // Test 8: Test cart endpoint (requires auth)
  if (adminToken) {
    testResults.total++;
    const cart = await testEndpoint(
      'Get Cart',
      'GET',
      `${API_BASE}/api/cart`,
      adminToken
    );
    if (cart.success) {
      testResults.passed++;
      log(`Cart has ${cart.data.cart?.length || 0} items`, 'yellow');
    } else {
      testResults.failed++;
    }
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'yellow');
  
  if (testResults.failed === 0) {
    log('\n✅ All tests passed!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Review the output above.', 'yellow');
  }
  
  log('\n📝 Next Steps:', 'cyan');
  if (!adminToken) {
    log('   1. Update admin credentials in this script', 'yellow');
    log('   2. Ensure mario@capsulecorp.com user exists in database', 'yellow');
    log('   3. Run comprehensive_admin_fix.js to set admin role', 'yellow');
  } else {
    log('   1. Test admin dashboard in browser', 'yellow');
    log('   2. Verify all admin pages load correctly', 'yellow');
    log('   3. Test CRUD operations on products/users/orders', 'yellow');
  }
  
  log('\n');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
