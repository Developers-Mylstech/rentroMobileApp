import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from 'expo-linear-gradient';

export default function Shop() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Kent Supreme Extra',
      price: '500.00 AED',
      originalPrice: '600.00 AED',
      image: 'https://www.kent.co.in/images/png/Grand-New-11076.png',
      tag: 'NEW'
    },
    {
      id: 2,
      name: 'Kent Supreme Extra',
      price: '500.00 AED',
      originalPrice: '600.00 AED',
      image: 'https://www.kent.co.in/images/png/KENT-Grand-Star-400x400px.png',
      tag: 'NEW'
    },
    {
      id: 3,
      name: 'Kent Supreme Extra',
      price: '500.00 AED',
      originalPrice: '600.00 AED',
      image: 'https://www.kent.co.in/images/png/grand-star-black-400x400px.png',
      tag: 'NEW'
    },
    {
      id: 4,
      name: 'Kent Supreme Extra',
      price: '500.00 AED',
      originalPrice: '600.00 AED',
      image: 'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
      tag: 'NEW'
    }
  ];

  const renderProductItem = ({ item }) => (
    <View className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <Image 
        source={{ uri: item.image }} 
        className="w-24 h-24"
        resizeMode="contain"
      />
      
      <View className="flex-1 p-3 justify-center">
        <Text className="font-semibold text-base">{item.name}</Text>
        <View className="flex-row items-center mt-1">
          <Text className="font-bold text-base">{item.price}</Text>
          <Text className="text-gray-400 text-xs ml-2 line-through">{item.originalPrice}</Text>
        </View>
      </View>
      
      <View className="justify-center items-center pr-3">
        <View className="bg-green-500 px-2 py-1 rounded mb-2">
          <Text className="text-white text-xs font-bold">{item.tag}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button, search and cart */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-1 mx-3 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <TextInput className="text-gray-400 flex-1" placeholder='Search for products...'></TextInput>
          <Ionicons name="search" size={20} color="gray" />
        </View>
        
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View className="bg-blue-500 mx-4 my-3 rounded-lg p-4">
        <Text className="text-white font-bold text-lg text-center">Pure Water, Pure Trust - Discover the Perfect Purifier for Every Home.</Text>
        <Image
          source={{ uri: 'https://www.kent.co.in/images/v3/ro-water-purifiers-updated.png' }}
          className="w-full h-28 mt-3"
          resizeMode="contain"
        />
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListFooterComponent={<View style={{ height: 20 }} />} // Add some bottom padding
      />
    </SafeAreaView>
  );
}