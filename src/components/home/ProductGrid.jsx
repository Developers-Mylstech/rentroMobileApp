import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ProductCard from './ProductCard';

export default function ProductGrid({
  title = "Top Products",
  products = [],
  onProductPress = () => { }
}) {

  const items = products.length > 0 ? products : [1, 2, 3, 4, 5, 6].map(id => ({ id }));

  return (
    <View className="py-4 mb-16">
      <Text className="font-bold text-heading-4 uppercase mb-3">{title}</Text>
      <FlatList
        data={items}
        numColumns={2} 
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="w-[48.5%] m-1">
            <ProductCard
              item={item}
              onPress={() => onProductPress(item)}
            />
          </View>
        )}

      />
    </View>
  );
}
