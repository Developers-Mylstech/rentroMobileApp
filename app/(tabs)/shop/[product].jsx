import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Dimensions, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  console.log("Received params:", params);
  
  // Parse the arrays from strings
  const images = params.images ? JSON.parse(params.images) : [];
  const features = params.features ? JSON.parse(params.features) : [];

  const [activeTab, setActiveTab] = useState('rent');
  
  // Create a product object from the params
  const product = {
    id: params.product,
    name: params.name || 'Product Name',
    category: params.category || 'Category',
    price: params.price || '0.00 AED',
    originalPrice: params.originalPrice || '0.00 AED',
    images: images.length > 0 ? images : ['https://via.placeholder.com/400'],
    rating: parseFloat(params.rating) || 0,
    reviews: parseInt(params.reviews) || 0,
    description: params.description || 'No description available',
    features: features,
    tag: params.tag || ''
  };

  // Handle image scroll
  const handleImageScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveImageIndex(index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button, search and cart */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
       
        
        <View className="flex-1 mx-3 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <TextInput className="text-gray-400 flex-1" placeholder='Search...'></TextInput>
          <Ionicons name="search" size={20} color="gray" />
        </View>
        
       
      </View>

      <ScrollView className="flex-1">
        {/* Product Image Carousel */}
        <View className="relative bg-white">
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={width}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width, height: 300 }} className="items-center justify-center p-4">
                <Image 
                  source={{ uri: item }} 
                  style={{ width: width - 80, height: 250 }}
                  resizeMode="contain"
                />
              </View>
            )}
          />
          
          {/* Wishlist Heart Button */}
          <TouchableOpacity className="absolute top-4 right-4 bg-white rounded-full p-2 shadow z-10">
            <Ionicons name="heart-outline" size={24} color="#999" />
          </TouchableOpacity>
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center my-2">
            {product.images.map((_, index) => (
              <View 
                key={index} 
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            ))}
          </View>
        </View>
        
        {/* Action Buttons */}
              <View className="bg-blue-50 rounded-t-[50px]">
                        <View className=" flex-row justify-center py-3 border-b border-gray-200  w-[100%]">
          <TouchableOpacity onPress={() => setActiveTab('rent')} className="items-center ">
            <Text className={` ${activeTab === 'rent' ? 'text-blue-500  border-b-2 border-blue-500' : 'text-gray-400  border-b-2 border-gray-400'}  font-medium px-10 py-3`}>Rent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setActiveTab('sell')} className="items-center ">
            <Text className={` ${activeTab === 'sell' ? 'text-blue-500  border-b-2 border-blue-500' : 'text-gray-400  border-b-2 border-gray-400'}  font-medium px-10 py-3`}>Sell</Text>
          </TouchableOpacity>
          
          <TouchableOpacity   onPress={() => setActiveTab('service')} className="items-center">
            <Text className={` ${activeTab === 'service' ? 'text-blue-500  border-b-2 border-blue-500' : 'text-gray-400  border-b-2 border-gray-400'}  font-medium px-10 py-3`}>Service</Text>
          </TouchableOpacity>
        </View>
        
        {/* Product Info */}
        <View className="p-4">
          <Text className="font-bold text-xl text-gray-800">{product.name}</Text>
          <Text className="text-gray-500 text-sm">{product.category}</Text>
           

           <View className="flex-row flex-wrap gap-1">
            <Text className="text-white text-sm font-bold p-[1.5px] bg-blue-500 rounded-md ">#{product?.tags ||'Purifier' }</Text>
           </View>
          
          {/* Ratings */}
          <View className="flex-row items-center mt-1">
            <View className="flex-row bg-green-500 rounded px-2 py-0.5 mr-2">
              <Text className="text-white text-xs font-bold">{product.rating} ★</Text>
            </View>
            <Text className="text-gray-500 text-xs">{product.reviews} reviews</Text>
          </View>
          
          {/* Price */}
          <View className="mt-3">
            <Text className="font-bold text-xl text-gray-800">{ activeTab === 'rent' ? product.price+'/ month' : product.price }</Text>
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
          <View className="flex-row mt-6 space-x-6 gap-4">
            <TouchableOpacity className="flex-1 bg-blue-500 py-3 rounded-md items-center">
              <Text className="text-white font-bold">Buy Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-white border border-blue-500 py-3 rounded-md items-center">
              <Text className="text-blue-500 font-bold">Add To Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
              </View>
      </ScrollView>
    </SafeAreaView>
  );
}
