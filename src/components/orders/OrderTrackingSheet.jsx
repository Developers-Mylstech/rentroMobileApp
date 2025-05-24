import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function OrderTrackingSheet({ isVisible, onClose, orderData }) {
  if (!orderData) return null;

  const trackingSteps = [
    { id: 1, title: 'Order Placed', description: 'Your order has been received', icon: 'receipt-outline', date: orderData.createdAt },
    { id: 2, title: 'Payment Confirmed', description: 'Payment has been verified', icon: 'checkmark-circle-outline', date: orderData.isPaid ? orderData.paidAt : null },
    { id: 3, title: 'Processing', description: 'Your order is being processed', icon: 'cog-outline', date: orderData.status === 'processing' ? orderData.updatedAt : null },
    { id: 4, title: 'Shipped', description: 'Your order has been shipped', icon: 'cube-outline', date: orderData.status === 'shipped' ? orderData.updatedAt : null },
    { id: 5, title: 'Delivered', description: 'Your order has been delivered', icon: 'checkmark-done-outline', date: orderData.status === 'delivered' ? orderData.deliveryDate : null },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentStep = () => {
    const status = orderData.status?.toLowerCase();
    if (status === 'delivered') return 5;
    if (status === 'shipped') return 4;
    if (status === 'processing') return 3;
    if (orderData.isPaid) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      propagateSwipe={true}
    >
      <View className="bg-white rounded-t-3xl pb-6">
        <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
        
        <View className="px-4 pt-2 pb-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-800 mb-1">Track Order</Text>
          <Text className="text-gray-500">Order #{orderData.orderNumber}</Text>
        </View>
        
        <ScrollView className="px-4 pt-4" showsVerticalScrollIndicator={false}>
          {trackingSteps.map((step, index) => (
            <View key={step.id} className="flex-row mb-6">
              {/* Status indicator */}
              <View className="items-center mr-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${step.id <= currentStep ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  <Ionicons name={step.icon} size={20} color={step.id <= currentStep ? 'white' : '#9ca3af'} />
                </View>
                
                {/* Connecting line */}
                {index < trackingSteps.length - 1 && (
                  <View className={`w-1 flex-1 my-1 ${step.id < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
              </View>
              
              {/* Step details */}
              <View className="flex-1 pt-1 pb-4">
                <View className="flex-row justify-between items-start">
                  <Text className={`font-bold ${step.id <= currentStep ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.title}
                  </Text>
                  {step.date && (
                    <Text className="text-xs text-gray-500">{formatDate(step.date)}</Text>
                  )}
                </View>
                <Text className={`text-sm ${step.id <= currentStep ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            className="bg-blue-500 py-3 rounded-lg items-center mt-2 mb-6"
            onPress={onClose}
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}