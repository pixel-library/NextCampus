const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Custom Fetch Wrapper for REST API calls
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
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

