import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ProductCard from './ProductCard';

export default function ProductGrid({
  title = "Top Products",
  products,

}) {

  const seletecedProducts = products.slice(0, 8);

  return (
    <View className="py-4 mb-16">
      <Text className="font-bold text-heading-4 uppercase mb-3">{title}</Text>
      <FlatList
        data={seletecedProducts}
        numColumns={2} 
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="w-[48.5%] m-1">
            <ProductCard
              item={item}
            />
          </View>
        )}

      />
    </View>
  );
}
