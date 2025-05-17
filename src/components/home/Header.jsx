import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header({
  onSearchPress = () => {}
}) {
  const navigation = useNavigation();

  const handleCartPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="flex-row justify-between items-center py-3 mb-2 border-gray-200 border-b">
      <Text className="text-primary font-bold text-heading-3">Rentro</Text>

      <View className="flex-row">
        <TouchableOpacity className="mr-4" onPress={handleCartPress}>
          <Ionicons name="cart" size={24} color="#3671E7" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSearchPress}>
          <Ionicons name="search" size={24} color="#3671E7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
