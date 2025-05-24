import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useCheckoutStore from '../../../src/store/checkoutStore';

export default function OrderConfirmation() {
  const router = useRouter();
  const { clearCheckoutData } = useCheckoutStore();

  useEffect(() => {
    // Clear checkout data when this screen loads
    clearCheckoutData();
    
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/(tabs)');
    }, 10000);
    
    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, []);

  const handleContinueShopping = () => {
    // Clear checkout data and navigate
    clearCheckoutData();
    router.push('/(tabs)/shop');
  };

  const handleViewOrders = () => {
    // Clear checkout data and navigate
    clearCheckoutData();
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-green-100 p-4 rounded-full mb-6">
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        </View>
        
        <Text className="text-2xl font-bold text-center mb-2">Order Placed Successfully!</Text>
        <Text className="text-gray-500 text-center mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </Text>
        
        <TouchableOpacity 
          className="bg-blue-500 rounded-lg py-3 px-6 mb-4 w-full items-center"
          onPress={handleContinueShopping}
        >
          <Text className="text-white font-semibold">CONTINUE SHOPPING</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="border border-blue-500 rounded-lg py-3 px-6 w-full items-center"
          onPress={handleViewOrders}
        >
          <Text className="text-blue-500 font-semibold">VIEW MY ORDERS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

