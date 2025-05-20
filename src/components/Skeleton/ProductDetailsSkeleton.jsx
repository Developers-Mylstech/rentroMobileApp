import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductDetailsSkeleton() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Image Carousel Skeleton */}
      <View className="relative bg-white">
        <View style={{ width, height: 300 }} className="items-center justify-center p-4">
          <View style={{ width: width - 80, height: 250 }} className="bg-gray-200 animate-pulse rounded-lg" />
        </View>
        
        {/* Image Indicators */}
        <View className="flex-row justify-center mb-4">
          {[1, 2, 3].map((_, index) => (
            <View 
              key={index} 
              className="h-2 w-2 rounded-full mx-1 bg-gray-300 animate-pulse" 
            />
          ))}
        </View>
      </View>
      
      {/* Action Buttons Skeleton */}
      <View className="bg-blue-50 rounded-t-[50px]">
        <View className="flex-row justify-center py-3 border-b border-gray-200 w-[100%]">
          {['Rent', 'Sell', 'Service'].map((tab, index) => (
            <View key={index} className="items-center">
              <View className="bg-gray-300 h-5 w-20 rounded-md animate-pulse mx-10 my-3" />
            </View>
          ))}
        </View>
        
        {/* Product Info Skeleton */}
        <View className="p-4">
          {/* Product Name */}
          <View className="bg-gray-200 h-7 w-3/4 rounded-md animate-pulse mb-2" />
          
          {/* Category and Tags */}
          <View className="flex-row items-start mt-1 gap-2">
            <View className="bg-gray-200 h-4 w-1/4 rounded-md animate-pulse" />
            <View className="flex-row flex-wrap gap-1">
              {[1, 2, 3].map((_, index) => (
                <View key={index} className="bg-gray-200 h-4 w-12 rounded-md animate-pulse" />
              ))}
            </View>
          </View>
          
          {/* Brand */}
          <View className="flex-row items-center mt-1">
            <View className="bg-gray-200 h-4 w-1/5 rounded-md animate-pulse" />
          </View>
          
          {/* Price Section */}
          <View className="mt-4 mb-2">
            <View className="flex-row items-center">
              <View className="bg-gray-200 h-6 w-1/4 rounded-md animate-pulse" />
              <View className="bg-gray-200 h-4 w-1/5 rounded-md animate-pulse ml-2" />
            </View>
          </View>
          
          {/* Benefits Section */}
          <View className="mt-4">
            <View className="bg-gray-200 h-6 w-1/3 rounded-md animate-pulse mb-2" />
            {[1, 2, 3].map((_, index) => (
              <View key={index} className="flex-row items-center mt-1">
                <View className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mr-2" />
                <View className="bg-gray-200 h-4 w-3/4 rounded-md animate-pulse" />
              </View>
            ))}
          </View>
          
          {/* Description Section */}
          <View className="mt-4">
            <View className="bg-gray-200 h-6 w-1/3 rounded-md animate-pulse mb-2" />
            <View className="bg-gray-200 h-4 w-full rounded-md animate-pulse mb-1" />
            <View className="bg-gray-200 h-4 w-full rounded-md animate-pulse mb-1" />
            <View className="bg-gray-200 h-4 w-3/4 rounded-md animate-pulse" />
          </View>
          
          {/* Specifications Section */}
          <View className="mt-4">
            <View className="bg-gray-200 h-6 w-1/3 rounded-md animate-pulse mb-2" />
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
                <View className="bg-gray-200 h-4 w-1/3 rounded-md animate-pulse" />
                <View className="bg-gray-200 h-4 w-1/3 rounded-md animate-pulse" />
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Bottom Action Bar Skeleton */}
      <View className="h-16 bg-white border-t border-gray-200 flex-row items-center justify-between px-4 absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center">
          <View className="bg-gray-200 h-10 w-24 rounded-md animate-pulse mr-2" />
          <View className="bg-gray-200 h-10 w-24 rounded-md animate-pulse" />
        </View>
        <View className="bg-gray-200 h-10 w-32 rounded-md animate-pulse" />
      </View>
    </ScrollView>
  );
}