import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useServiceStore from "../../../src/store/ServiceStore";
import OurServiceSingleSkeleton from "../../../src/components/Skeleton/OurServiceSingleSkeleton";

export default function SingleService() {
  const { serviceId } = useLocalSearchParams();
  const router = useRouter();
  const { getServiceById, selectedService, isLoading, error } = useServiceStore();
  
  useEffect(() => {
    if (serviceId) {
      getServiceById(serviceId);
    }
  }, [serviceId]);

  const handleViewProduct = (productId) => {
    router.push(`/shop/${productId}`);
  };

  // New function to handle booking a service
  const handleBookService = () => {
    if (selectedService && selectedService.relatedProducts && selectedService.relatedProducts.length > 0) {
      // Get the first related product to book a service for
      const product = selectedService.relatedProducts[0];
      
      // Determine service type based on service title using backend enum values
      let serviceType = 'OTS'; // Default to one-time service
      const title = selectedService.title.toLowerCase();
      
      if (title.includes('monthly') || title.includes('mmc')) {
        serviceType = 'MMC';
      } else if (title.includes('annual') || title.includes('amc')) {
        if (title.includes('basic')) {
          serviceType = 'AMC_BASIC';
        } else if (title.includes('gold') || title.includes('premium')) {
          serviceType = 'AMC_GOLD';
        } else {
          serviceType = 'AMC_BASIC'; // Default to basic if not specified
        }
      }
      
      // Navigate to checkout with service parameters
      router.push({
        pathname: '/shop/checkout',
        params: { 
          direct: 'true',
          productId: product.productId,
          productType: 'SERVICE', // This is just for our frontend routing
          quantity: 1,
          serviceType: serviceType, // This will be used as the actual productType in the API call
          serviceName: selectedService.title
        }
      });
    } else {
      // If no related products, show an alert or navigate to products
      Alert.alert(
        "No Products Available", 
        "There are no products available for this service. Please browse our products.",
        [
          { text: "OK", onPress: () => router.push("/shop") }
        ]
      );
    }
  };

  const renderRelatedProduct = ({ item }) => (
    <View className="mr-4 relative bg-white rounded-lg w-52 border border-gray-100 shadow-sm overflow-hidden">
      <Image
        source={{ uri: item.images?.[0]?.imageUrl || 'https://via.placeholder.com/150' }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-medium text-gray-900 mb-1" numberOfLines={1}>{item.name}</Text>
        <Text className="text-gray-500 text-xs mb-2" numberOfLines={2}>{item.description}</Text>
      </View>
      <TouchableOpacity 
        className="absolute rounded-full p-1 top-2 right-2 bg-blue-500 items-center"
        onPress={() => handleViewProduct(item.productId)}
      >
        <Ionicons name="eye-outline" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <OurServiceSingleSkeleton />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {selectedService ? (
          <View className="flex-1">
            <View className="h-72 w-full relative">
              <Image
                source={{ uri: selectedService.image?.imageUrl || 'https://via.placeholder.com/400x200' }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                className="absolute left-0 right-0 top-0 h-32"
              />
              
              {/* Add Book Now button */}
              <View className="absolute bottom-4 right-4">
                <TouchableOpacity
                  onPress={handleBookService}
                  className="bg-blue-500 px-6 py-3 rounded-lg shadow-md"
                >
                  <Text className="text-white font-bold">Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white rounded-t-3xl -mt-6 px-4 pt-8 pb-12">
              <Text className="text-heading-2 font-bold text-gray-900 mb-2">{selectedService?.title}</Text>
              <Text className="text-base text-gray-500 mb-4 leading-6">{selectedService?.shortDescription}</Text>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text className="text-gray-500 text-sm ml-1">4.8 (24 reviews)</Text>
                </View>
              </View>

              <View className="h-px bg-gray-200 my-6" />

              <Text className="font-bold text-heading-4 uppercase mb-3">Service Details</Text>
              <Text className="text-base text-gray-600 mb-6 leading-6">{selectedService?.detailedDescription}</Text>

              {selectedService?.features?.length > 0 && (
                <View className="mb-8">
                  <Text className="font-bold text-heading-4 uppercase mb-3">Key Features</Text>
                  {selectedService?.features?.map((feature, index) => (
                    <View key={index} className="flex-row mb-4">
                      <View className="mr-3 mt-1">
                        <Ionicons name="checkmark-circle" size={20} color="#4B6ED6" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-gray-900 mb-1">{feature?.title}</Text>
                        {feature.description && (
                          <Text className="text-sm text-gray-500 leading-5">{feature.description}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {selectedService?.relatedProducts?.length > 0 && (
                <View className="mb-6">
                  <Text className="font-bold text-heading-4 uppercase mb-3">Related Products</Text>
                  <FlatList
                    data={selectedService?.relatedProducts}
                    renderItem={renderRelatedProduct}
                    keyExtractor={(item,index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                  />
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-10">
            <MaterialIcons name="find-in-page" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-base mt-4 mb-6 text-center">
              Service information not available
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Browse Services</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
