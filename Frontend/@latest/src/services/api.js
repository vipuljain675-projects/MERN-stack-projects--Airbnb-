import axios from 'axios';

// 🟢 RECTIFIED: Use a dynamic URL for the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;