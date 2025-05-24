import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import useWishlistStore from '../../../src/store/wishlistStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import WishlistSkeleton from '../../../src/components/Skeleton/wishlistSkeleton'

export default function Wishlist() {
  const { wishlistItems, isLoading, error, fetchWishlist, removeFromWishlist } = useWishlistStore()
  const router = useRouter()

  useEffect(() => {
    fetchWishlist()
  }, [])

  // Function to get price display based on product type
  const getPriceDisplay = (product) => {
    if (!product.productFor) return { price: 'N/A', originalPrice: 'N/A' };
    
    // Check if product is for sell
    if (product.productFor.sell) {
      const sell = product.productFor.sell;
      return {
        price: `${sell.discountPrice || sell.actualPrice} AED`,
        originalPrice: sell.discountPrice ? `${sell.actualPrice} AED` : null
      };
    } 
    // Check if product is for rent
    else if (product.productFor.rent) {
      const rent = product.productFor.rent;
      return {
        price: `${rent.discountPrice || rent.monthlyPrice} AED/month`,
        originalPrice: rent.discountPrice ? `${rent.monthlyPrice} AED/month` : null
      };
    }
    
    return { price: 'N/A', originalPrice: 'N/A' };
  };

  const handleProductPress = (productId) => {
    router.push(`/shop/${productId}`)
  }

  const handleRemoveFromWishlist = async (wishlistItemId) => {
   const res =  await removeFromWishlist(wishlistItemId)
   if (res) {
    fetchWishlist()
   }
  }

  const renderWishlistItem = ({ item }) => {
    const { price, originalPrice } = getPriceDisplay(item)
    const imageUrl = item.images && item.images.length > 0 
      ? item.images[0].imageUrl 
      : 'https://via.placeholder.com/150'
    
    return (
      <TouchableOpacity 
        onPress={() => handleProductPress(item.productId)}
        activeOpacity={0.7}
        className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm"
      >
        <View className="flex-row  items-center ">
          {/* Image container */}
          <View className="w-28 h-28 p-2  justify-center items-center">
            <Image 
              source={{ uri: imageUrl }}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
          
          <View className="flex-1 p-4 justify-between">
            
            <View className="flex-row justify-between items-start">
              <Text numberOfLines={2} className="text-base font-medium w-3/5 text-gray-800" >
                {item.name}
              </Text>
              <TouchableOpacity 
                onPress={() => handleRemoveFromWishlist(item?.productId)}
                className="p-1 -mt-1 -mr-1"
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="heart" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>
            
            <Text 
              className="text-gray-500 text-sm my-1" 
              numberOfLines={2}
            >
              {item.description}
            </Text>

            
            <View className="flex-row items-baseline mt-1">
              <Text className="text-primary font-bold text-base">{price.slice(0, 6)}</Text>
              {originalPrice && (
                <Text className="text-gray-400 text-xs ml-2 line-through">{originalPrice.slice(0, 5)}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
    
      {isLoading ? (
        <WishlistSkeleton />
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity 
            onPress={fetchWishlist}
            className="bg-blue-500 px-5 py-2 rounded-full"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems?.products || []}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="heart-outline" size={70} color="#E5E7EB" />
              <Text className="text-gray-500 mt-6 text-lg text-center">Your wishlist is empty</Text>
              <TouchableOpacity 
                onPress={() => router.push('/shop')}
                className="mt-6 bg-blue-500 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-medium">Browse Products</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}
