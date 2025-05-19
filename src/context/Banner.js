import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useBannerStore = create((set, get) => ({
  // State
  banners: [],
  isLoading: false,
  error: null,
  
  fetchBanners: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/banners');
      set({ banners: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch banners', 
        isLoading: false 
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));