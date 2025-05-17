import React from 'react';
import { View, Text } from 'react-native';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  title = "Top Products", 
  products = [], 
  onProductPress = () => {} 
}) {
  
  const items = products.length > 0 ? products : [1, 2, 3, 4, 5, 6].map(id => ({ id }));
  
  return (
    <View className="py-2 mb-20">
      <Text className="text-black font-bold text-lg mb-3">{title}</Text>

      <View className="flex-row flex-wrap justify-between">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onPress={() => onProductPress(item)}
          />
        ))}
      </View>
    </View>
  );
}