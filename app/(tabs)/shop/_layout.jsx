import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import useCheckoutStore from '../../../src/store/checkoutStore';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ShopLayout() {
  const { clearCheckoutData } = useCheckoutStore();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Handle back button press to ensure proper navigation
  useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        const state = navigation.getState();
        // If we're not on the main shop screen and back button is pressed
        if (state.routes[state.index].name !== 'index') {
          // Navigate to the main shop screen
          navigation.navigate('(tabs)', { screen: 'shop/index' });
          return true; // Prevent default behavior
        }
        return false; // Let the default behavior happen
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }
  }, [isFocused, navigation]);

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
          // Add custom back button behavior
          // headerLeft: () => (
          //   <TouchableOpacity 
          //     onPress={() => navigation.navigate('(tabs)', { screen: 'shop/index' })}
          //     style={{ marginLeft: 10 }}
          //   >
          //     <Ionicons name="arrow-back" size={24} color="#007AFF" />
          //   </TouchableOpacity>
          // ),
        }} 
      />
      <Stack.Screen 
        name="sell-products" 
        options={{ 
          title: "Sell Products",
          // Add custom back button behavior
          // headerLeft: () => (
          //   <TouchableOpacity 
          //     onPress={() => navigation.navigate('(tabs)', { screen: 'shop/index' })}
          //     style={{ marginLeft: 10 }}
          //   >
          //     <Ionicons name="arrow-back" size={24} color="#007AFF" />
          //   </TouchableOpacity>
          // ),
        }} 
      />
      <Stack.Screen 
        name="quotation-products" 
        options={{ 
          title: "Request Quotation",
          // Add custom back button behavior
          // headerLeft: () => (
          //   <TouchableOpacity 
          //     onPress={() => navigation.navigate('(tabs)', { screen: 'shop/index' })}
          //     style={{ marginLeft: 10 }}
          //   >
          //     <Ionicons name="arrow-back" size={24} color="#007AFF" />
          //   </TouchableOpacity>
          // ),
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
