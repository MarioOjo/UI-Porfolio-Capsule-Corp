const fs = require('fs');
const path = require('path');

function extractWorkspaceSlugs() {
  const dataFile = path.join(__dirname, '..', 'src', 'data', 'products.js');
  const content = fs.readFileSync(dataFile, 'utf8');
  const matches = [...content.matchAll(/slug:\s*"([^"]+)"|slug:\s*'([^']+)'/g)];
  return [...new Set(matches.map((m) => m[1] || m[2]).filter(Boolean))].sort();
}

async function fetchApiProducts(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  const body = await response.json();
  return Array.isArray(body) ? body : (body.products || []);
}

async function getApiSlugs() {
  const primary = process.env.PRODUCT_API_URL || 'http://localhost:5000/api/products?limit=500';
  const fallback = 'http://localhost:3000/api/products?limit=500';

  try {
    const products = await fetchApiProducts(primary);
    return [...new Set(products.map((p) => p.slug).filter(Boolean))].sort();
  } catch (primaryError) {
    const products = await fetchApiProducts(fallback);
    return [...new Set(products.map((p) => p.slug).filter(Boolean))].sort();
  }
}

function diff(source, target) {
  const targetSet = new Set(target);
  return source.filter((item) => !targetSet.has(item));
}

async function run() {
  const workspaceSlugs = extractWorkspaceSlugs();
  const apiSlugs = await getApiSlugs();

  const missingOnSite = diff(workspaceSlugs, apiSlugs);
  const extraOnSite = diff(apiSlugs, workspaceSlugs);

  console.log('Catalog Parity Report');
  console.log(`- workspace slugs: ${workspaceSlugs.length}`);
  console.log(`- api slugs: ${apiSlugs.length}`);
  console.log(`- missing on site: ${missingOnSite.length}`);
  if (missingOnSite.length) console.log(`  ${missingOnSite.join(', ')}`);
  console.log(`- extra on site: ${extraOnSite.length}`);
  if (extraOnSite.length) console.log(`  ${extraOnSite.join(', ')}`);

  if (missingOnSite.length > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Catalog parity check failed:', err.message || err);
  process.exit(1);
});
