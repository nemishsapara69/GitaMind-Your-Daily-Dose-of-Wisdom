import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your backend API base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from local storage
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;