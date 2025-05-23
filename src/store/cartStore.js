import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalAmount: 0,
  isCartOpen: false,



  addToCart: async (item) => {
    set({ loading: true, error: null });
    const accessToken = await SecureStore.getItemAsync('auth_token');
    
    try {
      // Set token in headers for this request
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      
      // Create the simplified payload
   
      // Use the correct endpoint
      const response = await axiosInstance.post('/carts/items', item);
      
      // After successful add, fetch the cart again to get updated data
      await get().fetchCartItems();

      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add item to cart',
        loading: false 
      });
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
  
    
    try {
      // Set token in headers for this request
        const accessToken = await SecureStore.getItemAsync('auth_token');
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer  ${accessToken}  `;
      
      await axiosInstance.delete(`/carts/items/${itemId}`);
      
      set(state => {
        const newCartItems = state.cartItems.filter(item => item.id !== itemId);
        
        // Recalculate totals
        const totalItems = newCartItems.reduce((total, item) => 
          total + (item.productType === "SELL" ? item.sellQuantity : 1), 0);
        
        const totalAmount = newCartItems.reduce((total, item) => 
          total + (item.price * (item.productType === "SELL" ? item.sellQuantity : 1)), 0);

        return {
          cartItems: newCartItems,
          totalItems,
          totalAmount,
          loading: false
        };
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove item from cart',
        loading: false 
      });
      throw error;
    }
  },

  // Update item quantity
  updateCartItemQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null });
      const accessToken = await SecureStore.getItemAsync('auth_token');
    
    try {
      // Set token in headers for this request
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      
      // Fix: Access the items array inside cartItems object
      const cartItemsArray = get().cartItems?.items || [];
      const cartItem = cartItemsArray.find(item => item.cartItemId === itemId);
      
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }
      
      // Ensure quantity is always a valid number (minimum 1)
      const validQuantity = Math.max(1, quantity || 1);
      
      let payload = {}

      if (cartItem.productType === "SELL") {
        payload = {
          productId: cartItem.productId,
          productType: cartItem.productType,
          quantity: validQuantity,
        };
      } else {
        payload = {
          productId: cartItem.productId,
          productType: cartItem.productType,
          quantity: validQuantity,
        };
      }
      
      const response = await axiosInstance.put(`/cart-items/${itemId}`, payload);
      
      // After successful update, fetch the cart again to get updated data
      await get().fetchCartItems();
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update cart item',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch cart items
  fetchCartItems: async () => {
    set({ loading: true, error: null });
    const accessToken =   await SecureStore.getItemAsync('auth_token');
    console.log(accessToken,"access token in context");

    try {
      // Set token in headers for this request
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer ${accessToken}`;
      
      const response = await axiosInstance.get('/carts');
      
      // Assuming the API returns cart items with product details
      const cartItemsFetched = response.data;
      console.log(cartItemsFetched, "cart items from context");
      
      set({ 
        cartItems: cartItemsFetched,
        totalItems: cartItemsFetched?.items?.length || 0,
        totalAmount: cartItemsFetched?.totalPrice || 0,
        loading: false 
      });
      
      return cartItemsFetched; // Return the fetched data instead of undefined cartItems
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch cart items',
        loading: false 
      });
      throw error;
    }
  },

  addMutipleProducts: async (items) => {
    set({ loading: true, error: null });
  
    try {
      // Set token in headers for this request
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDc4MTEzMTgsImV4cCI6MTc0Nzg5NzcxOH0.1brNKTMXhz6TdbsbczVPeBwGGtA6LPUtpGU3fP8ggyU`;
      
      const response = await axiosInstance.post('/carts/items/batch', items);
  
      set((state) => ({
        // cartItems: [...state.cartItems, ...response.data], // Assuming response.data is an array
        loading: false
      }));
  
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add item(s) to cart',
        loading: false 
      });
      throw error;
    }
  },
  
  // Clear cart
  clearCart: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // Set token in headers for this request
      axiosInstance.defaults.headers.common['Authorization'] = 
        `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDc4MTEzMTgsImV4cCI6MTc0Nzg5NzcxOH0.1brNKTMXhz6TdbsbczVPeBwGGtA6LPUtpGU3fP8ggyU`;
      
      await axiosInstance.delete(`/carts/items/${id}`);
      
      set({ 
        cartItems: [],
        totalItems: 0,
        totalAmount: 0,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to clear cart',
        loading: false 
      });
      throw error;
    }
  },
  
  // Helper methods for cart drawer
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  getCartTotal: () => get().totalAmount,
  getCartItemCount: () => get().totalItems
}));

export default useCartStore;

// Initialize cart when app loads
useCartStore.getState().fetchCartItems();
