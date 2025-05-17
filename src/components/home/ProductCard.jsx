import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ 
  item, 
  onPress = () => {} 
}) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg overflow-hidden w-[31%] mb-3 border border-gray-200"
      onPress={onPress}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="text-blue-500 text-xs">{item.category || 'Service - 1'}</Text>
        <Text className="text-gray-500 text-xs" numberOfLines={2}>
          {item.description || 'Description Description Description'}
        </Text>
        <Text className="font-bold mt-1">{item.price || 'AED 56'}</Text>
      </View>
    </TouchableOpacity>
  );
}