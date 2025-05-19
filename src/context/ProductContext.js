import { create } from "zustand";
import { API_URL } from '@env';

// Create a store for product data using Zustand
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  
 
  fetchProducts: async () => {
    try {
      set({ loading: true });
      console.log(API_URL, 'API_URL');
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  
}));
