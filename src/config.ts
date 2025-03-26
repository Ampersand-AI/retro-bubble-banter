const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001'
  : window.location.origin; // In production, use the current domain

export const API_ENDPOINTS = {
  support: `${API_BASE_URL}/api/support`
}; 