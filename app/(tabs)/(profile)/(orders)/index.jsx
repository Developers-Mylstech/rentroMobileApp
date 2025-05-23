import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function OrdersList() {
  const router = useRouter()
  
  // Dummy orders data
  const [orders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2023-001',
      status: 'Delivered',
      orderDate: '2023-05-20T10:30:00Z',
      deliveryDate: '2023-05-25T14:15:00Z',
      totalAmount: 4299.99
    },
    {
      id: 2,
      orderNumber: 'ORD-2023-002',
      status: 'Shipped',
      orderDate: '2023-06-18T14:45:00Z',
      estimatedDelivery: '2023-06-25T00:00:00Z',
      totalAmount: 1899.50
    },
    {
      id: 3,
      orderNumber: 'ORD-2023-003',
      status: 'Processing',
      orderDate: '2023-06-22T09:15:00Z',
      totalAmount: 599.00
    },
    {
      id: 4,
      orderNumber: 'ORD-2023-004',
      status: 'Cancelled',
      orderDate: '2023-06-10T16:20:00Z',
      totalAmount: 3596.00
    }
  ])

  const handleOrderPress = (orderId) => {
    router.push(`/(tabs)/(profile)/(orders)/${orderId}`)
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => handleOrderPress(item.id)}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-100">
        <View className="flex-row items-center gap-2">
            <Ionicons name="cube" size={24} color="#3B82F6" />
        <Text className="text-base font-semibold text-gray-800">{item.orderNumber}</Text>
        </View>
        <Text className="font-bold text-gray-800">₹{item.totalAmount.toFixed(2)}</Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-500 text-sm">
          {item.deliveryDate ? `Delivered: ${formatDate(item.deliveryDate)}` : 
           item.estimatedDelivery ? `Est. Delivery: ${formatDate(item.estimatedDelivery)}` : 
           `Ordered: ${formatDate(item.orderDate)}`}
        </Text>
        
        <TouchableOpacity 
          className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full"
          onPress={() => router.push(`/(tabs)/(profile)/(orders)/track?orderId=${item.id}`)}
        >
          <Ionicons name="location-outline" size={14} color="#3B82F6" />
          <Text className="text-blue-500 font-medium text-xs ml-1">Track</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-700 mt-4">No orders yet</Text>
            <Text className="text-gray-500 mt-1">Your orders will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}


