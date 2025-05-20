import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '../../../src/store/productStore';

export default function ProductDetailPage() {
  const { rest } = useLocalSearchParams();
  const router = useRouter();
  const { fetchProductById, currentProduct, isLoading, error } = useProductStore();
  
  useEffect(() => {
    
    if (rest[0] === 'product' && rest[1]) {
      const productId = rest[1];
      fetchProductById(productId);
    }
  }, [rest]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 mb-4">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold">Product Detail Page</Text>
      <Text>Path: {rest.join('/')}</Text>
      
      {currentProduct && (
        <View className="mt-4">
          <Text className="text-lg font-bold">{currentProduct.name}</Text>
          <Text>{currentProduct.description}</Text>
        </View>
      )}
    </View>
  );
}
