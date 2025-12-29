import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3500/api' // Matches your backend port
});

// 🟢 RECTIFIED: Automatically attach token to EVERY request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;