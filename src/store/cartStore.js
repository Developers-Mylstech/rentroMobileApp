import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from './authStore';

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalAmount: 0,
  isCartOpen: false,

  // Check if user is logged in using authStore
  isUserLoggedIn: () => {
    return useAuthStore.getState().isAuthenticated;
  },

  // Get cart items from AsyncStorage
  getLocalCartItems: async () => {
    try {
      const localCartItems = await AsyncStorage.getItem('local_cart_items');
      return localCartItems ? JSON.parse(localCartItems) : [];
    } catch (error) {
      console.error('Error getting local cart items:', error);
      return [];
    }
  },

  // Save cart items to AsyncStorage
  saveLocalCartItems: async (items) => {
    try {
      await AsyncStorage.setItem('local_cart_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart items:', error);
    }
  },

  // Helper function to get product price based on type
  getProductPrice: (product, productType) => {
    if (!product || !product.productFor) return 0;
    
    // For quotation products, return 0 or "Quote" as price
    if (product.productFor.isAvailableForRequestQuotation === true) {
      return 0; // We'll handle display separately
    }
    
    // Get price based on product type
    if (productType === 'SELL' && product.productFor.sell) {
      return product.productFor.sell.discountPrice || product.productFor.sell.actualPrice || 0;
    } 
    else if (productType === 'RENT' && product.productFor.rent) {
      return product.productFor.rent.discountPrice || product.productFor.rent.monthlyPrice || 0;
    }
    else if (productType === 'SERVICE' && product.productFor.service) {
      // For service, we'll use OTS price as default
      if (product.productFor.service.ots) {
        return product.productFor.service.ots.price || 0;
      }
    }
    
    return 0;
  },

  // Add to cart - handles both logged in and non-logged in users
  addToCart: async (item) => {
    set({ loading: true, error: null });
    
    try {
      const isLoggedIn = get().isUserLoggedIn();
      console.log("Is user logged in:", isLoggedIn);
      
      if (isLoggedIn) {
        // User is logged in, use API
        console.log("Using API for cart");
        // Create API payload (strip out any extra fields)
        const apiPayload = {
          productId: item.productId,
          productType: item.productType,
          quantity: item.quantity || 1
        };
        
        const response = await axiosInstance.post('/carts/items', apiPayload);
        await get().fetchCartItems();
        return response.data;
      } else {
        // User is not logged in, use AsyncStorage
        console.log("Using AsyncStorage for cart");
        const localCartItems = await get().getLocalCartItems();
        
        // Check if item already exists in cart
        const existingItemIndex = localCartItems.findIndex(
          cartItem => cartItem.productId === item.productId && cartItem.productType === item.productType
        );
        
        // Get product details if not provided
        let productDetails = item;
        if (!item.productName || !item.price) {
          try {
            // Fetch product details if needed
            const response = await axiosInstance.get(`/products/${item.productId}`);
            productDetails = response.data;
            console.log("Fetched product details:", productDetails);
          } catch (error) {
            console.error("Failed to fetch product details:", error);
          }
        }
        
        // Calculate price based on product type
        const price = item.price || get().getProductPrice(productDetails, item.productType);
        const isQuotationProduct = productDetails.productFor?.isAvailableForRequestQuotation === true;
        
        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          localCartItems[existingItemIndex].quantity += item.quantity || 1;
        } else {
          // Add new item with a local cartItemId
          const newItem = {
            ...item,
            cartItemId: Date.now(), // Use timestamp as temporary ID
            price: price,
            productName: productDetails.name || item.productName || 'Product',
            productImages: productDetails.images || item.productImages || [],
            isQuotationProduct: isQuotationProduct,
            productType: item.productType
          };
          localCartItems.push(newItem);
        }
        
        // Save updated cart to AsyncStorage
        await get().saveLocalCartItems(localCartItems);
        
        // Update state
        const totalItems = localCartItems.reduce((total, item) => 
          total + (item.quantity || 1), 0);
        
        // Calculate total amount excluding quotation products
        const totalAmount = localCartItems.reduce((total, item) => {
          if (item.isQuotationProduct) return total;
          return total + ((item.price || 0) * (item.quantity || 1));
        }, 0);
        
        set({
          cartItems: { 
            items: localCartItems,
            totalPrice: totalAmount,
            totalItems: totalItems
          },
          totalItems,
          totalAmount,
          loading: false
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      set({ 
        error: error.response?.data?.message || 'Failed to add item to cart',
        loading: false 
      });
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    set({ loading: true, error: null });
    
    try {
      const isLoggedIn = get().isUserLoggedIn();
      
      if (isLoggedIn) {
        // User is logged in, use API
        await axiosInstance.delete(`/carts/items/${itemId}`);
        await get().fetchCartItems();
      } else {
        // User is not logged in, use AsyncStorage
        const localCartItems = await get().getLocalCartItems();
        const updatedItems = localCartItems.filter(item => item.cartItemId !== itemId);
        
        // Save updated cart to AsyncStorage
        await get().saveLocalCartItems(updatedItems);
        
        // Update state
        const totalItems = updatedItems.reduce((total, item) => 
          total + (item.quantity || 1), 0);
        
        const totalAmount = updatedItems.reduce((total, item) => 
          total + ((item.price || 0) * (item.quantity || 1)), 0);
        
        set({
          cartItems: { 
            items: updatedItems,
            totalPrice: totalAmount,
            totalItems: totalItems
          },
          totalItems,
          totalAmount,
          loading: false
        });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove item from cart',
        loading: false 
      });
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItemQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null });
    
    try {
      const isLoggedIn = get().isUserLoggedIn();
      
      if (isLoggedIn) {
        // User is logged in, use API
        await axiosInstance.put(`/carts/items/${itemId}`, { quantity });
        await get().fetchCartItems();
      } else {
        // User is not logged in, use AsyncStorage
        const localCartItems = await get().getLocalCartItems();
        const itemIndex = localCartItems.findIndex(item => item.cartItemId === itemId);
        
        if (itemIndex === -1) {
          throw new Error('Item not found in cart');
        }
        
        // Ensure quantity is always a valid number (minimum 1)
        const validQuantity = Math.max(1, quantity || 1);
        localCartItems[itemIndex].quantity = validQuantity;
        
        // Save updated cart to AsyncStorage
        await get().saveLocalCartItems(localCartItems);
        
        // Update state
        const totalItems = localCartItems.reduce((total, item) => 
          total + (item.quantity || 1), 0);
        
        const totalAmount = localCartItems.reduce((total, item) => 
          total + ((item.price || 0) * (item.quantity || 1)), 0);
        
        set({
          cartItems: { items: localCartItems },
          totalItems,
          totalAmount,
          loading: false
        });
        
        return { success: true };
      }
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
    
    try {
      // Use authStore to check if user is authenticated
      const isLoggedIn = get().isUserLoggedIn();
      console.log("Fetch cart - is user logged in:", isLoggedIn);
      
      if (isLoggedIn) {
        // User is logged in, use API
        console.log("Fetching cart from API");
        try {
          const response = await axiosInstance.get('/carts');
          console.log("Cart API response status:", response.status);
          const cartItemsFetched = response.data;
          
          set({ 
            cartItems: cartItemsFetched,
            totalItems: cartItemsFetched?.items?.length || 0,
            totalAmount: cartItemsFetched?.totalPrice || 0,
            loading: false 
          });
          
          return cartItemsFetched;
        } catch (apiError) {
          console.error("API cart fetch error:", apiError);
          // If API call fails, fall back to local storage
          throw apiError;
        }
      } else {
        // User is not logged in, use AsyncStorage
        console.log("User not logged in - fetching cart from AsyncStorage");
        const localCartItems = await get().getLocalCartItems();
        
        // Calculate totals
        const totalItems = localCartItems.reduce((total, item) => 
          total + (item.quantity || 1), 0);
        
        // Calculate total amount excluding quotation products
        const totalAmount = localCartItems.reduce((total, item) => {
          if (item.isQuotationProduct) return total;
          return total + ((item.price || 0) * (item.quantity || 1));
        }, 0);
        
        // Format to match API response structure
        const formattedCart = {
          items: localCartItems,
          totalPrice: totalAmount,
          totalItems: totalItems
        };
        
        set({ 
          cartItems: formattedCart,
          totalItems,
          totalAmount,
          loading: false 
        });
        
        return formattedCart;
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      
      // Always fall back to local storage on any error
      const localCartItems = await get().getLocalCartItems();
      const totalItems = localCartItems.reduce((total, item) => 
        total + (item.quantity || 1), 0);
      const totalAmount = localCartItems.reduce((total, item) => 
        total + ((item.price || 0) * (item.quantity || 1)), 0);
      
      const formattedCart = {
        items: localCartItems,
        totalPrice: totalAmount,
        totalItems: totalItems
      };
      
      set({ 
        cartItems: formattedCart,
        totalItems,
        totalAmount,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch cart items'
      });
      
      return formattedCart;
    }
  },

  // Clear cart
  clearCart: async () => {
    set({ loading: true, error: null });
    
    try {
      const isLoggedIn = get().isUserLoggedIn();
      
      if (isLoggedIn) {
        // User is logged in, use API
        // Clear cart via API
        await axiosInstance.delete('/carts/items');
      }
      
      // Always clear local storage as well
      await AsyncStorage.removeItem('local_cart_items');
      
      set({ 
        cartItems: { items: [] },
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
  
  // Migrate local cart to server when user logs in
  migrateLocalCartToServer: async () => {
    try {
      const localCartItems = await get().getLocalCartItems();
      
      if (localCartItems.length === 0) {
        console.log("No local cart items to migrate");
        return; // No items to migrate
      }
      
      // Check if user is logged in using authStore
      const isLoggedIn = get().isUserLoggedIn();
      
      if (!isLoggedIn) {
        console.log("User not logged in, can't migrate cart");
        return; // User is not logged in, can't migrate
      }
      
      set({ loading: true });
      
      // Create batch payload for API
      const batchPayload = localCartItems.map(item => ({
        productId: item.productId,
        productType: item.productType,
        quantity: item.quantity || 1
      }));
      
      console.log('Migrating cart items to server:', batchPayload);
      
      // Use batch endpoint to add all items at once
      try {
        await axiosInstance.post('/carts/items/batch', batchPayload);
        console.log('Successfully migrated cart to server');
      } catch (error) {
        console.error('Error migrating cart to server:', error);
        // If batch fails, try individual items as fallback
        for (const item of localCartItems) {
          const payload = {
            productId: item.productId,
            productType: item.productType,
            quantity: item.quantity || 1
          };
          
          try {
            await axiosInstance.post('/carts/items', payload);
          } catch (itemError) {
            console.error('Error migrating individual item to server:', itemError);
          }
        }
      }
      
      // Clear local cart after migration
      await AsyncStorage.removeItem('local_cart_items');
      
      // Fetch the updated cart from server
      await get().fetchCartItems();
      
      set({ loading: false });
    } catch (error) {
      console.error('Error migrating local cart to server:', error);
      set({ loading: false });
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
