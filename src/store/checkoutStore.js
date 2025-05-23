import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const useCheckoutStore = create((set, get) => ({
  // State
  order: null,
  loading: false,
  error: null,
  checkoutId: null,
  clientSecret: null,

  // Actions
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');

    try {
          axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      const response = await axiosInstance.post('/checkouts', orderData);
      set({ checkoutId: response.data.checkoutId, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to place order',
        loading: false 
      });
      throw error;
    }
    
    
  },

  paymentCreation: async (id) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');
     try {
          axios.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      const response = await axios.post('https://8jo1qshtyzzh.share.zrok.io/api/v1/payments/create-payment-intent', {checkoutId:id});
      set({ clientSecret: response.data.clientSecret, loading: false });
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

