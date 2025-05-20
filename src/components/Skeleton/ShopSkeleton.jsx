import React from 'react';
import { View, FlatList } from 'react-native';

export default function ShopSkeleton({ count = 8 }) {
  const skeletonItems = Array(count).fill({});

  const renderSkeletonItem = () => (
    <View className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden">
      {/* Product image skeleton */}
      <View className="flex justify-center items-center">
        <View className="w-24 h-24 bg-gray-200 animate-pulse" />
      </View>
      
      {/* Product details skeleton */}
      <View className="flex-1 p-3 justify-center relative">
        {/* Product name skeleton */}
        <View className="flex-row justify-between">
          <View className="bg-gray-200 h-5 w-3/4 rounded-md animate-pulse" />
        </View>
        
        {/* Brand and category skeleton */}
        <View className="flex-row items-center mt-2 gap-2">
          <View className="bg-gray-200 h-4 w-1/4 rounded-md animate-pulse" />
          <View className="bg-gray-200 h-4 w-1/4 rounded-md animate-pulse" />
        </View>

        {/* Price skeleton */}
        <View className="flex-row items-center mt-2">
          <View className="bg-gray-200 h-5 w-1/5 rounded-md animate-pulse" />
          <View className="bg-gray-200 h-4 w-1/6 rounded-md ml-2 animate-pulse" />
        </View>
      </View>
    </View>
  );

  // Search bar skeleton
  const renderSearchBarSkeleton = () => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 mb-4">
      <View className="flex-1 mx-3 flex-row items-center border border-gray-200 rounded-lg px-3 py-3">
        <View className="bg-gray-200 h-5 w-full rounded-md animate-pulse" />
      </View>
      <View className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {renderSearchBarSkeleton()}
      
      <FlatList
        data={skeletonItems}
        renderItem={renderSkeletonItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}