import { View, Text } from 'react-native'
import React from 'react'

export default function ProfileSkeleton() {
  return (
    <View className="flex-1 bg-white">
      <View className="p-5">
        {/* Header Skeleton */}
        <View>
         <Text className="text-3xl font-semibold mb-5">Profile</Text>
        </View>

        {/* Profile Section Skeleton */}
        <View className="flex-row items-center mb-5 pb-5 border-b border-gray-200">
          <View className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
          <View className="ml-4 flex-1">
            <View className="bg-gray-200 h-5 w-20 rounded-md mb-2 animate-pulse" />
            <View className="bg-gray-200 h-4 w-28 rounded-md animate-pulse" />
          </View>
          <View className="w-5 h-5 rounded-md bg-gray-200 animate-pulse" />
        </View>

        {/* Order Tracking Card Skeleton */}
        <View className="bg-blue-50 rounded-xl p-4 mb-8 flex-row items-center">
          <View className="bg-blue-200 p-2 rounded-lg mr-3 w-10 h-10 animate-pulse" />
          <View className="flex-1">
            <View className="bg-gray-200 h-5 w-48 rounded-md mb-2 animate-pulse" />
            <View className="bg-gray-200 h-4 w-36 rounded-md animate-pulse" />
          </View>
        </View>


        <View>
          <Text className="text-2xl font-semibold mb-4">Settings</Text>
        </View>

        {/* Settings Menu Items Skeleton */}
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <View key={index} className="flex-row items-center justify-between py-4 border-b border-gray-200">
            <View className="w-10 h-10 rounded-md bg-gray-200 mr-3 animate-pulse" />
            <View className=" w-3/5 bg-gray-200 h-5 rounded-md animate-pulse mx-5" />
            <View className="w-10 h-10 rounded-md bg-gray-200 animate-pulse" />
          </View>
        ))}
      </View>
    </View>
  );
}
