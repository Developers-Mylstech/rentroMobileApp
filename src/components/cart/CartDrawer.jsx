import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get('window');

export default function CartDrawer({ isVisible, onClose, cartItems = [], onClearAll, onRemoveItem, onUpdateQuantity }) {
  // Animation value for sliding
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Handle animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      // Animate drawer in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Fully visible (no offset)
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic)
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      // Animate drawer out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic)
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible, slideAnim, fadeAnim]);
  
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
          <Text className="text-blue-500 text-sm">Total: {item.price.toFixed(2)} AED</Text>
        </View>
        
        {/* Quantity Controls */}
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1"
          >
            <Ionicons name="remove-circle" size={22} color={item.quantity <= 1 ? "#d1d5db" : "#3b82f6"} />
          </TouchableOpacity>
          
          <Text className="mx-2 font-semibold">{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1"
          >
            <Ionicons name="add-circle" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        
        {/* Remove Button */}
        <TouchableOpacity 
          onPress={() => onRemoveItem(item.id)}
          className="ml-2"
        >
          <Text className="text-red-500 text-xs">Clear ×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Don't render anything if drawer is not visible and fully closed
  if (!isVisible && fadeAnim._value === 0) return null;

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0 z-50">
      {/* Background overlay - tap to close */}
      <Animated.View 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: fadeAnim
        }}
      >
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* Bottom Sheet Content */}
      <Animated.View 
        className="absolute left-0 right-0 bg-white shadow-xl rounded-t-2xl"
        style={{ 
          height: height * 0.7, // 70% of screen height
          bottom: 0,
          transform: [{ translateY: slideAnim }],
          zIndex: 1 // Ensure drawer is above the overlay
        }}
      >
        {/* Handle bar for better UX */}
        <View className="w-full items-center pt-2 pb-1">
          <View className="w-16 h-1 bg-gray-300 rounded-full" />
        </View>
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold">Shopping Cart</Text>
            <Ionicons name="cart" size={20} color="#3b82f6" style={{ marginLeft: 5 }} />
          </View>
          
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={onClearAll}
              className="mr-4"
            >
              <Text className="text-red-500">Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Cart Items */}
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
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
        
        {/* Footer with Total */}
        {cartItems.length > 0 && (
          <View className="p-4 border-t border-gray-200">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500">Subtotal:</Text>
              <Text className="font-semibold">{totalAmount.toFixed(2)} AED</Text>
            </View>
            
            <TouchableOpacity 
              className="bg-blue-600 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-bold text-center">
                Checkout ({totalAmount.toFixed(2)} AED)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}





