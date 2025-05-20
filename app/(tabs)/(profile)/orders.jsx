import { View, Text, FlatList } from 'react-native'
import React from 'react'

export default function Orders() {
  // Sample order data
  const orders = [
    { id: '1', number: 'ORD-001', date: '25 May 2023', status: 'Delivered', total: '$120.00' },
    { id: '2', number: 'ORD-002', date: '18 May 2023', status: 'Processing', total: '$85.50' },
    { id: '3', number: 'ORD-003', date: '10 May 2023', status: 'Delivered', total: '$210.75' },
  ]

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg mb-4">Your recent orders</Text>
      
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-lg p-4 mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="font-medium">{item.number}</Text>
              <Text className="text-blue-500">{item.status}</Text>
            </View>
            <Text className="text-gray-500 mb-2">Order Date: {item.date}</Text>
            <Text className="font-bold">Total: {item.total}</Text>
          </View>
        )}
      />
    </View>
  )
}