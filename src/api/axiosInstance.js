import axios from 'axios';
// import { API_BASE_URL} from '../../@env';
import { useAuthStore } from '../store/authStore';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: "https://x5ham8a7nm5c.share.zrok.io/api/v1",
  // timeout: parseInt(API_TIMEOUT || '10000'),
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

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Sign out user on auth errors
      useAuthStore.getState().signOut();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;