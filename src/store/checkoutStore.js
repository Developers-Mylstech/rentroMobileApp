import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import * as SecureStore from 'expo-secure-store';

const useCheckoutStore = create((set, get) => ({
  // State
  order: null,
  loading: false,
  error: null,
  checkoutId: null,

  // Actions
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');

    try {
          axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      const response = await axiosInstance.post('/checkouts', orderData);
      set({ checkoutId: response.checkoutId, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to place order',
        loading: false 
      });
      throw error;
    }
  },

  // Clear order
  clearOrder: () => {
    set({ order: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useCheckoutStore;

