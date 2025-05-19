import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import "../../../global.css"

export default function Banner({ 
  title = "New Year Offer", 
  discount = "30% OFF", 
  period = "16-31 Dec", 
  buttonText = "Get Now", 
  imageUrl = "https://via.placeholder.com/150",
  onPress = () => {},
  bgColor = "bg-cars/10" // Using your custom colors with opacity
}) {
  return (
    <View className={`my-3 ${bgColor} rounded-xl overflow-hidden`}>
      <View className="flex-row justify-between p-4">
        <View className="w-1/2">
          <Text className="text-heading-3 text-heading-default">{title}</Text>
          <Text className="text-heading-1 font-bold text-cars">{discount}</Text>
          <Text className="text-subheading text-subheading-default mb-2">{period}</Text>

          <TouchableOpacity 
            className="text-red-500 rounded-full px-4 py-1 self-start"
            onPress={onPress}
          >
            <Text className="text-white font-medium ">{buttonText}</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: imageUrl }}
          className="w-36 h-24"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
