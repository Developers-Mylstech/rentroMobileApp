import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axiosInstance from '../utils/axiosInstance';


const useAddressStore = create((set, get) => ({
  // State
  addresses: [],
  loading: false,
  error: null,

  // Actions
  fetchAddresses: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get('/addresses');
      set({ addresses: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch addresses',
        loading: false 
      });
      throw error;
    }
  },

  addAddress: async (addressData) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.post('/addresses', addressData);
      set((state) => ({
        addresses: [...state.addresses, response.data],
        loading: false
      }));
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add address',
        loading: false 
      });
      throw error;
    }
  },

  updateAddress: async (addressId, updatedData) => {

    set({ loading: true, error: null });

    try {
        
      const response = await axiosInstance.put(`/addresses/${addressId}`, updatedData);
      set((state) => ({
        addresses: state.addresses.map(addr => addr.id === addressId ? response.data : addr),
        loading: false
      }));
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update address',
        loading: false 
      });
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    set({ loading: true, error: null });
   console.log(addressId, 'address id');

    try {
      await axiosInstance.delete(`/addresses/${addressId}`);
      set((state) => ({
        addresses: state.addresses.filter(addr => addr.id !== addressId),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete address',
        loading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useAddressStore;