import { View, Text } from 'react-native'
import React from 'react'

export default function OurServiceSkeleton({ count = 5 }) {
  const skeletonItems = Array(count).fill({});

  return (
    <View className="py-4">
      <View className="bg-gray-200 h-6 w-40 mb-3 rounded-md animate-pulse" />
      
      {skeletonItems.map((_, index) => (
        <View 
          key={index}
          className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden"
        >
          <View className="bg-gray-200 w-24 h-24 animate-pulse" />
          
          <View className="flex-1 p-3 justify-center">
            <View className="bg-gray-200 h-4 w-3/4 rounded-md mb-2 animate-pulse" />
            <View className="flex-row items-center mt-0.5 gap-2">
              <View className="bg-gray-200 h-3 w-16 rounded-md animate-pulse" />
            </View>
            <View className="bg-gray-200 h-3 w-full rounded-md mt-1 animate-pulse" />
          </View>
        </View>
      ))}
    </View>
  );
}
