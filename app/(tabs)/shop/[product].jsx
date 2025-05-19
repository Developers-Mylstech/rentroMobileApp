import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Dimensions, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Remove the useNavigation import since we're handling tab visibility in _layout.jsx

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Remove the useEffect that was trying to hide the tab bar
  // We're now handling this in the _layout.jsx file
  
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
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View className={`flex-1 flex-row items-center rounded-lg border border-gray-200 px-3 py-1 mx-3`}>
          <TextInput className="text-gray-400 flex-1" placeholder='Search...'></TextInput>
          <Ionicons name="search" size={20} color="#007AFF" />
        </View>
        
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 mb-16">
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
        <View className="p-4 ">
          <Text className="font-bold text-xl text-gray-800">{product.name}</Text>
           

         <View className="flex-row items-center mt-1 gap-2">
           <Text className="text-gray-500 text-sm pr-2 border-r border-gray-200">{product.category}</Text>
           <View className="flex-row flex-wrap gap-1">
            <Text className="text-white text-sm font-bold p-[1.5px] bg-blue-500 rounded-md ">#{product?.tags ||'Purifier' }</Text>
           </View>
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
            <Text className="font-bold text-lg text-gray-800my-2">Description</Text>
            <Text className="text-gray-600 mt-1">{product.description}</Text>
          </View>
          
          {/* Features */}
          {product.features.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg text-gray-800 my-2">Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mt-1">
                  <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  <Text className="text-gray-600">{feature}</Text>
                </View>
              ))}
            </View>
          )}

           {product.features.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg text-gray-800 my-2">Benefits</Text>
              {product.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mt-1  p-2 rounded-lg my-1 border border-blue-400">
                  <Ionicons name="checkmark" size={14} color="blue"  className="mr-2 h-6 w-6 rounded-full bg-blue-200 p-1" />
                  <Text className="text-blue-600 text-sm font-semibold">{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {product.features.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg text-gray-800 my-2">Specifications</Text>
              {product.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mt-1  border-b border-gray-200 py-2">
                  {/* <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" /> */}
                  <Text className="text-gray-600">Title: {feature}</Text>
                </View>
              ))}
            </View>
          )}



          
          {/* Action Buttons */}
         
        </View>
              </View>
      </ScrollView>
      
      {/* Sticky bottom action buttons */}
      <View className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <TouchableOpacity 
          className="flex-1 bg-white border border-blue-500 rounded-md mr-2 items-center justify-center py-3"
          onPress={() => console.log('Add to cart')}
        >
          <Text className="text-blue-500 font-bold">Add To Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 bg-blue-500 rounded-md ml-2 items-center justify-center py-3"
          onPress={() => console.log('Buy now')}
        >
          <Text className="text-white font-bold">Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
