import { create } from 'zustand';
import { Platform } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from './authStore';

// Storage key for cart items
const CART_STORAGE_KEY = 'rentro_cart_items';

// Simple in-memory storage as fallback
const memoryStorage = {
  _data: {},
  getItem(key) {
    return this._data[key] || null;
  },
  setItem(key, value) {
    this._data[key] = value;
  },
  removeItem(key) {
    delete this._data[key];
  }
};

export const useCartStore = create((set, get) => ({
  // State
  cartItems: [],
  isCartOpen: false,
  isLoading: false,
  
  // Initialize cart from storage
  initCart: () => {
    try {
      const storedCart = memoryStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        set({ cartItems: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  },
  
  // Save cart to storage
  saveCartToStorage: (cartItems) => {
    try {
      memoryStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  },
  
  // Actions
  addToCart: (product, quantity = 1) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.id === product.productId);
    
    let updatedCart;
    
    if (existingItem) {
      // Update quantity if item already exists
      updatedCart = cartItems.map(item => 
        item.id === product.productId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      // Add new item
      const price = product.productFor?.sell?.discountPrice || 
                   product.productFor?.sell?.actualPrice ||
                   product.productFor?.rent?.discountPrice ||
                   product.productFor?.rent?.monthlyPrice || 0;
      
      // Determine product type (SELL or RENT)
      const productType = product.productFor?.sell ? 'SELL' : 
                         product.productFor?.rent ? 'RENT' : 'SELL';
      
      const newItem = {
        id: product.productId,
        name: product.name,
        price: price,
        quantity: quantity,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : null,
        productType: productType
      };
      
      updatedCart = [...cartItems, newItem];
    }
    
    // Update state
    set({ cartItems: updatedCart });
    
    // Save to storage
    get().saveCartToStorage(updatedCart);
  },
  
  removeFromCart: (productId) => {
    const { cartItems } = get();
    const updatedCart = cartItems.filter(item => item.id !== productId);
    
    // Update state
    set({ cartItems: updatedCart });
    
    // Save to storage
    get().saveCartToStorage(updatedCart);
  },
  
  updateQuantity: (productId, quantity) => {
    const { cartItems } = get();
    let updatedCart;
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      updatedCart = cartItems.filter(item => item.id !== productId);
    } else {
      // Update quantity
      updatedCart = cartItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
    }
    
    // Update state
    set({ cartItems: updatedCart });
    
    // Save to storage
    get().saveCartToStorage(updatedCart);
  },
  
  clearCart: () => {
    // Update state
    set({ cartItems: [] });
    
    // Clear from storage
    memoryStorage.removeItem(CART_STORAGE_KEY);
  },
  
  openCart: () => {
    set({ isCartOpen: true });
  },
  
  closeCart: () => {
    set({ isCartOpen: false });
  },
  
  // Sync cart with server after login
  syncCartWithServer: async () => {
    const { cartItems } = get();
    const isAuthenticated = useAuthStore.getState().isAuthenticated();
    
    // Only proceed if user is authenticated and there are items in cart
    if (!isAuthenticated || cartItems.length === 0) {
      return;
    }
    
    try {
      set({ isLoading: true });
      
      // Format cart items for API
      const cartItemsForApi = cartItems.map(item => ({
        productId: item.id,
        productType: item.productType,
        quantity: item.quantity
      }));
      
      // Send batch upload request
      await axiosInstance.post('/cart/batch-upload', cartItemsForApi);
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
      set({ isLoading: false });
    }
  },
  
  // Helper methods
  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartItemCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}));

// Initialize cart when app loads
useCartStore.getState().initCart();

// Listen for auth state changes to sync cart
useAuthStore.subscribe(
  (state) => state.user,
  (user) => {
    if (user) {
      // User just logged in, sync cart with server
      useCartStore.getState().syncCartWithServer();
    }
  }
);
