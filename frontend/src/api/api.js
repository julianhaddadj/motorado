import axios from 'axios';

// Create a preconfigured axios instance.  The base URL is taken from
// Vite’s environment variable VITE_API_URL; if not provided it defaults
// to the current origin (useful for development proxy).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: false,
});

// Automatically attach the JWT token (if available) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;