import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import useCartStore from '../../store/cartStore';

export default function CartDrawer({ 
  isVisible, 
  onClose
}) {
  const router = useRouter();
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart,
    totalAmount,
    totalItems,
    loading,
    fetchCartItems
  } = useCartStore();
  
  // Fetch cart items when drawer opens
  useEffect(() => {
    if (isVisible) {
      fetchCartItems().catch(error => 
        console.error('Failed to fetch cart items:', error)
      );
    }
  }, [isVisible, fetchCartItems]);

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    setTimeout(() => {
      fetchCartItems().catch(error => 
        console.error('Failed to fetch cart items:', error)
      );
    }, 100);


  };
  
  // Get cart items array from the cart object
  const cartItemsArray = cartItems?.items || [];
  
  // Render each cart item
  const renderCartItem = ({ item }) => {
    // Get the first image from productImages array or use placeholder
    const imageUrl = item.productImages && item.productImages.length > 0 
      ? item.productImages[0] 
      : 'https://via.placeholder.com/60';
    
    // Determine if this is a rent product
    const isRentProduct = item.productType === 'RENT';
    
    return (
      <View className="flex-row items-center py-3 border-b border-gray-100">
        {/* Product Image */}
        <Image 
          source={{ uri: imageUrl }} 
          className="w-16 h-16 rounded-md mr-3"
          resizeMode="cover"
        />
        
        {/* Product Details */}
        <View className="flex-1">
          <Text className="font-medium text-gray-800" numberOfLines={1}>
            {item.productName || 'Product'}
          </Text>
          
          <Text className="text-blue-500 font-bold mt-1">
            {item.price || 0} AED
            {isRentProduct ? '/month' : ''}
          </Text>
          
          <View className="flex-row items-center mt-2">
            <Text className="text-gray-500 mr-2">
              {isRentProduct ? 'Rent' : 
               item.productType === 'SELL' ? 'Buy' : 'Service'}
            </Text>
            
            {/* Quantity Controls - Only show for non-rent products */}
    
              <View className="flex-row items-center border border-gray-200 rounded-md">
                <TouchableOpacity 
                  className="px-2 py-1" 
                  onPress={() => updateCartItemQuantity(item?.cartItemId, Math.max(1, (item?.productDetail?.quantity) - 1))}
                >
                  <Ionicons name="remove" size={16} color="#666" />
                </TouchableOpacity>
                
                <Text className="px-2 min-w-[30px] text-center">
                  {item?.productDetail?.quantity}
                </Text>
                
                <TouchableOpacity 
                  className="px-2 py-1" 
                  onPress={() => updateCartItemQuantity(item?.cartItemId, (item?.productDetail?.quantity) + 1)}
                >
                  <Ionicons name="add" size={16} color="#666" />
                </TouchableOpacity>
              </View>
    
            
            {/* For rent products, just show the quantity */}
          
          </View>
        </View>
        
        {/* Remove Button */}
        <TouchableOpacity 
          className="p-2" 
          onPress={() => handleDelete(item.cartItemId)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={{ margin: 0, justifyContent: 'flex-end', alignItems: 'flex-end' }}
    >
      <View className="bg-white h-full w-[85%] shadow-xl">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-bold">Your Cart ({totalItems})</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text className="mt-2 text-gray-500">Loading your cart...</Text>
          </View>
        )}
        
        {/* Cart Items */}
        {!loading && cartItemsArray.length > 0 ? (
          <FlatList
            data={cartItemsArray}
            renderItem={renderCartItem}
            keyExtractor={item => item.cartItemId.toString()}
            className="flex-1 px-4"
          />
        ) : !loading && (
          <View className="flex-1 items-center justify-center p-4">
            <Ionicons name="cart-outline" size={64} color="#ccc" />
            <Text className="text-gray-400 mt-4 text-center">
              Your cart is empty
            </Text>
          </View>
        )}
        
        {/* Footer with Total and Checkout */}
        {cartItemsArray.length > 0 && (
          <View className="p-4 border-t border-gray-200">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">Total:</Text>
              <Text className="font-bold text-lg">{totalAmount} AED</Text>
            </View>
            
            <View className="flex-row">
              <TouchableOpacity 
                className="flex-1 bg-red-500 py-3 rounded-md mr-2 items-center"
                onPress={clearCart}
              >
                <Text className="text-white font-medium">Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-blue-500 py-3 rounded-md items-center"
                onPress={() => {
                  onClose();
                  router.push('/checkout');
                }}
              >
                <Text className="text-white font-medium">Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

