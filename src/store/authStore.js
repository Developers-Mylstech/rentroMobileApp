import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isLoadingAuth: false,



  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/initiate-auth`, payload);
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false
      });
      return null;
    }
  },

  singup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, userData);
      console.log(response, 'response')
      set({ isLoading: false, });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false
      });
      return error.response;
    }
  },


  verifyOtp: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/complete-auth`, payload);

      if (response.status === 200) {
        if (response.data.accessToken) {
          await SecureStore.setItemAsync('auth_token', response.data.accessToken);
        }
        if (response.data.refreshToken) {
          await SecureStore.setItemAsync('refresh_token', response.data.refreshToken);
        }

        set({ user: response.data, isLoading: false, isAuthenticated: true });
        return response;
      } else {
        throw new Error('Verification failed with status: ' + response.status);
      }
    } catch (error) {
      set({
        error: response?.status === 200 ? null : (error.response?.data?.message || 'Verification failed'),
        isLoading: false
      });
      return null;
    }
  },


  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      const response = await axiosInstance.post(`/auth/logout?refreshToken=${refreshToken}`);
      await SecureStore.deleteItemAsync('access_token');
      set({ user: null, isLoading: false, isAuthenticated: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Logout failed',
        isLoading: false
      });
    }
  },

  initAuth: async () => {
    try {
      set({ isLoadingAuth: true });
      const token = await SecureStore.getItemAsync('auth_token');
      const refreshtoken = await SecureStore.getItemAsync('refresh_token');

      if (token && refreshtoken) {
        try {
          const response = await axiosInstance.get('/auth/me');
          set({  isLoading: false, isAuthenticated: true });
        } catch (error) {
          set({ isLoadingAuth: false, isAuthenticated: true });
        }
      } else {
        set({ isLoadingAuth: false, isAuthenticated: false });
      }
    } catch (error) {
      console.log('Init auth error:', error);
      set({ isLoadingAuth: false });
    }
  },

  signIn: (userData) => set({ user: userData, isAuthenticated: true }),
  signOut: () => set({ user: null, isAuthenticated: false }),
  checkAuth: () => get().isAuthenticated,
  clearError: () => set({ error: null })
}));
