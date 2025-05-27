import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useProductStore } from '../../../src/store/productStore';
import useCartStore from '../../../src/store/cartStore';
import CartDrawer from '../../../src/components/cart/CartDrawer';
import ShopSkeleton from '../../../src/components/Skeleton/ShopSkeleton';
import SearchBar from '../../../src/components/home/SearchBar';

export default function Shop() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { fetchProducts, products, error } = useProductStore();
  const {
    cartItems,
    isCartOpen,
    openCart,
    closeCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    totalItems,
    fetchCartItems
  } = useCartStore();

  useEffect(() => {

    fetchProducts();
    fetchCartItems();
  }, []);

  const handleProductPress = (product) => {
    console.log(`Navigating to product ${product.productId}`);
    router.push(`/shop/${product.productId}`);
  };

  const handleSearchItemPress = (product) => {
    setSearchQuery('');
    handleProductPress(product);
  };

  // Function to get price display  on product type
  const getPriceDisplay = (product) => {
    if (!product.productFor) return { price: 'N/A', originalPrice: 'N/A' };

    // Check if product is for sell
    if (product.productFor.sell) {
      const sell = product.productFor.sell;
      return {
        price: `${sell.discountPrice.toFixed(2) || sell.actualPrice.toFixed(2)} AED`,
        originalPrice: sell.discountPrice.toFixed(2) ? `${sell.actualPrice.toFixed(2)} AED` : null
      };
    }
    // Check if product is for rent
    else if (product.productFor.rent) {
      const rent = product.productFor.rent;
      return {
        price: `${rent.discountPrice.toFixed(2) || rent.monthlyPrice.toFixed(2)} AED/month`,
        originalPrice: rent.discountPrice.toFixed(2) ? `${rent.monthlyPrice.toFixed(2)} AED/month` : null
      };
    }

    return { price: 'N/A', originalPrice: 'N/A' };
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

  return (
    <SafeAreaView className="flex-1 bg-white">
     
      <CartDrawer
        isVisible={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onClearAll={clearCart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateCartItemQuantity}
      />


      {products.length <= 0 ? (
        <ShopSkeleton />
      ) : (
        <>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <View className="flex-1">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onItemPress={handleSearchItemPress}
                placeholder="Search for products..."
              />
            </View>
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <TouchableOpacity onPress={openCart} className="relative">
                <Ionicons name="cart-outline" size={24} color="black" />
                {totalItems > 0 && (
                  <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">{totalItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-red-500 mb-4">{error}</Text>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={fetchProducts}
              >
                <Text className="text-white font-bold">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!error && (
            <FlatList
              className="flex-1 mt-4"
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.productId.toString()}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-gray-500">No products found</Text>
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
