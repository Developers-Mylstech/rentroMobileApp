import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useInvoiceStore = create((set, get) => ({
  invoices: [],
  selectedInvoice: null,
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/invoices');
      set({ invoices: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch invoices',
        isLoading: false
      });
      return null;
    }
  },

  getInvoiceById: async (invoiceId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/invoices/${invoiceId}`);
      set({ selectedInvoice: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch invoice details',
        isLoading: false
      });
      return null;
    }
  },

  clearSelectedInvoice: () => set({ selectedInvoice: null }),
  clearError: () => set({ error: null })
}));

export default useInvoiceStore;
