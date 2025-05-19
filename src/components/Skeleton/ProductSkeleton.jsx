import React from 'react';
import { View, FlatList } from 'react-native';

export default function ProductSkeleton({ count = 8 }) {
  const skeletonItems = Array(count).fill({});

  const renderSkeletonItem = () => (
    <View className="w-[48.5%] m-1 mb-4">
      <View className="rounded-lg overflow-hidden">
        <View className="bg-gray-200 h-40 animate-pulse" />
        <View className="p-2">
          <View className="bg-gray-200 h-4 w-3/4 rounded-md mb-2 animate-pulse" />
          <View className="bg-gray-200 h-3 w-1/2 rounded-md mb-2 animate-pulse" />
          <View className="bg-gray-200 h-5 w-1/3 rounded-md animate-pulse" />
        </View>
      </View>
    </View>
  );

  return (
    <View className="py-4 mb-16">
      <View className="bg-gray-200 h-6 w-40 mb-3 rounded-md animate-pulse" />
      <FlatList
        data={skeletonItems}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderSkeletonItem}
      />
    </View>
  );
}
