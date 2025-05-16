import { create } from 'zustand';

// Create auth store with Zustand
export const useAuthStore = create((set) => ({
  user: null,
  signIn: (userData) => set({ user: userData }),
  signOut: () => set({ user: null }),
  isAuthenticated: () => {
    // We can add more complex authentication logic here if needed
    return useAuthStore.getState().user !== null;
  }
}));