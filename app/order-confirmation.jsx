import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function OrderConfirmation() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-3 border-b border-gray-200">
        <Text className="font-bold text-lg">Order Confirmation</Text>
      </View>
      
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-green-100 p-4 rounded-full mb-6">
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        </View>
        
        <Text className="text-2xl font-bold text-center mb-2">Order Placed Successfully!</Text>
        <Text className="text-gray-500 text-center mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </Text>
        
        <View className="bg-gray-100 w-full rounded-lg p-4 mb-6">
          <Text className="font-semibold mb-2">Order #12345</Text>
          <Text className="text-gray-500 mb-1">Date: {new Date().toLocaleDateString()}</Text>
          <Text className="text-gray-500">Items: 3</Text>
          <Text className="text-gray-500">Total: 1,299.00 AED</Text>
        </View>
        
        <TouchableOpacity 
          className="bg-blue-500 rounded-lg py-3 px-6 mb-4 w-full items-center"
          onPress={() => router.push('/(tabs)/shop')}
        >
          <Text className="text-white font-semibold">CONTINUE SHOPPING</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="border border-blue-500 rounded-lg py-3 px-6 w-full items-center"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-blue-500 font-semibold">VIEW MY ORDERS</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center px-4 py-3 border-t border-gray-200">
        <TouchableOpacity className="p-2" onPress={() => router.push('/(tabs)')}>
          <Ionicons name="home-outline" size={24} color="gray" />
        </TouchableOpacity>
        
        <TouchableOpacity className="p-2" onPress={() => router.push('/(tabs)/shop')}>
          <Ionicons name="grid-outline" size={24} color="gray" />
        </TouchableOpacity>
        
        <TouchableOpacity className="p-2" onPress={() => router.push('/(tabs)/(profile)')}>
          <Ionicons name="person-outline" size={24} color="gray" />
        </TouchableOpacity>
        
        <TouchableOpacity className="p-2" onPress={() => router.push('/(tabs)/shop')}>
          <Ionicons name="cart-outline" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}