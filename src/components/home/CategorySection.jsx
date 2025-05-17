import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CategorySection({ onCategoryPress = () => {} }) {
  const categories = [
    { id: 'rent', name: 'Rent', icon: 'cart', route: '/shop', color: 'text-cars' },
    { id: 'sell', name: 'Sell', icon: 'pricetag', route: '/shop', color: 'text-spareparts' },
    { id: 'service', name: 'Service', icon: 'construct', route: '/service', color: 'text-otherservice' }
  ];
  
  return (
    <View className="py-2">
      <Text className="text-subheading font-bold text-heading-2 mb-3">Product By Category</Text>

      <View className="flex-row justify-between">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className="border border-gray-200 rounded-lg py-2 px-4 flex-row items-center w-[30%] justify-center"
            onPress={() => onCategoryPress(category.route, category.id)}
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
