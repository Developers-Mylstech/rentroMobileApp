import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  
  getAllOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.get('/orders/user');
      set({ orders: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch orders', 
        isLoading: false 
      });
      return null;
    }
  },
  
  getOrderById: async (orderId) => {
    try {
      set({ isLoading: true, error: null });
    
      const response = await axiosInstance.get(`/orders/${orderId}`);
      set({ currentOrder: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch order details', 
        isLoading: false 
      });
      return null;
    }
  },
  
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useOrderStore;