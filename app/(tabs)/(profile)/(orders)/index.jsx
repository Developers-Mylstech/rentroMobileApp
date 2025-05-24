import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import useOrderStore from '../../../../src/store/orderStore'
import OrderSkeleton from '../../../../src/components/Skeleton/OrderSkeleton'

export default function OrdersList() {
    const router = useRouter()

    const { getAllOrders, orders, isLoading, error } = useOrderStore();

    useEffect(() => {
        getAllOrders()
    }, [])

    if (isLoading) {
        return (
            <OrderSkeleton />
        )
    }

    const handleOrderPress = (orderId) => {
        router.push(`/(tabs)/(profile)/(orders)/${orderId}`)
    }

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
            onPress={() => handleOrderPress(item?.orderId)}
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
                    onPress={() => router.push({
                        pathname: `/(tabs)/(profile)/(orders)/${item?.orderId}`,
                        params: { track: "true" }
                    })}
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
        <SafeAreaView className="flex-1 bg-white h-full p-4">
            <View className="flex-1 p-4">
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item, index) => index.toString()}
                    // contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className=" flex-1  h-full items-center justify-center py-10">
                            <Ionicons name="cube" size={64} color="#D1D5DB" />
                            <Text className="text-lg font-medium text-gray-700 mt-4">No orders yet</Text>
                            <Text className="text-gray-500 mt-1">Your orders will appear here</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
}


