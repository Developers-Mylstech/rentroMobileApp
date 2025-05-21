import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL

const axiosInstance = axios.create({

  
  baseURL: apiUrl,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

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

