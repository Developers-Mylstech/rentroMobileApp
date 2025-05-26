import React from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const CartNotificationDialog = ({ 
  visible, 
  onClose, 
  title, 
  message, 
  type = 'success', // 'success', 'error', 'loading'
  actionText = 'OK',
  onAction = null,
  secondaryActionText = null,
  onSecondaryAction = null,
  showLoginPrompt = false
}) => {
  const router = useRouter();
  
  const handleLoginRedirect = () => {
    onClose();
    router.push('/(profile)');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 w-[85%] max-w-md">
          {/* Icon based on type */}
          <View className="items-center mb-4">
            {type === 'loading' ? (
              <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4">
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : type === 'success' ? (
              <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              </View>
            ) : (
              <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
              </View>
            )}
            
            <Text className="text-2xl font-bold text-gray-800">{title}</Text>
            {message && (
              <Text className="text-gray-600 text-center mt-2">
                {message}
              </Text>
            )}
            
            {showLoginPrompt && (
              <Text className="text-blue-600 text-center mt-4">
                Sign in to sync your cart across devices
              </Text>
            )}
          </View>
          
          {/* Action buttons */}
          <View className="flex-row justify-center mt-4">
            {secondaryActionText && (
              <TouchableOpacity
                className="bg-gray-200 rounded-lg py-3 px-6 mr-3"
                onPress={onSecondaryAction || onClose}
              >
                <Text className="text-gray-800 font-bold">{secondaryActionText}</Text>
              </TouchableOpacity>
            )}
            
            {showLoginPrompt && (
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-3 px-6 mr-3"
                onPress={handleLoginRedirect}
              >
                <Text className="text-white font-bold">Sign In</Text>
              </TouchableOpacity>
            )}
            
            {type !== 'loading' && (
              <TouchableOpacity
                className={`rounded-lg py-3 px-6 ${type === 'success' ? 'bg-blue-500' : 'bg-red-500'}`}
                onPress={onAction || onClose}
              >
                <Text className="text-white font-bold">{actionText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CartNotificationDialog;
