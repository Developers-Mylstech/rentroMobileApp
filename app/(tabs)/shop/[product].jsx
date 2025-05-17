import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductDetails() {
  const { product: productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  // In a real app, you would fetch product details from an API
  // For now, we'll simulate this with a mock data fetch
  useEffect(() => {
    // Simulate API call to get product details
    const fetchProductDetails = () => {
      // Mock product data based on ID
      const productData = {
        id: productId,
        name: 'HUL Pureit Eco Water Saver Purifier',
        category: 'Best No. 1 Water Purifier',
        price: '500.00 AED/Month',
        originalPrice: '600.00 AED',
        image: 'https://5.imimg.com/data5/SELLER/Default/2022/9/QL/OM/DP/7621731/pureit-eco-water-saver-mineral-ro-uv-mf-6-stage-table-top-wall-mountable-black-8l-water-purifier.jpg',
        rating: 4.5,
        reviews: 245,
        description: 'Advanced water purifier with eco-friendly technology to save water while providing clean drinking water.',
        features: ['RO Purification', 'UV Sterilization', 'Water Saving Technology', '8L Capacity'],
        tag: 'NEW'
      };
      
      setProduct(productData);
    };

    fetchProductDetails();
  }, [productId]);

  // Show loading state while product data is being fetched
  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button, search and cart */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
       
        
        <View className="flex-1 mx-3 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <TextInput placeholder='Search...' className="text-gray-400 flex-1"></TextInput>
          <Ionicons name="search" size={20} color="gray" />
        </View>
        
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Product Image Section */}
        <View className="relative bg-white p-4 items-center">
          <Image 
            source={{ uri: product.image }} 
            className="w-full h-80"
            resizeMode="contain"
          />
          
          {/* Wishlist Heart Button */}
          <TouchableOpacity className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
            <Ionicons name="heart-outline" size={24} color="#999" />
          </TouchableOpacity>
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center mt-2">
            <View className="h-2 w-2 rounded-full bg-blue-500 mx-1" />
            <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
            <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
            <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row justify-center py-3 border-b border-t border-gray-200">
          <TouchableOpacity className="items-center px-6">
            <Text className="text-blue-500 font-medium">Rent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center px-6">
            <Text className="text-gray-400 font-medium">Sell</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center px-6">
            <Text className="text-gray-400 font-medium">Service</Text>
          </TouchableOpacity>
        </View>
        
        {/* Product Info */}
        <View className="p-4">
          <Text className="font-bold text-xl text-gray-800">{product.name}</Text>
          <Text className="text-gray-500 text-sm">{product.category}</Text>
          
          {/* Ratings */}
          <View className="flex-row items-center mt-1">
            <View className="flex-row bg-blue-500 rounded px-2 py-0.5 mr-2">
              <Text className="text-white text-xs font-bold">{product.rating} ★</Text>
            </View>
            <Text className="text-gray-500 text-xs">{product.reviews} reviews</Text>
          </View>
          
          {/* Price */}
          <View className="mt-3">
            <Text className="font-bold text-xl text-gray-800">{product.price}</Text>
            <Text className="text-gray-400 text-sm line-through">{product.originalPrice}</Text>
          </View>
          
          {/* Action Buttons */}
          <View className="flex-row mt-4 space-x-3">
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-md items-center">
              <Text className="text-white font-bold">Buy Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-white border border-blue-500 py-3 rounded-md items-center">
              <Text className="text-blue-500 font-bold">Add To Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
