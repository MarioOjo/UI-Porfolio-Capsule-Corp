// Enhanced API Fetch Utility with advanced features
// Resolve API base at call-time (reads window.__RUNTIME_CONFIG__ if present)
// This avoids a race where modules are evaluated before /env.json is fetched.

// Error types for better error handling
export class ApiError extends Error {
  constructor(message, status = 0, code = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isApiError = true;
  }
}

export class NetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.isNetworkError = true;
  }
}

export class TimeoutError extends Error {
  constructor(message, timeoutMs) {
    super(message);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
    this.timestamp = new Date().toISOString();
    this.isTimeoutError = true;
  }
}

// Configuration
const DEFAULT_CONFIG = {
  timeout: 10000,
  maxRetries: 2,
  retryDelay: 1000,
  baseUrl: '',
  enableLogging: import.meta.env.MODE === 'development',
  enableMetrics: true
};

// Runtime configuration
function getRuntimeConfig() {
  if (typeof window !== 'undefined') {
    return window.__RUNTIME_CONFIG__ || {};
  }
  return {};
}

// Get API base URL
function getApiBase() {
  const RUNTIME = getRuntimeConfig();
  return RUNTIME.VITE_API_BASE || import.meta.env.VITE_API_BASE || DEFAULT_CONFIG.baseUrl;
}

// Get auth token from various sources
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage first
  const token = localStorage.getItem('authToken');
  if (token) return token;
  
  // Check sessionStorage as fallback
  const sessionToken = sessionStorage.getItem('authToken');
  if (sessionToken) return sessionToken;
  
  return null;
}

// Request metrics tracking
class RequestMetrics {
  constructor() {
    this.requests = new Map();
    this.enabled = DEFAULT_CONFIG.enableMetrics;
  }

  startRequest(id, url) {
    if (!this.enabled) return;
    this.requests.set(id, {
      url,
      startTime: performance.now(),
      status: 'pending'
    });
  }

  endRequest(id, status, error = null) {
    if (!this.enabled) return;
    
    const request = this.requests.get(id);
    if (request) {
      request.endTime = performance.now();
      request.duration = request.endTime - request.startTime;
      request.status = status;
      request.error = error;
      
      // Log slow requests
      if (request.duration > 5000) { // 5 seconds
        console.warn(`Slow API request: ${request.url} took ${request.duration.toFixed(2)}ms`);
      }
    }
  }

  getMetrics() {
    return Array.from(this.requests.values());
  }
}

const metrics = new RequestMetrics();

// Retry logic with exponential backoff
async function withRetry(fn, maxRetries = DEFAULT_CONFIG.maxRetries, retryDelay = DEFAULT_CONFIG.retryDelay) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on these errors
      if (error.isApiError && (
        error.status === 400 || // Bad Request
        error.status === 401 || // Unauthorized
        error.status === 403 || // Forbidden
        error.status === 404 || // Not Found
        error.status >= 500 && error.status < 600 // Server errors (retry these actually)
      )) {
        // For server errors, we do want to retry, but not for client errors
        if (error.status >= 400 && error.status < 500) {
          break;
        }
      }
      
      // Don't retry on timeout errors (they're usually network issues)
      if (error.isTimeoutError) {
        break;
      }
      
      // Don't retry on abort errors
      if (error.name === 'AbortError') {
        break;
      }
      
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        if (DEFAULT_CONFIG.enableLogging) {
          console.warn(`API request failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`, error);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }
  
  throw lastError;
}

