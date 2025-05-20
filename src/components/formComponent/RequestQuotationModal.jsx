import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '../../api/axiosInstance';

const RequestQuotationModal = ({ visible, onClose }) => {
  // State management
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [statusMessage, setStatusMessage] = useState("");
  const [quoteRequestId, setQuoteRequestId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form handling
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      companyName: "",
      street: "",
      area: "",
      building: "",
      villaNo: "",
      country: "UAE",
      productDescription: "", // Added field for product description instead of image
    }
  });

  // Image picker function
  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Prepare payload
      const payload = {
        name: data.name,
        mobile: data.mobile,
        companyName: data.companyName,
        location: {
          street: data.street,
          area: data.area,
          building: data.building,
          villaNo: data.villaNo,
          country: data.country,
        },
        productDescription: data.productDescription,
      };
      
      // If image is selected, prepare it for upload
      if (selectedImage) {
        const formData = new FormData();
        
        // Add image to form data
        const fileUri = selectedImage.uri;
        const filename = fileUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: fileUri,
          name: filename,
          type,
        });
        
        // Add other data to form data
        Object.keys(payload).forEach(key => {
          if (typeof payload[key] === 'object' && payload[key] !== null) {
            formData.append(key, JSON.stringify(payload[key]));
          } else {
            formData.append(key, payload[key]);
          }
        });
        
        // Submit with image
        const response = await axiosInstance.post("/request-quotations", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setQuoteRequestId(response?.data?.requestQuotationCode || "RQ12345");
      } else {
        // Submit without image
        const response = await axiosInstance.post("/request-quotations", payload);
        setQuoteRequestId(response?.data?.requestQuotationCode || "RQ12345");
      }
      
      // Handle success
      setSubmitStatus('success');
      setStatusMessage("Thank you for your query!");
      
      // Reset form and image
      reset();
      setSelectedImage(null);
      
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus('error');
      setStatusMessage(
        error.response?.data?.message || 
        "Failed to submit quotation request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset modal state when closed
  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitStatus(null);
      setSelectedImage(null);
      onClose();
    }
  };

  // Render different content based on submission status
  const renderContent = () => {
    if (submitStatus === 'success') {
      return (
        <View className="p-6 items-center">
          <View className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          
          <Text className="text-heading-2 text-center text-gray-800 mb-2">{statusMessage}</Text>
          <Text className="text-base text-center text-gray-600 mb-6">Our team will get back to you within 24 hours.</Text>
          
          <View className="w-full mb-6">
            <Text className="text-sm text-gray-600 mb-2">Your Request ID:</Text>
            <View className="flex-row items-center justify-center bg-blue-50 p-3 rounded-lg">
              <Text className="font-bold text-blue-600 text-lg mr-2">{quoteRequestId}</Text>
              <Ionicons name="copy-outline" size={20} color="#3b82f6" />
            </View>
            <Text className="text-xs text-gray-500 text-center mt-1">Tap to copy</Text>
          </View>
          
          <View className="flex-row justify-center space-x-4 mb-6">
            <TouchableOpacity className="flex-row items-center bg-blue-100 px-4 py-2 rounded-lg">
              <Ionicons name="call" size={20} color="#3b82f6" />
              <Text className="ml-2 text-blue-600 font-medium">Call Us</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center bg-green-100 px-4 py-2 rounded-lg">
              <Ionicons name="logo-whatsapp" size={20} color="#10b981" />
              <Text className="ml-2 text-green-600 font-medium">WhatsApp</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="w-full bg-primary py-3 rounded-lg items-center"
            onPress={handleClose}
          >
            <Text className="text-white font-bold">Done</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (submitStatus === 'error') {
      return (
        <View className="p-6 items-center">
          <View className="w-16 h-16 rounded-full bg-red-500 items-center justify-center mb-4">
            <Ionicons name="close" size={40} color="#fff" />
          </View>
          
          <Text className="text-heading-2 text-center text-gray-800 mb-4">{statusMessage}</Text>
          
          <View className="flex-row items-center bg-red-50 p-4 rounded-lg mb-6 w-full">
            <Ionicons name="information-circle" size={20} color="#ef4444" />
            <Text className="ml-2 text-red-600">Please check your information and try again</Text>
          </View>
          
          <TouchableOpacity 
            className="w-full bg-red-500 py-3 rounded-lg items-center"
            onPress={() => setSubmitStatus(null)}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    // Default form view
    return (
      <ScrollView className="p-4">
        <Text className="text-heading-2 text-gray-800 mb-6">Request a Quotation</Text>
        
        {/* Image Upload Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Upload Product Image (Optional)
          </Text>
          
          <TouchableOpacity 
            onPress={pickImage}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center justify-center bg-gray-50"
          >
            {selectedImage ? (
              <View className="items-center">
                <Image 
                  source={{ uri: selectedImage.uri }} 
                  className="w-40 h-40 rounded-lg mb-2" 
                  resizeMode="contain"
                />
                <Text className="text-sm text-blue-500">Tap to change image</Text>
              </View>
            ) : (
              <View className="items-center py-4">
                <Ionicons name="cloud-upload-outline" size={40} color="#9ca3af" />
                <Text className="text-gray-500 mt-2">Tap to upload an image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Product Description Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Product Description
          </Text>
          <Controller
            control={control}
            name="productDescription"
            rules={{ required: false }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white"
                placeholder="Describe the product you're looking for..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        
        {/* Name Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Name *</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border rounded-lg p-3 text-gray-700 bg-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your full name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>}
        </View>
        
        {/* Mobile Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Mobile *</Text>
          <Controller
            control={control}
            name="mobile"
            rules={{ 
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9+\s-]{8,15}$/,
                message: "Please enter a valid mobile number"
              }
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border rounded-lg p-3 text-gray-700 bg-white ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your mobile number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.mobile && <Text className="text-red-500 text-xs mt-1">{errors.mobile.message}</Text>}
        </View>
        
        {/* Company Name Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Company Name</Text>
          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white"
                placeholder="Your company name (optional)"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        
        {/* Location Fields */}
        <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
        
        <View className="mb-4">
          <Controller
            control={control}
            name="street"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white mb-2"
                placeholder="Street"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          
          <Controller
            control={control}
            name="area"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white mb-2"
                placeholder="Area"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          
          <View className="flex-row space-x-2">
            <View className="flex-1">
              <Controller
                control={control}
                name="building"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white"
                    placeholder="Building"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            
            <View className="flex-1">
              <Controller
                control={control}
                name="villaNo"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 text-gray-700 bg-white"
                    placeholder="Villa No."
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity
          className="bg-primary py-3 rounded-lg items-center mt-4"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold">Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View className="w-8" />
            <View className="w-16 h-1 bg-gray-300 rounded-full mx-auto" />
            <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

export default RequestQuotationModal;


