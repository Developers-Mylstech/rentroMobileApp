import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useServiceStore = create((set) => ({
  services: [],
  selectedService: null,
  error: null,
  isLoading: false,

  getAllServices: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get('/our-services');
      set({ services: response.data, error: null, isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching all services:', error);
      set({ error: error.message || 'Failed to fetch services', isLoading: false });
    }
  },

  getServiceById: async (id) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/our-services/${id}/products`);
      set({ selectedService: response.data, error: null, isLoading: false });
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      set({ error: error.message || 'Failed to fetch service by ID', isLoading: false });
    }
  },
  
  
}));

export default useServiceStore;
