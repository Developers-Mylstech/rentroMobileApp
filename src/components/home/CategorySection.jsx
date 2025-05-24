import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function CategorySection() {
  const router = useRouter();
  
  const handleNavigation = (path) => {
    // Use push instead of replace to create a new navigation entry
    router.push(path);
  };

  return (
    <View className="my-5">
      <Text className="font-bold text-heading-4 uppercase mb-3">Product By Category</Text>

      <View className="flex-row flex-wrap justify-between">
        {/* All Products */}
        <TouchableOpacity 
          className="bg-blue-50 rounded-lg p-4 mb-4 w-[48%]"
          onPress={() => router.push('/(tabs)/shop')}
        >
          <Ionicons name="grid-outline" size={24} color="#3b82f6" />
          <Text className="font-semibold text-gray-800 mt-2">All Products</Text>
          <Text className="text-gray-500 text-xs mt-1">Browse all products</Text>
        </TouchableOpacity>
        
        {/* Sell Products */}
        <TouchableOpacity 
          className="bg-green-50 rounded-lg p-4 mb-4 w-[48%]"
          onPress={() => router.push('/(tabs)/shop/sell-products')}
        >
          <Ionicons name="cart-outline" size={24} color="#22c55e" />
          <Text className="font-semibold text-gray-800 mt-2">Buy Products</Text>
          <Text className="text-gray-500 text-xs mt-1">Products available for purchase</Text>
        </TouchableOpacity>
        
        {/* Rent Products */}
        <TouchableOpacity 
          className="bg-purple-50 rounded-lg p-4 mb-4 w-[48%]"
          onPress={() => router.push('/(tabs)/shop/rent-products')}
        >
          <Ionicons name="calendar-outline" size={24} color="#8b5cf6" />
          <Text className="font-semibold text-gray-800 mt-2">Rent Products</Text>
          <Text className="text-gray-500 text-xs mt-1">Products available for rent</Text>
        </TouchableOpacity>
        
        {/* Quotation Products */}
        <TouchableOpacity 
          className="bg-yellow-50 rounded-lg p-4 mb-4 w-[48%]"
          onPress={() => router.push('/(tabs)/shop/quotation-products')}
        >
          <Ionicons name="document-text-outline" size={24} color="#eab308" />
          <Text className="font-semibold text-gray-800 mt-2">Request Quote</Text>
          <Text className="text-gray-500 text-xs mt-1">Products requiring quotation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
