import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, DrawerActions } from '@react-navigation/native'

export default function Service() {
  const navigation = useNavigation();
  
  const handleOpenCart = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold">Service</Text>
          <TouchableOpacity 
            onPress={handleOpenCart}
            className="p-2 bg-blue-500 rounded-full"
          >
            <Ionicons name="cart" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <Text className="mt-4">Service content goes here</Text>
      </View>
    </SafeAreaView>
  )
}
