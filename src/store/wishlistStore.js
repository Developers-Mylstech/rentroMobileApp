
import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import * as SecureStore from 'expo-secure-store';

const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
  isLoading: false,
  error: null,
  
  fetchWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get('/wishlist');
      set({ wishlistItems: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch wishlist', 
        isLoading: false 
      });
      return null;
    }
  },
  
  addToWishlist: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.post('/wishlist', { productId });
      set(state => ({ 
        wishlistItems: [...state.wishlistItems, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add item to wishlist', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  removeFromWishlist: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/wishlist/products/${productId}`);
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove item from wishlist', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useWishlistStore;

