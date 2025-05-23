import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import * as SecureStore from 'expo-secure-store';

const useProfileStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

 
  fetchProfile: async () => {
    try{
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get('/profile');
      set({ profile: response.data, isLoading: false });
    }catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch profile', 
        isLoading: false 
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
  
  // Reset store
  resetProfile: () => set({ profile: null, error: null })
}));

export default useProfileStore;