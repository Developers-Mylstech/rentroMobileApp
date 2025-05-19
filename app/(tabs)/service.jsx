import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function Service() {
  const router = useRouter();
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Water Purifier Service',
      price: '150.00 AED',
      image: 'https://www.kent.co.in/images/service/kent-ro-service.png',
      category: 'Maintenance',
      description: 'Professional RO water purifier service and maintenance.'
    },
    {
      id: 2,
      name: 'Filter Replacement',
      price: '100.00 AED',
      image: 'https://www.kent.co.in/images/service/kent-filter-replacement.png',
      category: 'Replacement',
      description: 'Replace filters for optimal water purification.'
    },
    {
      id: 3,
      name: 'Installation Service',
      price: '80.00 AED',
      image: 'https://www.kent.co.in/images/service/kent-installation.png',
      category: 'Installation',
      description: 'Professional installation of water purifiers.'
    },
    {
      id: 4,
      name: 'Repair Service',
      price: '200.00 AED',
      image: 'https://www.kent.co.in/images/service/kent-repair.png',
      category: 'Repair',
      description: 'Expert repair for all water purifier issues.'
    }
  ]);

  const handleServicePress = (service) => {
    console.log(`Service selected: ${service.name}`);
    // Navigate to service details page (to be implemented)
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center py-3 mb-2 border-gray-200 border-b">
          <Text className="text-primary font-bold text-heading-3">Our Services</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#007AFF" />
          </TouchableOpacity>
        
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="py-4">
            <Text className="font-bold text-heading-4 uppercase mb-3">Available Services</Text>
            
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id}
                onPress={() => handleServicePress(service)}
                className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden"
              >
                <Image 
                  source={{ uri: service.image }} 
                  className="w-24 h-24"
                  resizeMode="contain"
                />
                
                <View className="flex-1 p-3 justify-center">
                  <View className="flex-row justify-between">
                    <Text className="font-semibold text-base">{service.name}</Text>
                  </View>
                  <View className="flex-row items-center mt-0.5 gap-2">
                    <Text className="text-blue-500 text-sm pr-1 border-r border-gray-200">Rentro</Text>
                    <Text className="text-gray-500 rounded-lg text-sm">{service.category}</Text>
                  </View>
                  <Text className="text-gray-600 text-xs mt-1" numberOfLines={2}>{service.description}</Text>
                  <Text className="text-primary font-bold mt-1">{service.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
