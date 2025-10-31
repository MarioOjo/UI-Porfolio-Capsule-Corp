
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
    // Try to parse JSON but capture a helpful snippet if parsing fails.
    // Use clone() so we can read text for diagnostics when the body isn't JSON.
    let body = null;
    try {
      body = await res.clone().json();
    } catch (jsonErr) {
      // attempt to read raw text to include in the error (trim to avoid huge payloads)
      let raw = '';
      try {
        raw = await res.clone().text();
      } catch (tErr) {
        raw = '[unreadable response body]';
      }
      const snippet = raw ? (raw.slice(0, 400) + (raw.length > 400 ? '... (truncated)' : '')) : '[empty response]';
      const e = new Error(`Invalid/non-JSON response from ${base || 'origin'}${path} - check VITE_API_BASE and backend availability. Response preview: ${snippet}`);
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
