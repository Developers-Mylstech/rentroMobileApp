import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
    //   const foundOrder = getOrderById(orderId)
      const foundOrder = 1
      if (foundOrder) {
        setOrder(foundOrder)
        setError(null)
      } else {
        setError('Order not found')
      }
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [orderId])

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': 
        return <MaterialCommunityIcons name="package-variant-closed-check" size={24} color="#10b981" />;
      case 'shipped': 
        return <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#3b82f6" />;
      case 'processing': 
        return <MaterialCommunityIcons name="clock-time-four-outline" size={24} color="#f59e0b" />;
      case 'cancelled': 
        return <MaterialCommunityIcons name="close-circle-outline" size={24} color="#ef4444" />;
      default: 
        return <MaterialCommunityIcons name="help-circle-outline" size={24} color="#6b7280" />;
    }
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return ['#dcfce7', '#10b981'];
      case 'shipped': return ['#dbeafe', '#3b82f6'];
      case 'processing': return ['#fef3c7', '#f59e0b'];
      case 'cancelled': return ['#fee2e2', '#ef4444'];
      default: return ['#f3f4f6', '#6b7280'];
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-400 mt-4">Loading order details...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white p-4">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 mt-4 mb-2 text-center font-medium">{error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg mt-2"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Order not found</Text>
      </SafeAreaView>
    )
  }

  const [lightColor, darkColor] = getStatusColor(order.status)

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <LinearGradient
          colors={['#ffffff', '#f9fafb']}
          className="m-4 p-4 rounded-xl border border-gray-100 shadow-sm"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-gray-800">Order #{order.orderNumber}</Text>
            <View 
              className="px-3 py-1 rounded-full flex-row items-center" 
              style={{ backgroundColor: lightColor }}
            >
              {getStatusIcon(order.status)}
              <Text className="text-xs font-medium ml-1" style={{ color: darkColor }}>
                {order.status}
              </Text>
            </View>
          </View>
          <Text className="text-gray-500 mb-3">{formatDate(order.orderDate)}</Text>
          
          <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
            <View>
              <Text className="text-gray-500 text-xs">Total Amount</Text>
              <Text className="text-gray-800 font-bold text-xl">₹{order.totalAmount.toLocaleString()}</Text>
            </View>
            
            <TouchableOpacity 
              className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => router.push(`/(tabs)/(profile)/(orders)/track?orderId=${orderId}`)}
            >
              <Ionicons name="location-outline" size={16} color="white" />
              <Text className="text-white font-bold ml-1">Track Order</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Order Items */}
        <View className="mx-4 mb-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">Items ({order.items?.length || 0})</Text>
          
          {order.items?.map((item, index) => (
            <View key={index} className="flex-row mb-4 pb-4 border-b border-gray-100">
              <Image 
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }} 
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3 justify-between">
                <View>
                  <Text className="font-medium text-gray-800">{item.name}</Text>
                  <Text className="text-gray-500 text-sm">Qty: {item.quantity}</Text>
                </View>
                <Text className="font-bold text-gray-800">₹{item.price.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View className="mx-4 mb-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-3">
            <FontAwesome5 name="shipping-fast" size={16} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Shipping Address</Text>
          </View>
          
          <View className="bg-blue-50 p-3 rounded-lg">
            <Text className="text-gray-800 font-medium">{order.shippingAddress?.name}</Text>
            <Text className="text-gray-600 mt-1">{order.shippingAddress?.street}</Text>
            <Text className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</Text>
            <Text className="text-gray-600 mt-1">{order.shippingAddress?.phone}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View className="mx-4 mb-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-3">
            <FontAwesome5 name="credit-card" size={16} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Payment Information</Text>
          </View>
          
          <View className="bg-gray-50 p-3 rounded-lg mb-3">
            <Text className="text-gray-800 font-medium">Payment Method</Text>
            <Text className="text-gray-600">{order.paymentMethod}</Text>
          </View>
          
          <View className="border-t border-gray-100 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Subtotal</Text>
              <Text className="text-gray-700">₹{order.subtotal.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Shipping</Text>
              <Text className="text-gray-700">₹{order.shippingFee.toLocaleString()}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Total</Text>
              <Text className="text-gray-800 font-bold">₹{order.totalAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
