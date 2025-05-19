import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useProductStore = create((set, get) => ({
  // State
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/products');
      console.log(response.data, 'response');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },
  
  fetchProductById: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/products/${productId}`);
      set({ currentProduct: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product details', 
        isLoading: false 
      });
      return null;
    }
  },
  
  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/products/featured');
      set({ featuredProducts: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch featured products', 
        isLoading: false 
      });
    }
  },
  
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch categories', 
        isLoading: false 
      });
    }
  },
  
  // Helper methods
  getProductsByCategory: (categoryId) => {
    return get().products.filter(product => product.categoryId === categoryId);
  },
  
  searchProducts: (query) => {
    const searchTerm = query.toLowerCase();
    return get().products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  },
  
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));