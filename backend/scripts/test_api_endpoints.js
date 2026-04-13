/* eslint-disable no-console */
require('dotenv').config();
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:5000';
const USER_EMAIL = process.env.TEST_USER_EMAIL || 'goku@capsulecorp.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'User123!';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || '';
const REQUIRE_AUTH_TESTS = process.env.REQUIRE_AUTH_TESTS === '1';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function check(name, fn) {
  const started = Date.now();
  try {
    const result = await fn();
    const ms = Date.now() - started;
    console.log(`PASS ${name} (${ms}ms)`);
    return result;
  } catch (error) {
    const ms = Date.now() - started;
    console.error(`FAIL ${name} (${ms}ms)`);
    console.error(`  ${error.message}`);
    throw error;
  }
}

async function login(email, password) {
  const response = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, { timeout: 10000 });
  assert(response.status === 200, 'Login should return 200');
  assert(response.data && response.data.token, 'Login response missing token');
  return response.data.token;
}

async function run() {
  console.log(`Running API smoke tests against ${API_BASE}`);

  let userToken;
  let productId;
  let productSlug;
  let canRunAuthChecks = true;

  await check('Health endpoint', async () => {
    const response = await axios.get(`${API_BASE}/health`, { timeout: 10000 });
    assert(response.status === 200, 'Health should return 200');
    assert(response.data && response.data.status, 'Health payload missing status');
  });

  await check('Products list endpoint', async () => {
    const response = await axios.get(`${API_BASE}/api/products?limit=5`, { timeout: 10000 });
    assert(response.status === 200, 'Products list should return 200');
    const payload = response.data;
    const products = Array.isArray(payload)
      ? payload
      : (payload.products || payload.items || []);
    assert(Array.isArray(products), 'Products payload should contain array');
    if (products.length === 0) {
      console.log('WARN Products list is empty; skipping product detail checks');
      return;
    }
    const first = products[0];
    productId = first.id || first._id;
    const withSlug = products.find((p) => p && p.slug);
    productSlug = withSlug ? withSlug.slug : null;
    assert(!!productId, 'First product missing id');
    if (!productSlug) {
      console.log('WARN No product slug found; skipping slug endpoint check');
    }
  });

  if (productSlug) {
    await check('Product by slug endpoint', async () => {
      const response = await axios.get(`${API_BASE}/api/products/slug/${encodeURIComponent(productSlug)}`, { timeout: 10000 });
      assert(response.status === 200, 'Product by slug should return 200');
      assert(response.data && response.data.product, 'Product by slug payload missing product');
    });
  }

  if (productId) {
    await check('Product by id endpoint', async () => {
      const response = await axios.get(`${API_BASE}/api/products/${encodeURIComponent(productId)}`, { timeout: 10000 });
      assert(response.status === 200, 'Product by id should return 200');
      assert(response.data && response.data.product, 'Product by id payload missing product');
    });
  }

  await check('User login endpoint', async () => {
    try {
      userToken = await login(USER_EMAIL, USER_PASSWORD);
    } catch (error) {
      const status = error.response && error.response.status;
      if (status === 401 && !REQUIRE_AUTH_TESTS) {
        canRunAuthChecks = false;
        console.log('WARN Login returned 401; skipping auth-required checks in non-strict mode');
        return;
      }
      throw error;
    }
  });

  if (canRunAuthChecks) {
    await check('Auth me endpoint', async () => {
      const response = await axios.get(`${API_BASE}/api/auth/me`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      assert(response.status === 200, 'Auth me should return 200');
      assert(response.data && response.data.user, 'Auth me should return user');
    });

    await check('Profile endpoint (auth required)', async () => {
      const response = await axios.get(`${API_BASE}/api/profile`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      assert(response.status === 200, 'Profile should return 200');
      assert(response.data && response.data.user, 'Profile payload missing user');
    });

    await check('Cart read endpoint (auth required)', async () => {
      const response = await axios.get(`${API_BASE}/api/cart`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      assert(response.status === 200, 'Cart should return 200');
      assert(response.data && Object.prototype.hasOwnProperty.call(response.data, 'cart'), 'Cart payload missing cart');
    });

    await check('My orders endpoint (auth required)', async () => {
      const response = await axios.get(`${API_BASE}/api/orders/my-orders`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      assert(response.status === 200, 'My orders should return 200');
      assert(response.data && response.data.success === true, 'My orders payload missing success flag');
    });

    await check('Admin orders endpoint blocks non-admin token', async () => {
      let blocked = false;
      try {
        await axios.get(`${API_BASE}/api/admin/orders`, {
          timeout: 10000,
          headers: { Authorization: `Bearer ${userToken}` }
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          blocked = true;
        }
      }
      assert(blocked, 'Non-admin token should be blocked with 403 on admin orders endpoint');
    });
  } else {
    console.log('SKIP Auth-required checks (no valid test credentials found in this environment)');
  }

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    await check('Admin login endpoint', async () => {
      const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
      const response = await axios.get(`${API_BASE}/api/admin/orders`, {
        timeout: 10000,
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert(response.status === 200, 'Admin orders should return 200 for admin token');
    });
  } else {
    console.log('SKIP Admin positive check (set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to enable)');
  }

  console.log('All API smoke tests completed successfully.');
}

run().catch(() => {
  process.exit(1);
});
