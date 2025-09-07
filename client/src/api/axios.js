import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api' });

// Add token automatically
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers['Authorization'] = `Bearer ${t}`;
  return config;
});
export default API;
