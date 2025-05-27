import { View, Text } from 'react-native'
import React from 'react'
import RequestQuotationModal from '../../../src/components/formComponent/RequestQuotationModal'
import { useLocalSearchParams } from 'expo-router'

export default function RequestQoutation() {
  const params = useLocalSearchParams();
  
  // Extract product details from params
  const productId = params.productId;
  const productName = params.productName;
  const productImage = params.productImage;
  const productImageId = params.productImageId;
  const fromProductDetails = params.fromProductDetails === 'true';

  return (
    <RequestQuotationModal
      visible={true}
      onClose={() => {}}
      productId={productId}
      productName={productName}
      productImage={productImage}
      productImageId={productImageId}
      fromProductDetails={fromProductDetails}
    />
  )
}
