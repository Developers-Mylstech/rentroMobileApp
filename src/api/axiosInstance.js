import axios from 'axios';
// import { API_BASE_URL, API_TIMEOUT } from '@env';
import { useAuthStore } from '../store/authStore';

// Create axios instance with default config

const API = process.env.EXPO_PUBLIC_API_URL
const axiosInstance = axios.create({
  // Use hardcoded values as fallbacks
  baseURL: API,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

