import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ item, }) {
  const imageUrl = item.images?.[0]?.imageUrl || 'https://via.placeholder.com/100';
  const category = item.category?.name || 'Unknown Category';
  const description = item.description || 'No description available';
  const price = item.productFor?.sell?.discountPrice !== undefined
    ? `AED ${item.productFor.sell.discountPrice}`
    : item.productFor?.rent?.discountPrice !== undefined
      ? `AED ${item.productFor?.rent?.discountPrice}`
      : 'Price Not Available';
      
  const onPress = () => {
    console.log('Product Pressed');
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg h-56 overflow-hidden border border-gray-200 shadow-sm"
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-2 flex gap-1">
        <Text className="text-heading-3">{item?.name ? (item.name.length > 10 ? `${item.name.slice(0, 8)}...` : item.name) : category}</Text>
        <Text className="text-subheading text-gray-900 font-light" numberOfLines={2}>
          {description}
        </Text>
        <Text className="text-heading-3 text-primary">{typeof price === 'string' && price.startsWith('AED') ? `AED ${parseFloat(price.replace('AED', '')).toFixed(2)}` : price}</Text>
      </View>
    </TouchableOpacity>
  );
}
