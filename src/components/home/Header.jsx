import React from 'react';
import { View, Image, TouchableOpacity,Text } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header({ 
  profileImage = "https://randomuser.me/api/portraits/men/1.jpg",
  onProfilePress = () => {},
  onHeartPress = () => {},
  onSearchPress = () => {}
}) {
  return (
    <View className="flex-row justify-between items-center py-3 mb-2 border-gray-200 border-b">
      
        <Image 
          source={ require('../../../assets/adaptive-icon.png')}
          className="w-24 h-10"
          resizeMode="contain"
        />

      <View className="flex-row">
        <TouchableOpacity className="mr-4" onPress={onHeartPress}>
          <Ionicons name="heart" size={24} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons name="search" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}