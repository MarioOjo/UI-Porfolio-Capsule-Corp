const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('authToken');
  // If we're sending FormData, let the browser set the Content-Type (including boundary)
  const isFormData = options && options.body && (options.body instanceof FormData);
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // By default do not send credentials so simple GETs won't trigger credentialed preflight.
  // For endpoints that need cookies (auth), pass { credentials: 'include' } in options.
  const res = await fetch(API_BASE + path, {
    credentials: options.credentials ?? 'omit',
    ...options,
    headers
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error || body?.message || 'Request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export default apiFetch;
