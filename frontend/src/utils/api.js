
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
    if (!res.ok) {
      const err = new Error(body?.error || body?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  } catch (err) {
    // Network or CORS error
    const error = new Error(FALLBACK_ERROR);
    error.cause = err;
    throw error;
  }
}

export default apiFetch;
