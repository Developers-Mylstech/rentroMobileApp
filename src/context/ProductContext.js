import { create } from 'zustand';
import axios from 'axios';
import {API_URL, API_TOKEN} from "@env"

// Sample product data as fallback
const sampleProducts = [
  {
    id: '1',
    name: 'Product 1',
    price: 'AED 99',
    category: 'Electronics',
    description: 'High quality product with amazing features',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 'AED 149',
    category: 'Home & Garden',
    description: 'Premium quality for your home needs',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 'AED 56',
    category: 'Automotive',
    description: 'Essential for your vehicle maintenance',
    image: 'https://via.placeholder.com/300',
  },
];


const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  
  // Get all products
  getAllProducts: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.get(`${API_URL}/products`);
      set({ products: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false,
        products: sampleProducts // Fallback to sample data on error
      });
      return sampleProducts;
    }
  },
  
  // Get product by ID
  getProductById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get(`/products/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
      
      // Fallback to local search if API fails
      return get().products.find(p => p.id === id) || null;
    }
  }
}));

export default useProductStore;
