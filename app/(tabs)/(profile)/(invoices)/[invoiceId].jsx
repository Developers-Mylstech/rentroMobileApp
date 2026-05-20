import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useInvoiceStore from '../../../../src/store/invoiceStore'

export default function InvoiceDetail() {
  const { invoiceId } = useLocalSearchParams()
  const router = useRouter()
  const { selectedInvoice, isLoading, error, getInvoiceById, clearSelectedInvoice } = useInvoiceStore()

  useEffect(() => {
    getInvoiceById(invoiceId)
    return () => clearSelectedInvoice()
  }, [invoiceId])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  if (isLoading && !selectedInvoice) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-4 font-medium">Loading invoice...</Text>
      </View>
    )
  }

  if (error && !selectedInvoice) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
        <Text className="text-red-500 text-lg font-bold mt-4">Failed to load invoice</Text>
        <Text className="text-gray-500 mt-2 text-center">{error}</Text>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-xl mt-6" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!selectedInvoice) return null

  const items = selectedInvoice.items || []
  const isPaid = selectedInvoice.isPaid || selectedInvoice.status === 'paid'

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Invoice Header Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 overflow-hidden">
          <View className={`px-4 py-3 ${isPaid ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="receipt" size={20} color={isPaid ? '#10B981' : '#F59E0B'} />
                <Text className={`font-bold text-lg ml-2 ${isPaid ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isPaid ? 'PAID' : 'PENDING'}
                </Text>
              </View>
              <Text className="text-gray-800 font-bold text-lg">₹{selectedInvoice.totalAmount?.toLocaleString() || '0'}</Text>
            </View>
          </View>

          <View className="p-4">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-gray-400 text-xs">INVOICE NUMBER</Text>
                <Text className="text-gray-800 font-semibold mt-1">{selectedInvoice.invoiceNumber || `INV-${invoiceId}`}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-400 text-xs">DATE</Text>
                <Text className="text-gray-800 font-semibold mt-1">{formatDate(selectedInvoice.createdAt)}</Text>
              </View>
            </View>

            {(selectedInvoice.dueDate) && (
              <View className="flex-row justify-between pt-3 border-t border-gray-100">
                <Text className="text-gray-400 text-xs">DUE DATE</Text>
                <Text className="text-gray-800 font-semibold">{formatDate(selectedInvoice.dueDate)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bill To */}
        {selectedInvoice.billingAddress && (
          <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 p-4">
            <Text className="text-base font-bold text-gray-900 mb-2">Bill To</Text>
            <Text className="text-gray-800 font-medium">{selectedInvoice.billingAddress.name || selectedInvoice.userName}</Text>
            <Text className="text-gray-500 text-sm">{selectedInvoice.billingAddress.address}</Text>
            <Text className="text-gray-500 text-sm">{selectedInvoice.billingAddress.city}, {selectedInvoice.billingAddress.state} - {selectedInvoice.billingAddress.pincode}</Text>
            <Text className="text-gray-500 text-sm">{selectedInvoice.billingAddress.phone}</Text>
          </View>
        )}

        {/* Order Items */}
        {items.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 overflow-hidden">
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="text-base font-bold text-gray-900">Items ({items.length})</Text>
            </View>
            {items.map((item, index) => (
              <View key={item.id || index} className={`px-4 py-3 ${index < items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <View className="flex-row justify-between">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-800 font-medium">{item.productName || item.name}</Text>
                    <Text className="text-gray-400 text-sm mt-1">Qty: {item.quantity || 1}</Text>
                  </View>
                  <Text className="font-semibold text-gray-800">₹{(item.price || item.amount || 0).toLocaleString()}</Text>
                </View>
              </View>
            ))}

            {/* Totals */}
            <View className="border-t border-gray-100 px-4 py-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-500">Subtotal</Text>
                <Text className="text-gray-800">₹{(selectedInvoice.subtotal || selectedInvoice.totalAmount || 0).toLocaleString()}</Text>
              </View>
              {selectedInvoice.tax && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500">Tax</Text>
                  <Text className="text-gray-800">₹{selectedInvoice.tax.toLocaleString()}</Text>
                </View>
              )}
              {selectedInvoice.shippingCharges && (
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500">Shipping</Text>
                  <Text className="text-gray-800">₹{selectedInvoice.shippingCharges.toLocaleString()}</Text>
                </View>
              )}
              <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
                <Text className="font-bold text-gray-900">Total</Text>
                <Text className="font-bold text-gray-900 text-lg">₹{selectedInvoice.totalAmount?.toLocaleString() || '0'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment Info */}
        {selectedInvoice.paymentMethod && (
          <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 p-4">
            <Text className="text-base font-bold text-gray-900 mb-2">Payment</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-500">Method</Text>
              <Text className="text-gray-800 font-medium">{selectedInvoice.paymentMethod}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Status</Text>
              <Text className={`font-medium ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                {isPaid ? 'Paid' : 'Pending'}
              </Text>
            </View>
          </View>
        )}

        {/* Download Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center">
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
