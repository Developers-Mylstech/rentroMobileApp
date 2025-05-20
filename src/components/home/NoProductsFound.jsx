import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RequestQuotationModal from '../formComponent/RequestQuotationModal';

const NoProductsFound = () => {
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white rounded-lg shadow-sm my-4">
      {/* Icon instead of image */}
      <View className="w-24 h-24 mb-6 items-center justify-center bg-gray-100 rounded-full">
        <Ionicons name="search-outline" size={50} color="#9ca3af" />
      </View>
      
      {/* Message */}
      <Text className="text-xl font-bold text-center text-gray-800 mb-2">
        We couldn't find what you're looking for
      </Text>
      
      <Text className="text-base text-center text-gray-600 mb-6">
        Don't worry! Let us know what you need and we'll help you find it.
      </Text>
      
      {/* Request Quotation Button */}
      <TouchableOpacity 
        className="flex-row items-center bg-primary py-3 px-6 rounded-lg"
        onPress={() => setShowQuotationModal(true)}
      >
        <Ionicons name="document-text-outline" size={20} color="#fff" />
        <Text className="ml-2 text-white font-bold">Request Quotation</Text>
      </TouchableOpacity>
      
      {/* Quotation Request Modal */}
      <RequestQuotationModal 
        visible={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
      />
    </View>
  );
};

export default NoProductsFound;


