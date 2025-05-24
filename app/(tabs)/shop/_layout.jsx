import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import useCheckoutStore from '../../../src/store/checkoutStore';
import { useFocusEffect } from '@react-navigation/native';

export default function ShopLayout() {
  const { clearCheckoutData } = useCheckoutStore();

  // Clear checkout data when returning to the main shop screen
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = () => {
        // This runs when the screen is unfocused
        clearCheckoutData();
      };

      return unsubscribe;
    }, [])
  );

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back", // For iOS
        headerBackTitleVisible: true, // Show back title on iOS
        headerBackVisible: true, // Ensure back button is visible
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Shop Products",
        }} 
      />
      <Stack.Screen 
        name="[product]" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: "Back",
          title: "Product Details",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="rent-products" 
        options={{ 
          title: "Rent Products",
        }} 
      />
      <Stack.Screen 
        name="sell-products" 
        options={{ 
          title: "Sell Products",
        }} 
      />

      <Stack.Screen 
        name="checkout" 
        options={{ 
          title: "Checkout",
        }} 
      />
      <Stack.Screen 
        name="order-confirmation" 
        options={{ 
          title: "Order Confirmation",
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
