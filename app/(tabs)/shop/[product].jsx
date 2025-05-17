import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  console.log("Received params:", params);
  
  // Parse the features array from the string
  const features = params.features ? JSON.parse(params.features) : [];
  
  // Create a product object from the params
  const product = {
    id: params.product,
    name: params.name || 'Product Name',
    category: params.category || 'Category',
    price: params.price || '0.00 AED',
    originalPrice: params.originalPrice || '0.00 AED',
    image: params.image || 'https://via.placeholder.com/400',
    rating: parseFloat(params.rating) || 0,
    reviews: parseInt(params.reviews) || 0,
    description: params.description || 'No description available',
    features: features,
    tag: params.tag || ''
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button, search and cart */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View className="flex-1 mx-3 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-gray-400 flex-1">Search...</Text>
          <Ionicons name="search" size={20} color="gray" />
        </View>
        
        <TouchableOpacity onPress={() => router.push('/cart')}>
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
          
          {/* Description */}
          <View className="mt-4">
            <Text className="font-bold text-lg text-gray-800">Description</Text>
            <Text className="text-gray-600 mt-1">{product.description}</Text>
          </View>
          
          {/* Features */}
          {product.features.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg text-gray-800">Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mt-1">
                  <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  <Text className="text-gray-600">{feature}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Action Buttons */}
          <View className="flex-row mt-6 space-x-3">
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
