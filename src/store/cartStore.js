import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  // State
  cartItems: [],
  isCartOpen: false,
  
  // Actions
  addToCart: (product, quantity = 1) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.id === product.productId);
    
    if (existingItem) {
      // Update quantity if item already exists
      set({
        cartItems: cartItems.map(item => 
          item.id === product.productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      });
    } else {
      // Add new item
      const price = product.productFor?.sell?.discountPrice || 
                   product.productFor?.sell?.actualPrice ||
                   product.productFor?.rent?.discountPrice ||
                   product.productFor?.rent?.monthlyPrice || 0;
      
      const newItem = {
        id: product.productId,
        name: product.name,
        price: price,
        quantity: quantity,
        image: product.images && product.images.length > 0 ? product.images[0].imageUrl : null
      };
      
      set({ cartItems: [...cartItems, newItem] });
    }
  },
  
  removeFromCart: (productId) => {
    const { cartItems } = get();
    set({ cartItems: cartItems.filter(item => item.id !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    const { cartItems } = get();
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set({ cartItems: cartItems.filter(item => item.id !== productId) });
    } else {
      // Update quantity
      set({
        cartItems: cartItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      });
    }
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
  
  openCart: () => {
    set({ isCartOpen: true });
  },
  
  closeCart: () => {
    set({ isCartOpen: false });
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