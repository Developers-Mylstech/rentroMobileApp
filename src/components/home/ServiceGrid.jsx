import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

export default function ServiceGrid({
  title = "Top Services",
  services,
  onServicePress
}) {
  // Only show max 4 services
  const selectedServices = services.slice(0, 4);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => onServicePress(item)}
      className=" w-[48.5%] mb-3 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image?.imageUrl || 'https://via.placeholder.com/150' }}
        className="w-full h-32 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text 
          className="text-gray-800 font-semibold text-base" 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text 
          className="text-gray-500 text-sm mt-1" 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.shortDescription}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="py-4 mb-8">
      <Text className="font-bold text-heading-4 uppercase mb-3">{title}</Text>
      <FlatList
        data={selectedServices}
        columnWrapperStyle={{ justifyContent: 'space-between',gap: 8, }}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderServiceItem}
      />
      {services.length > 4 && (
        <TouchableOpacity 
          onPress={() => onServicePress({ ourServiceId: 'all' })}
          className="mt-3 self-end"
        >
          <Text className="text-blue-600 font-medium">View All Services</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}