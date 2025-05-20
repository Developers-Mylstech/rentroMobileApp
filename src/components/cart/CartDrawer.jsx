import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';

export default function CartDrawer({ 
  isVisible, 
  onClose, 
  cartItems, 
  onClearAll, 
  onRemoveItem, 
  onUpdateQuantity 
}) {
  const router = useRouter();
  
  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Render each cart item
  const renderCartItem = ({ item }) => {
    const imageUrl = item.image || 'https://via.placeholder.com/60';
    
    return (
      <View className="flex-row items-center bg-white mb-2 p-3 rounded-lg border border-gray-100">
        {/* Product Image */}
        <Image 
          source={{ uri: imageUrl }} 
          className="w-14 h-14 rounded-md"
          resizeMode="contain"
        />
        
        {/* Product Details */}
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-base">{item.name}</Text>
          
          {/* Product Type Badge */}
          <View className="flex-row items-center mt-1">
            <View className={`px-2 py-0.5 rounded-full ${item.productType === 'RENT' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <Text className={`text-xs font-medium ${item.productType === 'RENT' ? 'text-green-700' : 'text-blue-700'}`}>
                {item.productType === 'RENT' ? 'RENT' : 'SELL'}
              </Text>
            </View>
            <Text className="text-blue-500 text-sm ml-2">
              {item.productType === 'RENT' ? `${item.price.toFixed(2)} AED/month` : `${item.price.toFixed(2)} AED`}
            </Text>
          </View>
          
          <Text className="text-gray-500 text-xs mt-1">
            Total: {(item.price * item.quantity).toFixed(2)} AED
          </Text>
        </View>
        
        {/* Quantity Controls */}
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1, item.productType)}
            disabled={item.quantity <= 1}
            className="p-1"
          >
            <Ionicons name="remove-circle" size={22} color={item.quantity <= 1 ? "#d1d5db" : "#3b82f6"} />
          </TouchableOpacity>
          
          <Text className="mx-2 font-semibold">{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1, item.productType)}
            className="p-1"
          >
            <Ionicons name="add-circle" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        {/* Remove Button */}
        <TouchableOpacity 
          onPress={() => onRemoveItem(item.id, item.productType)}
          className="ml-2"
        >
          <Text className="text-red-500 text-xs">Clear ×</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      propagateSwipe={true}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View className="bg-gray-50 rounded-t-3xl h-[80%]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-bold">Your Cart</Text>
          
          <View className="flex-row">
            {cartItems.length > 0 && (
              <TouchableOpacity onPress={onClearAll} className="mr-4">
                <Text className="text-red-500">Clear All</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Cart Items */}
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item, index) => `${item.id}-${item.productType}-${index}`}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Ionicons name="cart-outline" size={60} color="#d1d5db" />
              <Text className="text-gray-400 mt-4 text-center">Your cart is empty</Text>
            </View>
          }
        />
        
        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <View className="p-4 border-t border-gray-200 bg-white">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500">Total Amount:</Text>
              <Text className="text-lg font-bold">{totalAmount.toFixed(2)} AED</Text>
            </View>
            
            <TouchableOpacity 
              className="bg-blue-500 py-3 rounded-lg items-center"
              onPress={() => {
                onClose();
                router.push('/checkout');
              }}
            >
              <Text className="text-white font-bold text-lg">Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

