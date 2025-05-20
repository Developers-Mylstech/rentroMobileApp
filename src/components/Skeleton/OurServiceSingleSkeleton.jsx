import { View, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function OurServiceSingleSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image skeleton */}
        <View className="h-72 w-full bg-gray-200 animate-pulse" />

        {/* Content container */}
        <View className="bg-white rounded-t-3xl -mt-6 px-4 pt-8 pb-12">
          {/* Title and description */}
          <View className="bg-gray-200 h-8 w-3/4 rounded-md mb-3 animate-pulse" />
          <View className="bg-gray-200 h-4 w-full rounded-md mb-2 animate-pulse" />
          <View className="bg-gray-200 h-4 w-full rounded-md mb-2 animate-pulse" />
          
          {/* Rating */}
          <View className="flex-row items-center mt-2">
            <View className="bg-gray-200 h-4 w-24 rounded-md animate-pulse" />
          </View>

          <View className="h-px bg-gray-200 my-6" />

          {/* Service details */}
          <View className="bg-gray-200 h-6 w-40 rounded-md mb-4 animate-pulse" />
          <View className="bg-gray-200 h-4 w-full rounded-md mb-2 animate-pulse" />
          <View className="bg-gray-200 h-4 w-full rounded-md mb-2 animate-pulse" />
          <View className="bg-gray-200 h-4 w-3/4 rounded-md mb-6 animate-pulse" />

          {/* Features */}
          <View className="mb-8">
            <View className="bg-gray-200 h-6 w-32 rounded-md mb-4 animate-pulse" />
            
            {[1, 2, 3].map((_, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="h-5 w-5 rounded-full bg-gray-200 mr-3 mt-1 animate-pulse" />
                <View className="flex-1">
                  <View className="bg-gray-200 h-4 w-3/4 rounded-md mb-2 animate-pulse" />
                  <View className="bg-gray-200 h-3 w-full rounded-md animate-pulse" />
                </View>
              </View>
            ))}
          </View>

          {/* CTA Card */}
          <View className="bg-blue-50 rounded-xl p-5">
            <View className="bg-gray-200 h-5 w-3/4 rounded-md mb-3 animate-pulse" />
            <View className="bg-gray-200 h-4 w-full rounded-md mb-4 animate-pulse" />
            <View className="bg-gray-200 h-12 w-full rounded-lg animate-pulse" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
