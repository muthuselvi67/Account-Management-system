import axios from 'axios';

// Create an Axios instance with a base URL pointing to the PHP backend
// Update this URL if your PHP development server runs on a different port/host
const api = axios.create({
  baseURL: 'http://localhost:8000/backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
