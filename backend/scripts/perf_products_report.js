/* eslint-disable no-console */
require('dotenv').config();
const axios = require('axios');

const CANDIDATE_BASES = [
  process.env.API_BASE,
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000'
].filter(Boolean);

const REQUEST_TIMEOUT_MS = 10000;
const RUNS_PER_ENDPOINT = Number.parseInt(process.env.PERF_RUNS || '5', 10);

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

function summarize(name, times, statuses) {
  const sorted = [...times].sort((a, b) => a - b);
  const avg = Math.round(sorted.reduce((sum, t) => sum + t, 0) / sorted.length);
  const p50 = percentile(sorted, 50);
  const p95 = percentile(sorted, 95);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const ok = statuses.filter((s) => s >= 200 && s < 400).length;

  return {
    name,
    runs: sorted.length,
    ok,
    avg,
    p50,
    p95,
    min,
    max
  };
}

async function resolveBaseUrl() {
  for (const base of CANDIDATE_BASES) {
    try {
      const response = await axios.get(`${base}/health`, { timeout: 4000 });
      if (response.status >= 200 && response.status < 400) return base;
    } catch (_) {
      // try next candidate
    }
  }
  throw new Error('Unable to reach API on configured endpoints');
}

async function runEndpoint(baseUrl, endpoint) {
  const times = [];
  const statuses = [];

  for (let i = 0; i < RUNS_PER_ENDPOINT; i += 1) {
    const started = Date.now();
    try {
      const response = await axios.get(`${baseUrl}${endpoint.path}`, {
        timeout: REQUEST_TIMEOUT_MS,
        validateStatus: () => true
      });
      const elapsed = Date.now() - started;
      times.push(elapsed);
      statuses.push(response.status);
    } catch (_) {
      const elapsed = Date.now() - started;
      times.push(elapsed);
      statuses.push(0);
    }
  }

  return summarize(endpoint.name, times, statuses);
}

async function run() {
  const baseUrl = await resolveBaseUrl();
  console.log(`Performance report base URL: ${baseUrl}`);
  console.log(`Runs per endpoint: ${RUNS_PER_ENDPOINT}`);

  const endpoints = [
    { name: 'Products list', path: '/api/products?limit=20' },
    { name: 'Products featured', path: '/api/products?featured=true&limit=6' },
    { name: 'Products search (scouter)', path: '/api/products?search=scouter&limit=20' },
    { name: 'Products search (capsule)', path: '/api/products?search=capsule&limit=20' }
  ];

  const rows = [];
  for (const endpoint of endpoints) {
    rows.push(await runEndpoint(baseUrl, endpoint));
  }

  console.log('\nProducts API Latency Summary (ms)');
  console.table(rows);

  const hasFailures = rows.some((row) => row.ok < row.runs);
  if (hasFailures) {
    console.error('One or more endpoint calls failed during the run.');
    process.exit(1);
  }
}

run().catch((error) => {
  console.error('Performance report failed:', error.message || error);
  process.exit(1);
});
