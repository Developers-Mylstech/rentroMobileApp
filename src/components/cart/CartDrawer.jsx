import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

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
  
  const { isAuthenticated } = useAuthStore();
  
  // Fetch cart items when drawer opens
  useEffect(() => {
    if (isVisible) {
      console.log("Cart drawer opened, fetching items. Auth state:", isAuthenticated);
      fetchCartItems().catch(error => 
        console.error('Failed to fetch cart items:', error)
      );
    }
  }, [isVisible, fetchCartItems, isAuthenticated]);

  const handleDelete = (itemId) => {
    removeFromCart(itemId);
    fetchCartItems().catch(error => 
      console.error('Failed to fetch cart items:', error)
    );
  };
  
  // Handle checkout or login
  const handleCheckoutAction = () => {
    onClose();
    if (isAuthenticated) {
      router.push('/(tabs)/shop/checkout');
    } else {
      router.push('/(tabs)/(profile)');
    }
  };
  
  // Get cart items array from the cart object
  const cartItemsArray = cartItems?.items || [];
  
  // Render each cart item
  const renderCartItem = ({ item }) => {
    console.log("Rendering cart item:", item);
    
    // Fix image handling - ensure imageUrl is a string
    let imageUrl = 'https://via.placeholder.com/60'; // Default fallback image
    
    if (item.productImages && item.productImages.length > 0) {
      // Check if the image is an object with imageUrl property or a direct string
      if (typeof item.productImages[0] === 'string') {
        imageUrl = item.productImages[0];
      } else if (item.productImages[0] && typeof item.productImages[0].imageUrl === 'string') {
        imageUrl = item.productImages[0].imageUrl;
      }
    } else if (item.productDetail && item.productDetail.images && item.productDetail.images.length > 0) {
      // Handle API response structure
      if (typeof item.productDetail.images[0] === 'string') {
        imageUrl = item.productDetail.images[0];
      } else if (item.productDetail.images[0] && typeof item.productDetail.images[0].imageUrl === 'string') {
        imageUrl = item.productDetail.images[0].imageUrl;
      }
    }
    
    // Determine if this is a rent product
    const isRentProduct = item.productType === 'RENT';
    
    // Get the correct quantity - if productDetail.quantity is 0 or undefined, use 1 as default
    // For logged-in users, we should have a separate quantity field at the root level
    const quantity = item?.productDetail?.quantity || 1;
    
    // Get the correct price based on API response structure
    const itemPrice = parseFloat(item.price || 0);
    
    // Calculate item total price based on quantity
    const itemTotal = (itemPrice * quantity).toFixed(2);
    
    // Get product name from the appropriate location
    const productName = item.productName || (item.productDetail ? item.productDetail.name : 'Product');
    
    console.log(`Item details: ${productName}, quantity: ${quantity}, price: ${itemPrice}, total: ${itemTotal}`);
    
    return (
      <View className="flex-row items-center py-3 border-b border-gray-100">
        {/* Product Image */}
        <Image 
          source={{ uri: imageUrl }} 
          className="w-16 h-16 rounded-md mr-3"
        />
        
        {/* Product Details */}
        <View className="flex-1">
          <Text className="font-semibold text-gray-800" numberOfLines={1}>
            {productName}
          </Text>
          
          {isRentProduct ? (
            <Text className="text-xs text-blue-500 ">Rental</Text>
          ):
          (
            <Text className="text-xs text-blue-500 ">Sell</Text>
          )
          }
          
          <View className="flex-row items-center justify-between mt-1">
            <View>
              <Text className="font-bold text-gray-800">
                AED {itemPrice.toFixed(2)}
              </Text>
              <Text className="text-xs text-gray-500">
                Total: AED {itemTotal}
              </Text>
            </View>
            
            {/* Quantity Controls */}
            <View className="flex-row items-center">
              <TouchableOpacity 
                onPress={() => updateCartItemQuantity(item.cartItemId, quantity - 1)}
                disabled={quantity <= 1}
                className="p-1"
              >
                <Ionicons 
                  name="remove-circle" 
                  size={20} 
                  color={quantity <= 1 ? "#d1d5db" : "#3b82f6"} 
                />
              </TouchableOpacity>
              
              <Text className="mx-2 font-semibold">{quantity}</Text>
              
              <TouchableOpacity 
                onPress={() => updateCartItemQuantity(item.cartItemId, quantity + 1)}
                className="p-1"
              >
                <Ionicons name="add-circle" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Delete Button */}
        <TouchableOpacity 
          onPress={() => handleDelete(item.cartItemId)}
          className="px-2"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };
  
  // Calculate the total amount properly
  const calculateTotal = () => {
    if (!cartItemsArray || cartItemsArray.length === 0) return "0.00";
    
    const total = cartItemsArray.reduce((sum, item) => {
      if (item.isQuotationProduct) return sum;
      
      // Get the correct price and quantity
      const price = parseFloat(item.price || 0);
      const quantity = item.quantity || 1;
      
      const itemTotal = price * quantity;
      console.log(`Item ${item.productName || 'Product'}: price=${price}, quantity=${quantity}, total=${itemTotal}`);
      
      return sum + itemTotal;
    }, 0);
    
    console.log(`Calculated total: ${total.toFixed(2)}`);
    return total.toFixed(2);
  };
  
  const cartTotal = calculateTotal();
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ margin: 0, justifyContent: 'flex-end', alignItems: 'center' }}
    >
      <View className="bg-white h-[70%] w-[100%] shadow-xl rounded-t-2xl">
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
              <Text className="font-bold text-lg">AED {cartTotal}</Text>
            </View>
            
            <View className="flex-row">
              <TouchableOpacity 
                className="flex-1 bg-blue-500 py-3 rounded-md items-center"
                onPress={handleCheckoutAction}
              >
                <Text className="text-white font-medium">
                  {isAuthenticated ? "Checkout" : "Login to Checkout"}
                </Text>
              </TouchableOpacity>
            </View>
            
            {!isAuthenticated && (
              <Text className="text-center text-gray-500 text-xs mt-2">
                Login to save your cart and complete checkout
              </Text>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

