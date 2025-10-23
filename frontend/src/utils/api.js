
const API_BASE = import.meta.env.VITE_API_BASE || '';
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
    const res = await fetch(API_BASE + path, {
      credentials: options.credentials ?? 'omit',
      ...options,
      headers
    });
    const body = await res.json().catch(() => null);

    // Defensive: some hosts (static file hosts) will respond to unknown
    // API routes with an HTML index page (200) which causes res.json()
    // to fail and return null. Detect that early and throw a clear error
    // so callers don't attempt to read properties of `null`.
    if (body === null) {
      const e = new Error(`Invalid/non-JSON response from ${API_BASE || 'origin'}${path} - check VITE_API_BASE and backend availability`);
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
