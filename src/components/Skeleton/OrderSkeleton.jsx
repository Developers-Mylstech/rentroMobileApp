import { View, Text } from 'react-native'
import React from 'react'

export default function OrderSkeleton() {

  
  return (
    <View className="flex-1 bg-white p-4">
      
      {[1,2,3,4,5,].map((_, index) => (
        <View key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
          
          <View className="flex-row items-center mb-3">
            
            <View className="w-8 h-8 bg-gray-200 rounded-md animate-pulse mr-3" />
            <View className="flex-1">
              <View className="bg-gray-200 h-4 w-3/4 rounded-md mb-2 animate-pulse" />
              <View className="bg-gray-200 h-3 w-1/2 rounded-md animate-pulse" />
            </View>
          </View>
          
          
          <View className="flex-row justify-between items-center border-t border-gray-100 pt-4 mt-2">
            <View className="bg-gray-200 h-5 w-20 rounded-md animate-pulse" />
            <View className="bg-gray-200 h-5 w-24 rounded-md animate-pulse" />
          </View>
        </View>
      ))}
    </View>
  );
}
