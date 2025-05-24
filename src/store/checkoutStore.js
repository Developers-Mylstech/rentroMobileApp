import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const useCheckoutStore = create((set, get) => ({
  // State
  order: null,
  loading: false,
  error: null,
  checkoutId: null,
  clientSecret: null,
  directCheckoutData: null,

  // Actions
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    

    try {
      
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

  // Updated method for direct checkout from product page
  directCheckout: async (productId, payload) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');

    try {
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      
      console.log('Sending buy-now request with payload:', JSON.stringify(payload));
      
      // Use the buy-now endpoint with the provided payload
      const response = await axiosInstance.post(`/products/${productId}/buy-now`, payload);
      
      console.log('Buy-now response:', JSON.stringify(response.data));
      
      // Store the checkout data for use in the checkout flow
      set({ 
        directCheckoutData: response.data,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Buy-now error:', error.response?.data || error.message);
      
      set({ 
        error: error.response?.data?.message || 'Failed to create direct checkout',
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
      const response = await axiosInstance.post('/payments/create-payment-intent', {checkoutId:id});
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

  // Clear checkout data
  clearCheckoutData: () => {
    set({ 
      order: null,
      checkoutId: null,
      clientSecret: null,
      directCheckoutData: null,
      error: null
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useCheckoutStore;

