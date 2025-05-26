import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Switch,
  ActivityIndicator,
  Dimensions,
  FlatList

} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '../../../src/store/productStore';
import  useCartStore  from '../../../src/store/cartStore';
import useCheckoutStore from "../../../src/store/checkoutStore";
import CartDrawer from '../../../src/components/cart/CartDrawer';
import ProductDetailsSkeleton from '../../../src/components/Skeleton/ProductDetailsSkeleton';
import CartNotificationDialog from '../../../src/components/common/CartNotificationDialog';
import RequestQuotationModal from '../../../src/components/formComponent/RequestQuotationModal';
import useWishlistStore from '../../../src/store/wishlistStore';
import { useAuthStore } from '../../../src/store/authStore';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToWishlist , removeFromWishlist,wishlistItems ,isLoading: wishlistLoading,fetchWishlist } = useWishlistStore();
  const productId = params.product;
  const { fetchProductById, currentProduct, isLoading, error, clearCurrentProduct } = useProductStore();
  const { 
    addToCart, 
    cartItems, 
    isCartOpen, 
    openCart, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartItemCount 
  } = useCartStore();
  const { directCheckout } = useCheckoutStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('rent');
  const [selectedAmcPlan, setSelectedAmcPlan] = useState('basic'); // 'basic' or 'gold'
  const [productQuantity, setProductQuantity] = useState(1); // Add quantity state
  const [localLoading, setLocalLoading] = useState(true);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Dialog state should be inside the component
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: '',
    message: '',
    type: 'success',
    actionText: 'OK',
    onAction: null,
    secondaryActionText: null,
    onSecondaryAction: null
  });

  // Function to show dialog
  const showDialog = (props) => {
    setDialogProps(props);
    setDialogVisible(true);
  };
  
  // Load product data
  const loadProductData = useCallback(async () => {
    if (productId) {
      setLocalLoading(true);
      await fetchProductById(productId);
      setLocalLoading(false);
    }
  }, [productId, fetchProductById]);
  
  // Initial load
  useEffect(() => {
    loadProductData();
    
    // Clear current product when component unmounts
    return () => {
      clearCurrentProduct();
    };
  }, [loadProductData]);

  const handleImageScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveImageIndex(index);
  };

  // Function to increase quantity
  const increaseQuantity = () => {
    setProductQuantity(prev => prev + 1);
  };

  // Function to decrease quantity
  const decreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(prev => prev - 1);
    }
  };

  // Function to check if product is a quotation product
  const isQuotationProduct = () => {
    return currentProduct?.productFor?.isAvailableForRequestQuotation === true;
  };

  // Function to get price display based on active tab
  const getPriceDisplay = () => {
    // If it's a quotation product, don't show price
    if (isQuotationProduct()) return { price: null, originalPrice: null };
    
    if (!currentProduct?.productFor) return { price: 'N/A', originalPrice: null };
    
    if (activeTab === 'sell' && currentProduct.productFor.sell) {
      const sell = currentProduct.productFor.sell;
      return {
        price: `${sell.discountPrice || sell.actualPrice} AED`,
        originalPrice: sell.discountPrice ? `${sell.actualPrice} AED` : null
      };
    } 
    else if (activeTab === 'rent' && currentProduct.productFor.rent) {
      const rent = currentProduct.productFor.rent;
      return {
        price: `${rent.discountPrice || rent.monthlyPrice} AED/month`,
        originalPrice: rent.discountPrice ? `${rent.monthlyPrice} AED/month` : null
      };
    }
    else if (activeTab === 'service' && currentProduct.productFor.service) {
      // For service, we'll show the OTS price as default
      const service = currentProduct.productFor.service;
      if (service.ots) {
        return {
          price: `${service.ots.price} AED`,
          originalPrice: null
        };
      }
    }
    
    return { price: 'N/A', originalPrice: null };
  };

  // Function to handle request quotation
  const handleRequestQuotation = () => {
    if (currentProduct) {
      console.log("Selected product for quotation:", currentProduct);
      console.log("Product images:", currentProduct.images);
      
      // Get the first image if available
      const productImage = currentProduct.images && currentProduct.images.length > 0 
        ? currentProduct.images[0].imageUrl 
        : null;
      
      const productImageId = currentProduct.images && currentProduct.images.length > 0 
        ? currentProduct.images[0].imageId 
        : null;
      
      console.log("Product image URL to pass:", productImage);
      console.log("Product image ID to pass:", productImageId);
      
      setSelectedProduct(currentProduct);
      setShowQuotationModal(true);
    }
  };

  // Get benefits based on active tab
  const getBenefits = () => {
    if (!currentProduct?.productFor) return [];
    
    if (activeTab === 'sell' && currentProduct.productFor.sell) {
      return currentProduct.productFor.sell.benefits || [];
    } 
    else if (activeTab === 'rent' && currentProduct.productFor.rent) {
      return currentProduct.productFor.rent.benefits || [];
    }
    else if (activeTab === 'service' && currentProduct.productFor.service) {
      // For service, we'll show the OTS benefits as default
      const service = currentProduct.productFor.service;
      if (service.ots) {
        return service.ots.benefits || [];
      }
    }
    
    return [];
  };

  // Check if tab should be shown (always true now, we'll disable instead of hide)
  const shouldShowTab = (tabName) => {
    if (!currentProduct?.productFor) return false;
    
    if (tabName === 'sell') return !!currentProduct.productFor.sell;
    if (tabName === 'rent') return !!currentProduct.productFor.rent;
    if (tabName === 'service') return !!currentProduct.productFor.service;
    
    return false;
  };

  useEffect(() => {
    fetchWishlist();

    if (currentProduct?.productFor) {
      if (currentProduct.productFor.rent) setActiveTab('rent');
      else if (currentProduct.productFor.sell) setActiveTab('sell');
      else if (currentProduct.productFor.service) setActiveTab('service');
    }
  }, [currentProduct]);

