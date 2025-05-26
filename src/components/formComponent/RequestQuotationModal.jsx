

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';
import Clipboard from '@react-native-clipboard/clipboard';

const RequestQuotationModal = ({ 
  visible, 
  onClose, 
  productId, 
  productName, 
  productImage,
  productImageId,
  fromProductDetails = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [quoteRequestId, setQuoteRequestId] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState(productImage || null);

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      mobile: '',
      companyName: '',
      locationStreet: '',
      locationArea: '',
      locationBuilding: '',
      locationVillaNo: '',
      locationCountry: 'Dubai',
      locationGmapLink: '',
    },
  });

  // Set product image when productImage prop changes
  useEffect(() => {
    if (productImage) {
      setProductImageUrl(productImage);
      console.log("Product image set:", productImage);
      console.log("Product image ID:", productImageId);
    } else {
      console.log("No product image provided");
    }
  }, [productImage, productImageId]);

  const selectedCountry = watch('locationCountry');

  const emiratesOptions = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const selectCountry = (country) => {
    setValue('locationCountry', country);
    setShowCountryDropdown(false);
  };

  const copyToClipboard = () => {
    Clipboard.setString(quoteRequestId);
    Alert.alert('Copied', 'Request ID copied to clipboard!');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitStatus(null);
    setStatusMessage('');
    try {
      let imageData = null;
      
      // If user selected an image, upload it
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });

        const uploadResponse = await axiosInstance.post('/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadResponse?.data?.fileUrl) {
          imageData = {
            imageUrl: uploadResponse.data.fileUrl,
            imageId: uploadResponse.data.imageId || null
          };
        }
      } 
      // If no user-selected image but we have a product image, use that
      else if (productImageUrl) {
        // For product images, we use the imageId that was passed as a prop
        imageData = {
          imageUrl: productImageUrl,
          imageId: productImageId || null
        };
      }

      // Log the image data for debugging
      console.log("Image data before payload:", imageData);
      console.log("Product image URL:", productImageUrl);
      console.log("Product image ID:", productImageId);

      // Always provide a default image if none is available
      if (!imageData) {
        imageData = { 
          imageUrl: "https://via.placeholder.com/150", 
          imageId: 1 
        };
      }

      const payload = {
        name: data.name,
        mobile: data.mobile,
        companyName: data.companyName,
        location: {
          street: data.locationStreet,
          area: data.locationArea,
          building: data.locationBuilding,
          villaNo: data.locationVillaNo,
          country: data.locationCountry,
          gmapLink: data.locationGmapLink,
        },
        image: imageData,
        productId: productId || null,
        productName: productName || null,
        status: "WAITING_FOR_APPROVAL" // Using a valid enum value from the error message
      };

      // Log the final payload for debugging
      console.log("Final payload:", JSON.stringify(payload));

      const response = await axiosInstance.post('/request-quotations', payload);
      setQuoteRequestId(response?.data?.requestQuotationCode);
      setSubmitStatus('success');
      setStatusMessage('Thank you for your query!');
      setShowSuccessDialog(true);
      reset();
      removeImage();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      setSubmitStatus('error');
      setStatusMessage(
        error.response?.data?.message || 'Failed to submit. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    onClose();
  };

  // Success dialog component
  const SuccessDialog = () => (
    <View className="absolute inset-0 bg-black/50 justify-center items-center">
      <View className="bg-white rounded-xl p-6 w-[85%] max-w-md">
        <View className="items-center mb-4">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
            <Text className="text-green-600 text-4xl">✓</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">{statusMessage}</Text>
          <Text className="text-gray-600 text-center mt-2">
            Our team will get back to you within 24 hours.
          </Text>
        </View>
        
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-gray-600 mb-1">Your Request ID:</Text>
          <TouchableOpacity onPress={copyToClipboard} className="flex-row items-center justify-center">
            <Text className="text-blue-700 font-bold text-lg">{quoteRequestId}</Text>
            <Text className="text-blue-500 ml-2">📋</Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-500 text-center mt-1">Tap to copy</Text>
        </View>
        
        <TouchableOpacity 
          className="bg-blue-600 py-3 rounded-lg items-center"
          onPress={handleCloseSuccess}
        >
          <Text className="text-white font-bold">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View className="flex-1 bg-white">
        
        
        <ScrollView className="flex-1 px-5 pt-6">
          {(productName || productImageUrl) && (
            <View className="bg-blue-50 p-4 rounded-lg mb-6">
              {productImageUrl && (
                <Image 
                  source={{ uri: productImageUrl }} 
                  className="w-full h-40 mb-2 rounded-md" 
                  resizeMode="contain"
                />
              )}
              {productName && (
                <Text className="font-bold text-gray-800">{productName}</Text>
              )}
            </View>
          )}
          
          {/* Image Upload Section - Only show if not from product details page */}
          {!fromProductDetails && (
            <TouchableOpacity
              className="border-2 border-dashed border-blue-300 p-5 items-center rounded-lg mb-6 bg-blue-50"
              onPress={pickImage}
            >
              {selectedImage ? (
                <>
                  <Image source={{ uri: selectedImage.uri }} className="w-40 h-40 mb-2 rounded-md" />
                  <TouchableOpacity 
                    onPress={removeImage}
                    className="bg-red-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-red-600">✕</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View className="items-center py-6">
                  <Text className="text-blue-500 text-lg mb-2">
                    Upload Product Image
                  </Text>
                  <Text className="text-gray-500 text-center">
                    Tap here to select an image of your product
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <Text className="text-lg font-semibold mb-2 text-gray-700">Contact Information</Text>
          
          {/* Name and Mobile */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Your Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          
          <Controller
            control={control}
            name="mobile"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Mobile Number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
              />
            )}
          />
          
          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Company Name (Optional)"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          
          <Text className="text-lg font-semibold mb-2 text-gray-700">Location Details</Text>
          
          <Controller
            control={control}
            name="locationCountry"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <TouchableOpacity 
                  className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
                  onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <Text>{value}</Text>
                  <Text className="text-gray-500">▼</Text>
                </TouchableOpacity>
                
                {showCountryDropdown && (
                  <View className="border border-gray-300 rounded-lg mt-1 bg-white z-10">
                    {emiratesOptions.map((emirate) => (
                      <TouchableOpacity 
                        key={emirate} 
                        className={`px-4 py-3 border-b border-gray-200 ${emirate === value ? 'bg-blue-50' : ''}`}
                        onPress={() => selectCountry(emirate)}
                      >
                        <Text className={emirate === value ? 'text-blue-600 font-semibold' : ''}>{emirate}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          />
          
          {/* Other location fields */}
          {[
            { name: 'locationStreet', placeholder: 'Street' },
            { name: 'locationArea', placeholder: 'Area' },
            { name: 'locationBuilding', placeholder: 'Building' },
            { name: 'locationVillaNo', placeholder: 'Villa No' },
            { name: 'locationGmapLink', placeholder: 'Google Maps Link (Optional)' },
          ].map(({ name, placeholder }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                  placeholder={placeholder}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          ))}

          {submitStatus === 'error' && (
            <View className="bg-red-50 p-4 rounded-lg mb-4">
              <Text className="text-red-600">{statusMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            className={`bg-blue-600 rounded-lg py-4 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Submit Request</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
        
        <TouchableOpacity 
          onPress={onClose} 
          className="absolute top-4 right-4 z-10"
          disabled={loading}
        >
          <Text className="text-white text-xl font-bold">✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Success dialog remains as a modal */}
      {showSuccessDialog && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[85%] max-w-md">
            {/* Success dialog content remains the same */}
            <TouchableOpacity 
              className="bg-blue-600 py-3 rounded-lg items-center"
              onPress={handleCloseSuccess}
            >
              <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default RequestQuotationModal;




