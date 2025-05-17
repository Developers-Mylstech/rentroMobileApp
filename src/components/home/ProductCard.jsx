import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ 
  item, 
  onPress = () => {} 
}) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg overflow-hidden   border border-gray-200 shadow-sm"
      onPress={onPress}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-2 flex gap-1">
        <Text className=" text-heading-3">{item.category || 'Service - 1'}</Text>
        <Text className=" text-subheading text-gray-900 font-light" numberOfLines={2}>
          {item.description || 'Description Description Description'}
        </Text>
        <Text className="text-heading-3 text-primary">{item.price || 'AED 56'}</Text>
      </View>
    </TouchableOpacity>
  );
}
