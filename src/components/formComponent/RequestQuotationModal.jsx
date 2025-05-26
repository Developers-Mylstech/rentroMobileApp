

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
  Keyboard,
  StyleSheet,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';
import Clipboard from '@react-native-clipboard/clipboard';
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
    Clipboard.setString(quoteRequestId);
    Alert.alert('Copied', 'Request ID copied to clipboard!');
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
        // If no user-selected image but we have a product image, use that
        const productImageData = {
          imageUrl: productImageUrl,
          imageId: productImageId || 0
        };
        await proceedWithFormSubmission(data, productImageData);
      } else {
        // Default image if none is available
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
      
      console.log("Request quotation response:", response?.data);
      
      setQuoteRequestId(response?.data?.requestQuotationCode);
      setSubmitStatus('success');
      setStatusMessage('Thank you for your query!');
      setShowSuccessDialog(true);
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
    onClose();
  };

  // Success dialog component
  const SuccessDialog = () => (
    <Modal visible={showSuccessDialog} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl p-6 m-5 w-11/12 max-w-md">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
              <Text className="text-green-600 text-3xl">✓</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Request Submitted!</Text>
            <Text className="text-gray-600 text-center mt-2">
              Your quotation request has been submitted successfully.
            </Text>
          </View>
          
          <View className="bg-gray-100 rounded-lg p-3 mb-4 flex-row justify-between items-center">
            <Text className="text-gray-700">Request ID: {quoteRequestId}</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Text className="text-blue-600">Copy</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="bg-blue-600 py-3 rounded-lg items-center"
            onPress={handleCloseSuccess}
          >
            <Text className="text-white font-semibold">Close</Text>
          </TouchableOpacity>
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
    </Modal>
  );

  return (
    <>
      <Modal 
        visible={visible} 
        animationType="slide" 
        onRequestClose={onClose} 
        transparent
        // This is the key property to prevent keyboard from pushing content
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Request Quotation</Text>
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.closeButton}
                disabled={loading}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {/* Product Info Section - Only show if product info is provided */}
              {(productName || productImageUrl) && (
                <View style={styles.productInfoContainer}>
                  {productImageUrl && (
                    <Image 
                      source={{ uri: productImageUrl }} 
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  )}
                  {productName && (
                    <Text style={styles.productName}>{productName}</Text>
                  )}
                </View>
              )}
              
              {/* Image Upload Section - Only show if not from product details page */}
              {!fromProductDetails && (
                <TouchableOpacity
                  style={styles.imageUploadContainer}
                  onPress={pickImage}
                >
                  {selectedImage ? (
                    <>
                      <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                      <TouchableOpacity 
                        onPress={removeImage}
                        style={styles.removeImageButton}
                      >
                        <Text style={styles.removeImageButtonText}>✕</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={styles.uploadPromptContainer}>
                      <Text style={styles.uploadPromptTitle}>
                        Upload Product Image
                      </Text>
                      <Text style={styles.uploadPromptSubtitle}>
                        Tap here to select an image of your product
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}

              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              {/* Name and Mobile */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
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
                    style={styles.input}
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
                    style={styles.input}
                    placeholder="Company Name (Optional)"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              
              <Text style={styles.sectionTitle}>Location Details</Text>
              
              <Controller
                control={control}
                name="locationCountry"
                render={({ field: { value } }) => (
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity 
                      style={styles.dropdownButton}
                      onPress={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      <Text>{value}</Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                    
                    {showCountryDropdown && (
                      <View style={styles.dropdownList}>
                        {emiratesOptions.map((emirate) => (
                          <TouchableOpacity 
                            key={emirate} 
                            style={[
                              styles.dropdownItem,
                              emirate === value ? styles.dropdownItemSelected : null
                            ]}
                            onPress={() => selectCountry(emirate)}
                          >
                            <Text style={emirate === value ? styles.dropdownItemTextSelected : null}>
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
                      style={styles.input}
                      placeholder={placeholder}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              ))}

              {submitStatus === 'error' && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{statusMessage}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, loading ? styles.submitButtonDisabled : null]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                )}
              </TouchableOpacity>
              
              {/* Add extra padding at the bottom to ensure content is visible when keyboard is open */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    height: screenHeight * 0.85, // Increased height to 85% of screen
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    // Add this to ensure the modal stays at the bottom
    position: 'absolute',
    bottom: 0,
  },
  header: {
    backgroundColor: '#2563EB', // blue-600
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  productInfoContainer: {
    backgroundColor: '#EFF6FF', // blue-50
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  productImage: {
    width: '100%',
    height: 160,
    marginBottom: 8,
    borderRadius: 6,
  },
  productName: {
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
  },
  imageUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#93C5FD', // blue-300
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#EFF6FF', // blue-50
  },
  selectedImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
    borderRadius: 6,
  },
  removeImageButton: {
    backgroundColor: '#FEE2E2', // red-100
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  removeImageButtonText: {
    color: '#DC2626', // red-600
  },
  uploadPromptContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  uploadPromptTitle: {
    color: '#3B82F6', // blue-500
    fontSize: 18,
    marginBottom: 8,
  },
  uploadPromptSubtitle: {
    color: '#6B7280', // gray-500
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151', // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownArrow: {
    color: '#6B7280', // gray-500
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: 'white',
    zIndex: 10,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray-200
  },
  dropdownItemSelected: {
    backgroundColor: '#EFF6FF', // blue-50
  },
  dropdownItemTextSelected: {
    color: '#2563EB', // blue-600
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2', // red-50
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626', // red-600
  },
  submitButton: {
    backgroundColor: '#2563EB', // blue-600
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RequestQuotationModal;



