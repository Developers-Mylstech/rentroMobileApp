import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CategorySection({ onCategoryPress = () => {} }) {
  const categories = [
    { id: 'rent', name: 'Rent', icon: 'cart', route: '/(tabs)/shop/rent-products', color: 'text-cars' },
    { id: 'sell', name: 'Sell', icon: 'pricetag', route: '/(tabs)/shop/sell-products', color: 'text-spareparts' },
    { id: 'service', name: 'Service', icon: 'logo-dropbox', route: '/(tabs)/service', color: 'text-otherservice' }
  ];
  
  return (
    <View className="my-5">
      <Text className=" font-bold text-heading-4 uppercase mb-3">Product By Category</Text>

      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="border border-gray-200 rounded-lg py-2 px-4 flex-row items-center w-[32%] justify-center"
            onPress={() => onCategoryPress(category.route)}
          >
            <Ionicons 
              name={category.icon} 
              size={18} 
              color={category.id === 'rent' ? '#106099' : category.id === 'sell' ? '#FFA828' : '#79B3B9'} 
              style={{ marginRight: 6 }} 
            />
            <Text className={`${category.color} font-medium text-heading-5`}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
