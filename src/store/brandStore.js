
import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useBrandStore = create((set, get) => ({
  // State
  brands: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchBrands: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Replace with your actual API endpoint for brands
      const response = await axiosInstance.get('/brands');
      set({ brands: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch brands', 
        isLoading: false 
      });
      return [];
    }
  },
   
  
  // For testing/demo purposes when API is not available
  setMockBrands: (mockBrands) => {
    set({ brands: mockBrands, isLoading: false });
  },
    clearError: () => {
    set({ error: null });
  }
}));

export default useBrandStore;

