import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useProductStore = create((set, get) => ({
  // State
  products: [],
  rentProducts: [],
  sellProducts: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/products');
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
  
  fetchProductsByType: async (type) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/products/by-type/${type}`);
      
      if (type === 'RENT') {
        set({ rentProducts: response.data, isLoading: false });
        return response.data;
      } else if (type === 'SELL') {
        set({ sellProducts: response.data, isLoading: false });
        return response.data;
      }
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || `Failed to fetch ${type} products`, 
        isLoading: false 
      });
      return [];
    }
  },
  
  fetchRentProducts: async () => {
    return get().fetchProductsByType('RENT');
  },
  
  fetchSellProducts: async () => {
    return get().fetchProductsByType('SELL');
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
    return get().products.filter(product => 
      product.category && product.category.categoryId === categoryId
    );
  },
  
  // Methods for accessing products by type
  getRentProducts: () => {
    return get().rentProducts;
  },
  
  getSellProducts: () => {
    return get().sellProducts;
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




