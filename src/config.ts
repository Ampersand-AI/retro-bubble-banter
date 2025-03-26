const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001'
  : ''; // In production, use relative URL since frontend and backend are served from the same origin

export const API_ENDPOINTS = {
  support: `${API_BASE_URL}/api/support`
}; 