import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ 
  value = "", 
  onChangeText = () => {}, 
  placeholder = "What are you looking for......" 
}) {
  return (
    <View className="py-2">
      <View className="flex-row items-center border border-gray-200 rounded-lg px-4 py-4">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          className="flex-1 text-gray-700"
        />
        <Ionicons name="search" size={20} color="#007AFF" />
      </View>
    </View>
  );
}