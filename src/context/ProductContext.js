import { create } from "zustand";
// import { API_URL } from '@env';

// Create a store for product data using Zustand
export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    try {
      set({ loading: true });
      // Use a hardcoded API URL as fallback
      const apiUrl = process.env.API_URL || "https://api.example.com";
      console.log('Using API URL:', apiUrl);
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
