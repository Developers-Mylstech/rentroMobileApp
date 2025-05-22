import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useCheckoutStore = create((set, get) => ({
  // State
  order: null,
  loading: false,
  error: null,

  // Actions
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');

    try {
          axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      const response = await axiosInstance.post('/checkout', orderData);
      set({ order: response.data, loading: false });
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

