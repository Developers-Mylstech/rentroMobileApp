import { View, Text } from 'react-native'
import React from 'react'

export default function AddressSkeleton() {
  return (
    <View className="flex-1 bg-white p-4">
      {/* Header Skeleton */}
      <View className="bg-gray-200 h-8 w-40 rounded-md mb-6 animate-pulse" />
      
      {/* Address Cards Skeleton */}
      {[1, 2, 3].map((_, index) => (
        <View 
          key={index} 
          className="border border-gray-200 rounded-lg p-4 mb-4"
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              {/* Building & Flat Number */}
              <View className="flex-row items-center">
                <View className="bg-gray-200 h-5 w-40 rounded-md animate-pulse" />
                <View className="bg-blue-100 w-16 h-4 rounded ml-2 animate-pulse" />
              </View>
              
              {/* Street Address */}
              <View className="bg-gray-200 h-4 w-full rounded-md mt-2 animate-pulse" />
              
              {/* Area & Emirate */}
              <View className="bg-gray-200 h-4 w-3/4 rounded-md mt-2 animate-pulse" />
              
              {/* Country */}
              <View className="bg-gray-200 h-4 w-1/4 rounded-md mt-2 animate-pulse" />
              
              {/* Landmark */}
              <View className="bg-gray-200 h-3 w-1/2 rounded-md mt-2 animate-pulse" />
              
              {/* Address Type */}
              <View className="bg-gray-200 h-3 w-12 rounded-md mt-2 animate-pulse" />
            </View>
            
            {/* Action Buttons */}
            <View className="flex-row">
              <View className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-1" />
              <View className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-1" />
            </View>
          </View>
        </View>
      ))}
      
      {/* Add New Address Button Skeleton */}
      <View className="bg-gray-200 h-12 w-full rounded-lg mt-4 animate-pulse" />
    </View>
  )
}
