// Determine base API URL, normalizing whether it has /v1 or not
// In local dev, default to same-origin proxy /api/v1 to avoid CORS and Brave Shields localhost blocks
let rawBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://127.0.0.1:5000/api/v1');
rawBase = rawBase.replace(/\/+$/, '');
// Normalize localhost to 127.0.0.1 to avoid IPv6 loopback hangs
rawBase = rawBase.replace('//localhost:', '//127.0.0.1:');
const API_BASE_URL = rawBase;

/**
 * Custom Fetch Wrapper for REST API calls with timeout and proxy fallback
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('nextcampus_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If FormData, let browser set Content-Type boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const requestUrl = `${API_BASE_URL}${cleanEndpoint}`;

  // Enforce a strict 10-second timeout to prevent infinite "Authenticating..." spinner
  const timeoutMs = options.timeout || 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
  } catch (networkErr) {
    clearTimeout(timeoutId);
    if (networkErr.name === 'AbortError') {
      throw new Error('Connection timed out. The backend server took too long to respond. Please check your network or server status.');
    }
    // If direct origin failed (e.g. Brave Shields cross-origin block on localhost:5000), fallback to same-origin Vite proxy
    try {
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 6000);
      const fallbackUrl = `/api/v1${cleanEndpoint}`;
      response = await fetch(fallbackUrl, {
        ...options,
        headers,
        signal: fallbackController.signal,
      });
      clearTimeout(fallbackTimeout);
    } catch (proxyErr) {
      try {
        const fallbackController2 = new AbortController();
        const fallbackTimeout2 = setTimeout(() => fallbackController2.abort(), 6000);
        const fallbackUrl2 = `/api${cleanEndpoint}`;
        response = await fetch(fallbackUrl2, {
          ...options,
          headers,
          signal: fallbackController2.signal,
        });
        clearTimeout(fallbackTimeout2);
      } catch (finalErr) {
        throw new Error('Unable to connect to NextCampus API server. Please ensure the backend is running.');
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = response.headers.get('content-type') || '';
  let data = {};
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (jsonErr) {
      data = {};
    }
  } else {
    // Non-JSON response (e.g., HTML from 404/500/SPA rewrite)
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status} (${response.statusText || 'Error'}).`);
    }
    throw new Error('Received unexpected non-JSON response from server. Backend API may be unreachable.');
  }

  if (!response.ok) {
    const errorMsg =
      data.message ||
      (data.errors ? Object.values(data.errors).join(', ') : null) ||
      `Request failed (${response.status}: ${response.statusText || 'Error'})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default {
  get: (url) => apiRequest(url, { method: 'GET' }),
  post: (url, body) => apiRequest(url, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (url, body) => apiRequest(url, { method: 'PATCH', body: JSON.stringify(body) }),
  put: (url, body) => apiRequest(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, body) => apiRequest(url, { method: 'DELETE', ...(body ? { body: JSON.stringify(body) } : {}) }),
};
