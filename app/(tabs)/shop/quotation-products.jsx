import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useProductStore } from '../../../src/store/productStore';
import ShopSkeleton from '../../../src/components/Skeleton/ShopSkeleton';
import RequestQuotationModal from '../../../src/components/formComponent/RequestQuotationModal';

export default function QuotationProducts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { 
    fetchProducts, 
    products, 
    isLoading, 
    error, 
    hasMore, 
    loadMore, 
    refreshProducts 
  } = useProductStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [quotationProducts, setQuotationProducts] = useState([]);

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // Use useFocusEffect instead of router.addListener
  useFocusEffect(
    useCallback(() => {
      // This ensures that when navigating back to this screen,
      // we always show quotation products
      loadProducts();
      setSearchQuery('');
      
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Load products with filter for quotation products
  const loadProducts = async () => {
    console.log("Loading quotation products...");
    try {
      // Fetch products with the quotation filter
      const fetchedProducts = await fetchProducts({
        isAvailableForRequestQuotation: true
      });
      
      console.log(`Fetched ${fetchedProducts?.length || 0} quotation products`);
      
      // Manually filter products to ensure we only show quotation products
      // Check for isAvailableForRequestQuotation inside the productFor object
      const filteredProducts = Array.isArray(fetchedProducts) 
        ? fetchedProducts.filter(p => p.productFor?.isAvailableForRequestQuotation === true)
        : [];
      
      console.log(`After manual filtering: ${filteredProducts.length} quotation products`);
      setQuotationProducts(filteredProducts);
    } catch (error) {
      console.error("Error loading quotation products:", error);
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      loadMore({
        isAvailableForRequestQuotation: true
      });
    }
  };

  // Handle product press
  const handleProductPress = (product) => {
    router.push(`/shop/${product.productId}`);
  };

  // Handle request quotation
  const handleRequestQuotation = (product) => {
    setSelectedProduct(product);
    setShowQuotationModal(true);
  };

  // Filter products based on search query
  const filteredProducts = quotationProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render product item
  const renderProductItem = ({ item }) => {
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
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
        
        <View className="flex-1 p-3">
          <Text className="font-medium text-gray-900 mb-1" numberOfLines={2}>{item.name}</Text>
          
          <View className="mt-1">
            <View className="bg-yellow-100 px-2 py-0.5 rounded-full self-start">
              <Text className="text-yellow-800 text-xs">Quotation Required</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-500 text-xs">{item.category?.name || 'Product'}</Text>
            
            <TouchableOpacity 
              className="bg-yellow-500 px-2 py-1 rounded"
              onPress={() => handleRequestQuotation(item)}
            >
              <Text className="text-white text-xs font-bold">Request Quote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Request Quotation Modal */}
      <RequestQuotationModal 
        visible={showQuotationModal} 
        onClose={() => setShowQuotationModal(false)}
        productId={selectedProduct?.productId}
        productName={selectedProduct?.name}
        productImage={selectedProduct?.images && selectedProduct.images.length > 0 
          ? selectedProduct.images[0].imageUrl 
          : null}
        productImageId={selectedProduct?.images && selectedProduct.images.length > 0 
          ? selectedProduct.images[0].imageId 
          : null}
        fromProductDetails={false}
      />

      {/* Debug info - remove in production */}
     

      {/* Loading and Error states */}
      {isLoading && quotationProducts.length === 0 ? (
        <ShopSkeleton />
      ) : (
        <>
          {/* Header with search */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <View className="flex-1 mx-3 flex-row items-center border border-gray-200 rounded-lg px-3 py-1">
              <TextInput 
                className="text-gray-400 flex-1" 
                placeholder='Search for quotation products...'
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#007AFF" />
            </View>
          </View>

          {/* Error state */}
          {error && (
            <View className="flex-1 items-center justify-center p-4">
              <Text className="text-red-500 mb-4">{error}</Text>
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={loadProducts}
              >
                <Text className="text-white font-bold">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Products list */}
          {!error && (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.productId.toString()}
              contentContainerStyle={{ padding: 12 }}
              ListFooterComponent={renderFooter}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#007AFF"]}
                />
              }
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-10">
                  <Text className="text-gray-500">No quotation products found</Text>
                </View>
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}









