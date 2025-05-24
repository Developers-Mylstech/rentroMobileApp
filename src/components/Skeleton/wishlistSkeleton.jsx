import { View, Text } from 'react-native'
import React from 'react'

export default function WishlistSkeleton() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View 
          key={index}
          className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm"
        >
          <View className="flex-row items-center">
            {/* Image skeleton */}
            <View className="w-28 h-28 p-2 justify-center items-center">
              <View className="w-20 h-20 bg-gray-200 animate-pulse" />
            </View>
            
            <View className="flex-1 p-4 justify-between">
              {/* Product name skeleton */}
              <View className="flex-row justify-between items-start">
                <View className="bg-gray-200 h-5 w-3/5 rounded-md animate-pulse" />
                <View className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              </View>
              
              {/* Description skeleton */}
              <View className="bg-gray-200 h-4 w-full rounded-md my-2 animate-pulse" />
              
              {/* Price skeleton */}
              <View className="flex-row items-baseline mt-1">
                <View className="bg-gray-200 h-5 w-1/5 rounded-md animate-pulse" />
                <View className="bg-gray-200 h-4 w-1/6 rounded-md ml-2 animate-pulse" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
