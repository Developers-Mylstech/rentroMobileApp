import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import useOrderStore from '../../../../src/store/orderStore'

export default function OrderDetails() {
  const { orderId } = useLocalSearchParams()
  const router = useRouter()
  
  const { getOrderById, currentOrder, isLoading, error } = useOrderStore();

  useEffect(() => {
    getOrderById(orderId)
  }, [orderId])

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': 
        return <MaterialCommunityIcons name="package-variant-closed-check" size={24} color="#10b981" />;
      case 'shipped': 
        return <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#3b82f6" />;
      case 'processing': 
      case 'pending':
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
      case 'processing': 
      case 'pending': return ['#fef3c7', '#f59e0b'];
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-500 mt-4 font-medium">Loading your order details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
          <Text className="text-red-500 mt-6 mb-3 text-center font-bold text-lg">Oops! Something went wrong</Text>
          <Text className="text-gray-500 mb-6 text-center">{error}</Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="white" />
            <Text className="text-white font-bold ml-2">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (!currentOrder) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="search" size={60} color="#9ca3af" />
          <Text className="text-gray-700 mt-6 mb-2 text-center font-bold text-lg">Order Not Found</Text>
          <Text className="text-gray-500 mb-6 text-center">We couldn't find the order you're looking for.</Text>
          <TouchableOpacity 
            className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center"
            onPress={() => router.push('/(tabs)/(profile)/(orders)')}
          >
            <Ionicons name="list" size={18} color="white" />
            <Text className="text-white font-bold ml-2">View All Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const [lightColor, darkColor] = getStatusColor(currentOrder?.status)
  const isPaid = currentOrder?.isPaid || false
  const paymentStatus = isPaid ? 'Paid' : 'Pending'
  const paymentStatusColor = isPaid ? '#10b981' : '#f59e0b'

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with back button */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Order Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Order Status Card */}
        <LinearGradient
          colors={['#ffffff', '#f9fafb']}
          className="mx-4 mt-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Status Banner */}
          <View className="w-full py-3 px-4" style={{ backgroundColor: lightColor }}>
            <View className="flex-row items-center">
              {getStatusIcon(currentOrder?.status)}
              <Text className="font-bold ml-2 text-base" style={{ color: darkColor }}>
                {currentOrder?.status?.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-gray-500 text-xs">ORDER NUMBER</Text>
                <Text className="text-lg font-bold text-gray-800">#{currentOrder?.orderNumber}</Text>
              </View>
              <View>
                <Text className="text-gray-500 text-xs text-right">ORDERED ON</Text>
                <Text className="text-gray-700 font-medium">{formatDate(currentOrder?.createdAt).split(' at ')[0]}</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <View>
                <Text className="text-gray-500 text-xs">TOTAL AMOUNT</Text>
                <Text className="text-gray-800 font-bold text-xl">₹{currentOrder?.totalAmount.toLocaleString()}</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
                onPress={() => router.push(`/(tabs)/(profile)/(orders)/track?orderId=${orderId}`)}
              >
                <Ionicons name="location-outline" size={16} color="white" />
                <Text className="text-white font-bold ml-1">Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Payment Info */}
        <View className="mx-4 mt-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <FontAwesome5 name="credit-card" size={16} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Payment Information</Text>
          </View>
          
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-700">Payment Method</Text>
              <Text className="font-medium text-gray-800">{currentOrder?.paymentMethod || 'N/A'}</Text>
            </View>
            
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-700">Payment Status</Text>
              <View className="flex-row items-center">
                <View className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: paymentStatusColor }} />
                <Text className="font-medium" style={{ color: paymentStatusColor }}>{paymentStatus}</Text>
              </View>
            </View>
            
            {isPaid && (
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700">Payment Date</Text>
                <Text className="font-medium text-gray-800">{formatDate(currentOrder?.paidAt).split(' at ')[0]}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View className="mx-4 mt-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <Ionicons name="cube-outline" size={18} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">
              Items ({currentOrder?.items?.length || 0})
            </Text>
          </View>
          
          <View className="p-4">
            {currentOrder?.items?.map((item, index) => (
              <View 
                key={index} 
                className={`flex-row ${index < currentOrder.items.length - 1 ? 'mb-4 pb-4 border-b border-gray-100' : ''}`}
              >
                <Image 
                  source={{ uri: item.productImage || 'https://via.placeholder.com/100' }} 
                  className="w-20 h-20 rounded-lg bg-gray-100"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3 justify-between">
                  <View>
                    <Text className="font-medium text-gray-800">{item.productName}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-gray-500 text-sm">Qty: {item.quantity}</Text>
                      {item.productType && (
                        <View className="ml-2 px-2 py-0.5 bg-blue-100 rounded-full">
                          <Text className="text-blue-700 text-xs font-medium">{item.productType}</Text>
                        </View>
                      )}
                    </View>
                    {item.rentPeriod > 0 && (
                      <Text className="text-gray-500 text-sm mt-1">Rent Period: {item.rentPeriod} days</Text>
                    )}
                  </View>
                  <Text className="font-bold text-gray-800 mt-1">₹{item.price.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Address */}
        <View className="mx-4 mt-4 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <FontAwesome5 name="shipping-fast" size={16} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Delivery Address</Text>
          </View>
          
          <View className="p-4">
            <View className="bg-blue-50 p-4 rounded-lg">
              {currentOrder?.deliveryAddress?.addressType && (
                <View className="absolute top-2 right-2 bg-blue-100 px-2 py-1 rounded-full">
                  <Text className="text-blue-700 text-xs font-medium">{currentOrder.deliveryAddress.addressType}</Text>
                </View>
              )}
              
              <Text className="font-medium text-gray-800 text-base">{currentOrder?.userName}</Text>
              <Text className="text-gray-600 mt-1">{currentOrder?.userMobile}</Text>
              
              <View className="mt-3 pt-3 border-t border-blue-100">
                {currentOrder?.deliveryAddress?.flatNo && (
                  <Text className="text-gray-700">
                    {currentOrder.deliveryAddress.flatNo}, {currentOrder.deliveryAddress.buildingName || ''}
                  </Text>
                )}
                <Text className="text-gray-700">{currentOrder?.deliveryAddress?.streetAddress}</Text>
                <Text className="text-gray-700">
                  {currentOrder?.deliveryAddress?.area}, {currentOrder?.deliveryAddress?.emirate}
                </Text>
                <Text className="text-gray-700">{currentOrder?.deliveryAddress?.country}</Text>
                
                {currentOrder?.deliveryAddress?.landmark && (
                  <Text className="text-gray-700 mt-1">Landmark: {currentOrder.deliveryAddress.landmark}</Text>
                )}
              </View>
            </View>
            
            {currentOrder?.deliveryDate && (
              <View className="mt-4 flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text className="text-gray-700 ml-2">
                  Expected Delivery: <Text className="font-medium">{formatDate(currentOrder.deliveryDate).split(' at ')[0]}</Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
