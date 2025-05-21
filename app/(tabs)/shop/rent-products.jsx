import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useProductStore } from '../../../src/store/productStore';
import { useCartStore } from '../../../src/store/cartStore';
import CartDrawer from '../../../src/components/cart/CartDrawer';
import ShopSkeleton from '../../../src/components/Skeleton/ShopSkeleton';

export default function RentProducts() {
  const router = useRouter();
  const { fetchRentProducts, getRentProducts, isLoading, error } = useProductStore();
  const { 
    cartItems, 
    isCartOpen, 
    openCart, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartItemCount 
  } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchRentProducts();
  }, []);
  
  // Get rent products from store and filter when they change
  useEffect(() => {
    const rentProducts = getRentProducts();
    if (searchQuery.trim() === '') {
      setFilteredProducts(rentProducts);
    } else {
      const filtered = rentProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, getRentProducts()]);

  // Function to handle product press - navigate with product ID
  const handleProductPress = (product) => {
    router.push(`/shop/${product.productId}`);
  };

  // Function to get price display for rent products
  const getPriceDisplay = (product) => {
    if (!product.productFor?.rent) return { price: 'N/A', originalPrice: 'N/A' };
    
    const rent = product.productFor.rent;
    return {
      price: `${rent.discountPrice || rent.monthlyPrice} AED/month`,
      originalPrice: rent.discountPrice ? `${rent.monthlyPrice} AED/month` : null
    };
  };

  const renderProductItem = ({ item }) => {
    const { price, originalPrice } = getPriceDisplay(item);
    const imageUrl = item.images && item.images.length > 0 
      ? item.images[0].imageUrl 
      : 'https://via.placeholder.com/150';
    
    return (
      <TouchableOpacity 
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
        className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden"
      >
        <View className="flex justify-center items-center">
          <Image 
            source={{ uri: imageUrl }}
            className="w-24 h-24 "
            resizeMode="contain"
          />
        </View>
        
        <View className="flex-1 p-3 justify-center relative">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-base ">{item.name}</Text>
          </View>
          
          <View className="flex-row items-center mt-0.5 gap-2">
            <Text className="text-blue-500 text-sm pr-1 border-r border-gray-200">
              {item.brand?.name || "Brand"}
            </Text>
            <Text className="text-gray-500 rounded-lg text-sm">
              {item.category?.name || "Category"}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <Text className="font-bold text-base">{price}</Text>
            {originalPrice && (
              <Text className="text-gray-400 text-xs ml-2 line-through">{originalPrice}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const cartItemCount = getCartItemCount();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Cart Drawer */}
      <CartDrawer 
        isVisible={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onClearAll={clearCart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      
      {/* Loading and Error states */}
      {isLoading ? (
        <ShopSkeleton />
      ) : (
        <>
          {/* Header with search and cart */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <View className="flex-1 mx-3 flex-row items-center border border-gray-200 rounded-lg px-3 py-1">
              <TextInput 
                className="text-gray-400 flex-1" 
                placeholder='Search for rent products...'
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#007AFF" />
            </View>
            
            <TouchableOpacity onPress={openCart} className="relative">
              <Ionicons name="cart-outline" size={24} color="black" />
              {cartItemCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-red-500 mb-4">{error}</Text>
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={fetchRentProducts}
              >
                <Text className="text-white font-bold">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product List */}
          {!error && (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.productId.toString()}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-gray-500">No rent products found</Text>
                </View>
              }
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}