import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  isLoading: false,
  error: null,

  fetchMyTickets: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/tickets/my');
      set({ tickets: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tickets',
        isLoading: false
      });
      return null;
    }
  },

  fetchTickets: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/tickets');
      set({ tickets: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tickets',
        isLoading: false
      });
      return null;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/tickets/${ticketId}`);
      set({ selectedTicket: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch ticket details',
        isLoading: false
      });
      return null;
    }
  },

  createTicket: async (ticketData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post('/tickets', ticketData);
      set((state) => ({
        tickets: [response.data, ...state.tickets],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create ticket',
        isLoading: false
      });
      return null;
    }
  },

  addComment: async (ticketId, message) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, { message });
      set((state) => ({
        selectedTicket: response.data,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add comment',
        isLoading: false
      });
      return null;
    }
  },

  updateStatus: async (ticketId, status) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.patch(`/tickets/${ticketId}/status`, { status });
      set((state) => ({
        selectedTicket: response.data,
        tickets: state.tickets.map(t =>
          t.id === ticketId ? { ...t, status: response.data.status } : t
        ),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update ticket status',
        isLoading: false
      });
      return null;
    }
  },

  deleteTicket: async (ticketId) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/tickets/${ticketId}`);
      set((state) => ({
        tickets: state.tickets.filter(t => t.id !== ticketId),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete ticket',
        isLoading: false
      });
      return null;
    }
  },

  clearSelectedTicket: () => set({ selectedTicket: null }),
  clearError: () => set({ error: null })
}));

export default useTicketStore;
