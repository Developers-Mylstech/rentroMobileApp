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
  // useEffect(() => {
  //   if (isFocused) {
  //     const backAction = () => {
  //       const state = navigation.getState();
  //       if (state.routes[state.index].name !== 'index') {
  //         navigation.navigate('(tabs)', { screen: 'shop/index' });
  //         return true; // Prevent default behavior
  //       }
  //       return false; // Let the default behavior happen
  //     };

  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       backAction
  //     );

  //     return () => backHandler.remove();
  //   }
  // }, [isFocused, navigation]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const unsubscribe = () => {
  //       clearCheckoutData();
  //     };

  //     return unsubscribe;
  //   }, [])
  // );

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back", 
        headerBackTitleVisible: true, 
        headerBackVisible: true, 
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