// Request ID generator
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Enhanced API Fetch function
export async function apiFetch(path, options = {}) {
  const requestId = generateRequestId();
  const token = getAuthToken();
  const isFormData = options.body && (options.body instanceof FormData);
  
  // Merge with default options
  const config = {
    timeout: DEFAULT_CONFIG.timeout,
    maxRetries: DEFAULT_CONFIG.maxRetries,
    retryDelay: DEFAULT_CONFIG.retryDelay,
    credentials: 'include',
    ...options
  };

  // Headers configuration
  const headers = new Headers();
  
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Add custom headers
  if (config.headers) {
    Object.entries(config.headers).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }
  
  // Add request ID for tracking
  headers.set('X-Request-ID', requestId);
  
  const base = getApiBase();
  const url = base + path;

  // Start metrics tracking
  metrics.startRequest(requestId, url);

  try {
    const executeRequest = async () => {
      const controller = new AbortController();
      let timeoutId;

      // Setup timeout
      if (config.timeout > 0) {
        timeoutId = setTimeout(() => {
          controller.abort();
          throw new TimeoutError(`Request timeout after ${config.timeout}ms`, config.timeout);
        }, config.timeout);
      }

      try {
        // Prepare fetch options
        const fetchOptions = {
          method: config.method || 'GET',
          headers,
          signal: controller.signal,
          credentials: config.credentials,
          ...config
        };

        // Handle request body
        if (config.body && !isFormData && typeof config.body === 'object') {
          fetchOptions.body = JSON.stringify(config.body);
        } else if (config.body) {
          fetchOptions.body = config.body;
        }

        // Remove non-fetch options
        delete fetchOptions.timeout;
        delete fetchOptions.maxRetries;
        delete fetchOptions.retryDelay;

        if (DEFAULT_CONFIG.enableLogging) {
          console.log(`API Request: ${fetchOptions.method} ${url}`, {
            headers: Object.fromEntries(headers),
            body: config.body
          });
        }

        const response = await fetch(url, fetchOptions);
        
        if (timeoutId) clearTimeout(timeoutId);

        // Handle response
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        let body;
        
        if (isJson) {
          try {
            body = await response.json();
          } catch (parseError) {
            throw new ApiError(
              `Invalid JSON response from server`,
              response.status,
              'INVALID_JSON',
              { parseError: parseError.message }
            );
          }
        } else {
          // For non-JSON responses, read as text
          body = await response.text();
          
          // Check if this might be an HTML error page
          if (response.status >= 400 && body.includes('<!DOCTYPE html>')) {
            throw new ApiError(
              `Server returned HTML error page (likely wrong API endpoint)`,
              response.status,
              'HTML_RESPONSE'
            );
          }
        }

        if (!response.ok) {
          const errorMessage = body?.error || 
                             body?.message || 
                             body?.detail || 
                             `Request failed with status ${response.status}`;
          
          const apiError = new ApiError(
            errorMessage,
            response.status,
            body?.code || 'UNKNOWN_ERROR',
            body?.details || body
          );

          // Handle specific status codes
          if (response.status === 401) {
            // Token expired or invalid
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              sessionStorage.removeItem('authToken');
              // Optionally trigger auth refresh or redirect
              window.dispatchEvent(new CustomEvent('auth-expired'));
            }
          }

          throw apiError;
        }

        if (DEFAULT_CONFIG.enableLogging) {
          console.log(`API Response: ${response.status} ${url}`, body);
        }

        metrics.endRequest(requestId, 'success');
        return body;

      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Execute with retry logic
    return await withRetry(executeRequest, config.maxRetries, config.retryDelay);

  } catch (error) {
    metrics.endRequest(requestId, 'error', error);
    
    // Re-throw known error types
    if (error instanceof ApiError || 
        error instanceof NetworkError || 
        error instanceof TimeoutError) {
      throw error;
    }

    // Handle network errors
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request aborted (likely timeout)`, config.timeout);
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Network connection failed', error);
    }

    // Wrap unknown errors
    throw new NetworkError(
      'Network error. Please check your connection or try again later.',
      error
    );
  }
}

// Convenience methods
export const api = {
  get: (path, options = {}) => apiFetch(path, { ...options, method: 'GET' }),
  
  post: (path, data = null, options = {}) => 
    apiFetch(path, { ...options, method: 'POST', body: data }),
  
  put: (path, data = null, options = {}) => 
    apiFetch(path, { ...options, method: 'PUT', body: data }),
  
  patch: (path, data = null, options = {}) => 
    apiFetch(path, { ...options, method: 'PATCH', body: data }),
  
  delete: (path, options = {}) => 
    apiFetch(path, { ...options, method: 'DELETE' }),
};

// Utility functions
export const apiUtils = {
  setAuthToken: (token, persist = true) => {
    if (typeof window !== 'undefined') {
      if (persist) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }
    }
  },
  
  clearAuthToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  },
  
  getMetrics: () => metrics.getMetrics(),
  
  configure: (newConfig) => {
    Object.assign(DEFAULT_CONFIG, newConfig);
    metrics.enabled = DEFAULT_CONFIG.enableMetrics;
  },
  
  isApiError: (error) => error && error.isApiError,
  isNetworkError: (error) => error && error.isNetworkError,
  isTimeoutError: (error) => error && error.isTimeoutError,
};

export default apiFetch;