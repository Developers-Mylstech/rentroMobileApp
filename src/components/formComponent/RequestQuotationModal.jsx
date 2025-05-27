

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
  Dimensions,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';
import axios from 'axios';
import { Platform } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

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

  useEffect(() => {
    if (productImage) {
      setProductImageUrl(productImage);
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
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload an image.');
        return;
      }

      // Use the updated API
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
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
    // Using Alert directly instead of Clipboard
    Alert.alert('Request ID', quoteRequestId, [
      { text: 'OK' }
    ]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmitStatus(null);
    setStatusMessage('');
    try {
      let imageData = null;

      // If user selected an image, upload it first
      if (selectedImage) {
        console.log("Selected image to upload:", selectedImage);

        try {
          // Check if the image is valid
          if (!selectedImage.uri) {
            throw new Error("Invalid image: missing URI");
          }

          // Create proper FormData object for image upload
          const formData = new FormData();
          formData.append('file', {
            uri: Platform.OS === 'ios' ? selectedImage.uri.replace('file://', '') : selectedImage.uri,
            type: 'image/jpeg',
            name: 'upload.jpg',
          });

          console.log("Image URI:", selectedImage.uri);

          // Use fetch instead of axios for more reliable file uploads in React Native
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/image-entities/upload?quality=80&fallbackToJpeg=true`, {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
          }

          const responseData = await response.json();
          console.log("Image upload API response:", JSON.stringify(responseData));

          // Extract image data from response
          if (responseData?.image) {
            imageData = {
              imageUrl: responseData.image.imageUrl,
              imageId: responseData.image.imageId
            };
          } else if (responseData?.imageUrl) {
            imageData = {
              imageUrl: responseData.imageUrl,
              imageId: responseData.imageId || 1
            };
          } else {
            throw new Error("Invalid image upload response format");
          }

          // Continue with form submission
          await proceedWithFormSubmission(data, imageData);

        } catch (uploadError) {
          console.error("Image upload error:", uploadError.message);

          // Alert the user about the image upload failure
          Alert.alert(
            "Image Upload Failed",
            `We couldn't upload your image. Would you like to continue without an image?`,
            [
              {
                text: "Cancel",
                onPress: () => {
                  setLoading(false);
                },
                style: "cancel"
              },
              {
                text: "Continue",
                onPress: () => {
                  // Use default image
                  const defaultImageData = {
                    imageUrl: "https://via.placeholder.com/150",
                    imageId: 1
                  };
                  // Continue with form submission
                  proceedWithFormSubmission(data, defaultImageData);
                }
              }
            ]
          );
        }
      } else if (productImageUrl) {
        const productImageData = {
          imageUrl: productImageUrl,
          imageId: productImageId || 0
        };
        await proceedWithFormSubmission(data, productImageData);
      } else {
        const defaultImageData = {
          imageUrl: "https://via.placeholder.com/150",
          imageId: 1
        };
        await proceedWithFormSubmission(data, defaultImageData);
      }
    } catch (error) {
      console.error("Overall submission error:", error);
      setSubmitStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again.');
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Separate function to handle the form submission after image upload
  const proceedWithFormSubmission = async (data, imageData) => {
    try {
      // Prepare the payload
      const payload = {
        productId: productId || 0,
        name: data.name,
        mobile: data.mobile,
        companyName: data.companyName || "",
        locationStreet: data.locationStreet || "",
        locationArea: data.locationArea || "",
        locationBuilding: data.locationBuilding || "",
        locationVillaNo: data.locationVillaNo || "",
        locationCountry: data.locationCountry,
        locationGmapLink: data.locationGmapLink || "",
        imageUrl: imageData.imageUrl,
        imageId: imageData.imageId
      };

      console.log("Submitting request with payload:", payload);

      // Second API call - Submit the form with image data
      const response = await axiosInstance.post('/request-quotations', payload, {
        timeout: 15000, // Set a reasonable timeout
      });

      setQuoteRequestId(response?.data?.requestQuotationCode);
      setSubmitStatus('success');
      setStatusMessage('Thank you for your query!');
      setShowSuccessDialog(true); // Make sure this is being set to true
      reset();
      removeImage();
    } catch (error) {
      console.error("Form submission error:", error);
      console.error("Error details:", error.response?.data);

      let errorMessage = 'Network error. Please check your connection and try again.';

      if (error.response) {
        errorMessage = error.response.data?.message ||
          `Server error (${error.response.status}). Please try again later.`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }

      setSubmitStatus('error');
      setStatusMessage(errorMessage);

      Alert.alert(
        'Submission Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
  };

  // Success dialog component
  const SuccessDialog = () => (
    <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
      <View className="bg-white rounded-xl p-6 m-5 w-[85%] max-w-[400px]">
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
            <Text className="text-green-500 text-3xl font-bold">✓</Text>
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Request Submitted!</Text>
          <Text className="text-gray-500 text-center">
            Your quotation request has been submitted successfully.
          </Text>
        </View>

        <View className="bg-gray-100 rounded-lg p-3 mb-4 flex-row justify-between items-center">
          <Text className="text-gray-600">Request ID: {quoteRequestId}</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Text className="text-blue-600">Copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-3 items-center"
          onPress={handleCloseSuccess}
        >
          <Text className="text-white font-bold text-base">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>

      <View className="flex-1 bg-white justify-center items-center">
        <View className=" w-full h-full rounded-t-3xl overflow-hidden p-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            className="flex-1 px-1 pt-6"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
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
                    <Image source={{ uri: selectedImage.uri }} className="w-full h-40 rounded-md" />
                    <TouchableOpacity
                      onPress={removeImage}
                      className="absolute top-2 right-2 bg-red-500 w-6 h-6 rounded-full items-center justify-center"
                    >
                      <Text className="text-white font-bold">✕</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View className="items-center">
                    <Text className="font-bold text-gray-700 mb-1">
                      Upload Product Image
                    </Text>
                    <Text className="text-gray-500 text-center">
                      Tap here to select an image of your product
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            <Text className="text-lg font-bold text-gray-800 mb-3">Contact Information</Text>

            {/* Name and Mobile */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mb-3"
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
                  className="border border-gray-300 rounded-lg p-3 mb-3"
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
                  className="border border-gray-300 rounded-lg p-3 mb-3"
                  placeholder="Company Name (Optional)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Text className="text-lg font-bold text-gray-800 mb-3">Location Details</Text>

            <Controller
              control={control}
              name="locationCountry"
              render={({ field: { value } }) => (
                <View className="mb-3">
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                    onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <Text>{value}</Text>
                    <Text>▼</Text>
                  </TouchableOpacity>

                  {showCountryDropdown && (
                    <View className="border border-gray-300 rounded-lg mt-1 bg-white">
                      {emiratesOptions.map((emirate) => (
                        <TouchableOpacity
                          key={emirate}
                          className={`p-3 ${emirate === value ? 'bg-blue-50' : ''}`}
                          onPress={() => selectCountry(emirate)}
                        >
                          <Text className={emirate === value ? 'text-blue-600' : ''}>
                            {emirate}
                          </Text>
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
                    className="border border-gray-300 rounded-lg p-3 mb-3"
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            ))}

            {submitStatus === 'error' && (
              <View className="bg-red-50 p-3 rounded-lg mb-3">
                <Text className="text-red-600">{statusMessage}</Text>
              </View>
            )}

            <TouchableOpacity
              className={`bg-blue-600 rounded-lg py-3 items-center mb-3 ${loading ? 'opacity-70' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-bold">Submit Request</Text>
              )}
            </TouchableOpacity>

            {/* Add extra padding at the bottom to ensure content is visible when keyboard is open */}
            <View className="h-24" />
          </ScrollView>
        </View>
        {showSuccessDialog && <SuccessDialog />}
      </View>

    </>
  );
};

export default RequestQuotationModal;
