// Determine base API URL, normalizing whether it has /v1 or not
let rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
rawBase = rawBase.replace(/\/+$/, '');
const API_BASE_URL = rawBase;

/**
 * Custom Fetch Wrapper for REST API calls with proxy fallback
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

  let response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    // If direct origin failed (e.g. Brave Shields cross-origin block on localhost:5000), fallback to same-origin Vite proxy
    try {
      const fallbackUrl = `/api/v1${cleanEndpoint}`;
      response = await fetch(fallbackUrl, {
        ...options,
        headers,
      });
    } catch (proxyErr) {
      try {
        const fallbackUrl2 = `/api${cleanEndpoint}`;
        response = await fetch(fallbackUrl2, {
          ...options,
          headers,
        });
      } catch (finalErr) {
        throw new Error('Unable to connect to NextCampus API server. Please check your network or server status.');
      }
    }
  }

  let data = {};
  try {
    data = await response.json();
  } catch (jsonErr) {
    data = {};
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