useEffect(() => {
    if (wishlistItems?.products) {
      const isWishlisted = wishlistItems?.products?.some(product => product?.productId === currentProduct?.productId);
      console.log('isWishlisted', isWishlisted);
      setIsWishlisted(isWishlisted);
    }
  }, [wishlistItems, currentProduct]);

  const renderServiceCard = (serviceType, title, price, benefits) => {
    // Check if service is available
    const isAvailable = !!price;
    
    // For AMC cards, we need to check if it's the selected plan
    const isAmc = serviceType === 'amcBasic' || serviceType === 'amcGold';
    const isSelectedAmc = (serviceType === 'amcBasic' && selectedAmcPlan === 'basic') || 
                          (serviceType === 'amcGold' && selectedAmcPlan === 'gold');
    
    return (
      <View 
        className={`border rounded-lg p-4 mb-4 ${
          isAvailable 
            ? (isAmc 
                ? (isSelectedAmc ? 'border-blue-500 bg-blue-50' : 'border-gray-200') 
                : 'border-blue-500 bg-blue-50/30')
            : 'border-gray-200 bg-gray-50 opacity-70'
        }`}
      >
        {/* Service Type Badge */}
        <View className="absolute -top-2 right-4 bg-blue-500 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">{serviceType === 'ots' ? 'One-Time' : serviceType === 'mmc' ? 'Monthly' : 'Annual'}</Text>
        </View>

        {/* Title and Price */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text className="font-bold text-lg text-gray-800">
            {title}
          </Text>
          <Text className="font-bold text-lg text-blue-600">
            {isAvailable ? `${price} AED` : 'Unavailable'}
          </Text>
        </View>
        
        {/* Benefits */}
        {benefits && benefits.length > 0 && (
          <View className="mt-2 bg-white p-2 rounded-lg">
            {benefits.map((benefit, index) => (
              <View key={index} className="flex-row items-center mt-1">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" className="mr-2" />
                <Text className={`${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Book Now Button */}
        <TouchableOpacity 
          className={`rounded-md items-center justify-center py-3 mt-4 ${
            (isAvailable && (!isAmc || isSelectedAmc)) 
              ? 'bg-blue-500' 
              : 'bg-gray-300'
          }`}
          onPress={() => {
            if (isAvailable && (!isAmc || isSelectedAmc)) {
              handleBookService(title, isAmc, selectedAmcPlan);
            }
          }}
          disabled={!isAvailable || (isAmc && !isSelectedAmc)}
        >
          <Text className="text-white font-bold">
            {isAvailable ? 'Book Now' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render AMC switch with improved design
  const renderAmcSwitch = () => {
    const hasAmcBasic = !!currentProduct?.productFor?.service?.amcBasic?.price;
    const hasAmcGold = !!currentProduct?.productFor?.service?.amcGold?.price;
    
    // If neither AMC option is available, still show the switch but disabled
    if (!hasAmcBasic && !hasAmcGold) {
      return (
        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="font-bold text-lg mb-2 text-center">Annual Maintenance Contract</Text>
          <Text className="text-gray-500 text-center mb-2">No AMC plans available for this product</Text>
          <View className="flex-row justify-center items-center opacity-50">
            <Text className="mr-2 text-gray-400">Basic</Text>
            <Switch
              trackColor={{ false: "#cccccc", true: "#cccccc" }}
              thumbColor="#ffffff"
              disabled={true}
              value={false}
            />
            <Text className="ml-2 text-gray-400">Gold</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
        <Text className="font-bold text-lg mb-2 text-center text-blue-800">Annual Maintenance Contract</Text>
        <View className="flex-row justify-center items-center">
          <Text className={`mr-2 ${selectedAmcPlan === 'basic' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
            Basic
          </Text>
          <Switch
            trackColor={{ false: "#3b82f6", true: "#3b82f6" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#3b82f6"
            onValueChange={() => setSelectedAmcPlan(selectedAmcPlan === 'basic' ? 'gold' : 'basic')}
            value={selectedAmcPlan === 'gold'}
            disabled={!hasAmcBasic && !hasAmcGold}
          />
          <Text className={`ml-2 ${selectedAmcPlan === 'gold' ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
            Gold
          </Text>
        </View>
      </View>
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ProductDetailsSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 mb-4">{error}</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={loadProductData}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentProduct) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  const { price, originalPrice } = getPriceDisplay();
  const benefits = getBenefits();
  const images = currentProduct.images || [];
  const specifications = currentProduct.specifications || [];
  const keyFeatures = currentProduct.keyFeatures || [];
  const service = currentProduct.productFor?.service;
  const cartItemCount = getCartItemCount();

  const getPriceInfo = () => {
    if (!currentProduct?.productFor) return { isAvailable: false };
    
    if (activeTab === 'sell' && currentProduct.productFor.sell) {
      return { isAvailable: true };
    } 
    else if (activeTab === 'rent' && currentProduct.productFor.rent) {
      return { isAvailable: true };
    }
    else if (activeTab === 'service' && currentProduct.productFor.service) {
      return { isAvailable: true };
    }
    
    return { isAvailable: false };
  };

  const priceInfo = getPriceInfo();

  // Function to add product to cart with correct type
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/(profile)');
      return;
    }
    
    if (priceInfo.isAvailable && currentProduct) {
      // Determine product type based on active tab
      const productType = activeTab === 'rent' ? 'RENT' : 
                          activeTab === 'sell' ? 'SELL' : 
                          activeTab === 'service' ? 'SERVICE' : 'SELL';
      
      // Show loading dialog
      showDialog({
        title: 'Adding to Cart',
        message: 'Please wait while we add this item to your cart...',
        type: 'loading'
      });
      
      // Create simplified payload for cart API
      const payload = {
        productId: currentProduct.productId,
        productType: productType,
        quantity: productQuantity || 1
      };
      
      // If it's a rent product, add rentPeriod
      // if (productType === 'RENT' && currentProduct.productFor?.rent) {
      //   payload.rentPeriod = currentProduct.productFor.rent.rentPeriod || 30; // Default to 30 days
      // }
      
      // // If it's a sell product, rename quantity to sellQuantity if needed
      // if (productType === 'SELL') {
      //   payload.sellQuantity = payload.quantity;
      //   // Keep quantity for the API
      // }
      
      // If it's a service, add service type
      if (productType === 'SERVICE') {
        payload.serviceType = activeServiceType || 'ots';
      }
      
      console.log('Adding to cart with payload:', payload);
      
      // Add to cart with the payload
      addToCart(payload)
        .then(() => {
          // Show success dialog
          showDialog({
            title: 'Added to Cart',
            message: `${currentProduct.name} has been added to your cart`,
            type: 'success',
            actionText: 'Continue Shopping'
          });
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
          // Show error dialog with more detailed error message
          const errorMessage = error.response?.data?.message || 
                              error.message || 
                              'Please try again later';
          
          showDialog({
            title: 'Failed to Add',
            message: errorMessage,
            type: 'error',
            actionText: 'Try Again',
            onAction: () => handleAddToCart(),
            secondaryActionText: 'Cancel'
          });
        });
    }
  };

  // Function to buy/rent now
  const handleBuyRentNow = () => {
    if (!isAuthenticated) {
      router.push('/(profile)');
      return;
    }
    
    handleBuyNow();
  };

  // Function to book service
  const handleBookService = (title, isAmc, selectedAmcPlan) => {
    if (!isAuthenticated) {
      router.push('/(profile)');
      return;
    }
    
    // Determine the correct service type based on backend enum values
    let serviceType = 'OTS'; // Default to one-time service
    
    if (isAmc) {
      serviceType = selectedAmcPlan === 'basic' ? 'AMC_BASIC' : 'AMC_GOLD';
    } else {
      // Check if this is an MMC service
      if (title.toLowerCase().includes('monthly') || title.toLowerCase().includes('mmc')) {
        serviceType = 'MMC';
      }
    }
    
    // Navigate directly to checkout with service parameters
    router.push({
      pathname: '/shop/checkout',
      params: { 
        direct: 'true',
        productId: currentProduct.productId,
        productType: 'SERVICE', // This is just for our frontend routing
        quantity: 1,
        serviceType: serviceType, // This will be used as the actual productType in the API call
        serviceName: title
      }
    });
  };

  // Function to handle Buy Now
  const handleBuyNow = () => {
    if (priceInfo.isAvailable && currentProduct) {
      // Determine product type based on active tab
      const productType = activeTab === 'rent' ? 'RENT' : 
                        activeTab === 'sell' ? 'SELL' : 
                        activeTab === 'service' ? 'SERVICE' : 'SELL';
      
      // Navigate to checkout with product info as params
      router.push({
        pathname: '/shop/checkout',
        params: { 
          direct: 'true',
          productId: currentProduct.productId,
          productType: productType,
          quantity: productQuantity || 1
        }
      });
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/(profile)');
      return;
    }

    if(isWishlisted) {
      const res = await removeFromWishlist(currentProduct?.productId);
      if (res?.status === 200) {
        setIsWishlisted(false);
        console.log('Product removed from wishlist');
      }
      return;
    }else{
      const res = await addToWishlist(currentProduct.productId);
      if (res?.status === 200) {
        setIsWishlisted(true);
        console.log('Product added to wishlist');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Request Quotation Modal */}
      <RequestQuotationModal 
        visible={showQuotationModal} 
        onClose={() => setShowQuotationModal(false)}
        productId={currentProduct?.productId}
        productName={currentProduct?.name}
        productImage={currentProduct?.images && currentProduct.images.length > 0 
          ? currentProduct.images[0].imageUrl 
          : null}
        productImageId={currentProduct?.images && currentProduct.images.length > 0 
          ? currentProduct.images[0].imageId 
          : null}
        fromProductDetails={true}
      />

      {/* Cart Drawer */}
      <CartDrawer
        visible={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onCheckout={() => {
          closeCart();
          router.push('/shop/checkout');
        }}
      />
      
      {/* Header with back button */}
      <View className="flex-row items-center justify-end px-4 py-3 border-b border-gray-200">
      
       
        <TouchableOpacity onPress={openCart} className="relative">
          <Ionicons name="cart-outline" size={24} color="black" />
          {cartItemCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className={`flex-1 ${activeTab  === 'service' || currentProduct?.productFor?.isAvailableForRequestQuotation === true ? 'mb-0' : 'mb-16'}`}>
        {/* Product Image Carousel */}
        <View className="relative bg-white">
          <FlatList
            data={images.length > 0 ? images.map(img => img.imageUrl) : ['https://via.placeholder.com/400']}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={width}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width, height: 300 }} className="items-center justify-center p-4">
                <Image 
                  source={{ uri: item }} 
                  style={{ width: width - 80, height: 250 }}
                  resizeMode="contain"
                />
              </View>
            )}
          />
          
          
          <TouchableOpacity onPress={handleAddToWishlist} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow z-10">
            {wishlistLoading ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <AntDesign name={isWishlisted ? "heart" : "hearto"} size={24} color={isWishlisted ? '#e11d48' : '#999'} />
            )}
          </TouchableOpacity>
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center my-2">
            { images.length > 1 &&  images.map((_, index) => (
              <View 
                key={index} 
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`} 
              />
            ))}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="bg-blue-50 rounded-t-[50px]">
          <View className={`flex-row justify-center py-3  w-[100%] ${currentProduct?.productFor?.isAvailableForRequestQuotation === true? 'border-none' : ' border-b border-gray-200'}`}>
            {shouldShowTab('rent') && (
              <TouchableOpacity onPress={() => setActiveTab('rent')} className="items-center">
                <Text className={`${activeTab === 'rent' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 border-b-2 border-gray-400'} font-medium px-10 py-3`}>
                  Rent
                </Text>
              </TouchableOpacity>
            )}
            
            {shouldShowTab('sell') && (
              <TouchableOpacity onPress={() => setActiveTab('sell')} className="items-center">
                <Text className={`${activeTab === 'sell' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 border-b-2 border-gray-400'} font-medium px-10 py-3`}>
                  Sell
                </Text>
              </TouchableOpacity>
            )}
            
            {shouldShowTab('service') && (
              <TouchableOpacity onPress={() => setActiveTab('service')} className="items-center">
                <Text className={`${activeTab === 'service' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 border-b-2 border-gray-400'} font-medium px-10 py-3`}>
                  Service
                </Text>
              </TouchableOpacity>
            )}
          </View>
        
          {/* Product Info */}
          <View className="p-4">
            <Text className="font-bold text-xl text-gray-800">{currentProduct.name}</Text>
             
            <View className="flex-row items-start mt-1 gap-2">
              <Text className="text-gray-500  pr-2 border-r border-gray-200">
                {currentProduct.category?.name || 'Purifier'}
              </Text>
              {/* <View className="flex-row flex-wrap gap-1">
                {currentProduct.tagNKeywords && currentProduct.tagNKeywords.map((tag, index) => (
                  <Text key={index} className="text-white text-sm font-bold p-[1.5px] bg-blue-500 rounded-md">
                    #{tag}
                  </Text>
                ))}
              </View> */}
              <View className="flex-row items-center ">
              <Text className="text-blue-500 ">
                {currentProduct.brand?.name || 'Brand'}
              </Text>
            </View>
            </View>
            
   
            
            
            {/* Price and Quantity Section */}
            {!isQuotationProduct() ? (
              // Regular product with price and quantity
              <View className="mt-3 flex-row justify-between items-center">
                <View>
                  <Text className="font-bold text-xl text-gray-800">{price}</Text>
                  {originalPrice && (
                    <Text className="text-gray-400 text-sm line-through">{originalPrice}</Text>
                  )}
                </View>
                
                {/* Quantity Selector */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-2 py-1">
                  <TouchableOpacity 
                    onPress={decreaseQuantity}
                    disabled={productQuantity <= 1}
                    className="p-1"
                  >
                    <Ionicons 
                      name="remove-circle" 
                      size={24} 
                      color={productQuantity <= 1 ? "#d1d5db" : "#3b82f6"} 
                    />
                  </TouchableOpacity>
                  
                  <Text className="mx-3 font-semibold text-lg">{productQuantity}</Text>
                  
                  <TouchableOpacity 
                    onPress={increaseQuantity}
                    className="p-1"
                  >
                    <Ionicons name="add-circle" size={24} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Quotation product with request quotation button
              <View className="mt-3">
                <View className="bg-blue-100 px-3 py-2 rounded-lg mb-3">
                  <Text className="text-blue-800 text-sm">
                    This product requires a quotation. Please click the button below to request a price quote.
                  </Text>
                </View>
                
                <TouchableOpacity 
                  className="bg-blue-500 py-3 rounded-lg items-center"
                  onPress={handleRequestQuotation}
                >
                  <Text className="text-white font-bold">Request Quotation</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Service Cards - Only show for Service tab */}
            {activeTab === 'service' && service && (
              <View className="mt-3">
                <Text className="font-bold text-xl text-gray-800 mb-3">Available Services</Text>
                
                {/* OTS Service Card */}
                {renderServiceCard(
                  'ots',
                  'One-Time Service',
                  service.ots?.price,
                  service.ots?.benefits
                )}
                
                {/* MMC Service Card */}
                {renderServiceCard(
                  'mmc',
                  'Monthly Maintenance Contract',
                  service.mmc?.price,
                  service.mmc?.benefits
                )}
                
                {/* AMC Switch */}
                {renderAmcSwitch()}
                
                {/* AMC Basic Card */}
                {selectedAmcPlan === 'basic' && renderServiceCard(
                  'amcBasic',
                  'Annual Maintenance - Basic',
                  service.amcBasic?.price,
                  service.amcBasic?.benefits
                )}
                
                {/* AMC Gold Card */}
                {selectedAmcPlan === 'gold' && renderServiceCard(
                  'amcGold',
                  'Annual Maintenance - Gold',
                  service.amcGold?.price,
                  service.amcGold?.benefits
                )}
              </View>
            )}
            
            {/* Description */}
            <View className="mt-4">
              <Text className="font-bold text-lg text-gray-800 my-2">Description</Text>
              <Text className="text-gray-600 mt-1">{currentProduct.description}</Text>
              {currentProduct.longDescription && (
                <Text className="text-gray-600 mt-1">{currentProduct.longDescription}</Text>
              )}
            </View>
            
            {/* Key Features */}
            {keyFeatures.length > 0 && (
              <View className="mt-4">
                <Text className="font-bold text-lg text-gray-800 my-2">Key Features</Text>
                {keyFeatures.map((feature, index) => (
                  <View key={index} className="flex-row items-center mt-1">
                    <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                    <Text className="text-gray-600">{feature}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Benefits - Only show for Rent and Sell tabs */}
            {activeTab !== 'service' && benefits.length > 0 && (
              <View className="mt-4">
                <Text className="font-bold text-lg text-gray-800 my-2">Benefits</Text>
                {benefits.map((benefit, index) => (
                  <View key={index} className="flex-row items-center mt-1 p-2 rounded-lg my-1 border border-blue-400">
                    <Ionicons name="checkmark" size={14} color="blue" className="mr-2" />
                    <Text className="text-blue-600 text-sm font-semibold">{benefit}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Specifications */}
            {specifications.length > 0 && (
              <View className="mt-4">
                <Text className="font-bold text-lg text-gray-800 my-2">Specifications</Text>
                {specifications.map((spec, index) => (
                  <View key={index} className="flex-row items-center mt-1 border-b border-gray-200 py-2">
                    <Text className="text-gray-600">{spec.name}: {spec.value}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Sticky bottom action buttons - Only show for Rent and Sell tabs if not a quotation product */}
      {activeTab !== 'service' && !isQuotationProduct() && (
        <View className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <TouchableOpacity 
            className={`flex-1 border rounded-md mr-2 items-center justify-center py-3 ${
              priceInfo.isAvailable 
                ? 'bg-white border-blue-500' 
                : 'bg-gray-100 border-gray-300'
            }`}
            onPress={handleAddToCart}
            disabled={!priceInfo.isAvailable || dialogVisible}
          >
            <Text className={`font-bold ${priceInfo.isAvailable ? 'text-blue-500' : 'text-gray-400'}`}>
              Add To Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 rounded-md ml-2 items-center justify-center py-3 ${
              priceInfo.isAvailable ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={handleBuyRentNow}
            disabled={!priceInfo.isAvailable || dialogVisible}
          >
            <Text className="text-white font-bold">
              {activeTab === 'rent' ? 'Rent Now' : 'Buy Now'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cart Notification Dialog */}
      <CartNotificationDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        {...dialogProps}
      />
    </SafeAreaView>
  );
}

