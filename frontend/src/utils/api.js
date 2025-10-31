
// Resolve API base at call-time (reads window.__RUNTIME_CONFIG__ if present)
// This avoids a race where modules are evaluated before /env.json is fetched.
function getApiBase() {
  const RUNTIME = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {};
  return RUNTIME.VITE_API_BASE || import.meta.env.VITE_API_BASE || '';
}
const FALLBACK_ERROR = 'Network error. Please check your connection or try again later.';


export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('authToken');
  const isFormData = options && options.body && (options.body instanceof FormData);
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const base = getApiBase();
    // support a timeout (ms) passed via options.timeout, default 10s
    const timeoutMs = typeof options.timeout === 'number' ? options.timeout : 10000;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    let timeoutId;
    if (controller) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      // ensure options doesn't leak the timeout param to fetch
      delete options.timeout;
    }
    // If no explicit API base is configured we assume same-origin and send
    // cookies by default (helps backends that use cookie sessions).
    const defaultCredentials = base ? 'omit' : 'include';
    const res = await fetch(base + path, {
      credentials: options.credentials ?? defaultCredentials,
      signal: controller ? controller.signal : undefined,
      ...options,
      headers
    });
    if (timeoutId) clearTimeout(timeoutId);
    const body = await res.json().catch(() => null);

    // Defensive: some hosts (static file hosts) will respond to unknown
    // API routes with an HTML index page (200) which causes res.json()
    // to fail and return null. Detect that early and throw a clear error
    // so callers don't attempt to read properties of `null`.
    if (body === null) {
      const e = new Error(`Invalid/non-JSON response from ${base || 'origin'}${path} - check VITE_API_BASE and backend availability`);
      // mark so the catch below can rethrow this message instead of overwriting it
      e.isApiError = true;
      throw e;
    }

    if (!res.ok) {
      const err = new Error(body?.error || body?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.body = body;
      err.isApiError = true;
      throw err;
    }

    return body;
  } catch (err) {
    // If this was an API error we created above, preserve the message
    if (err && err.isApiError) throw err;
    // Network or CORS error - keep a friendly, consistent message but attach cause
    const error = new Error(FALLBACK_ERROR);
    error.cause = err;
    throw error;
  }
}

export default apiFetch;
