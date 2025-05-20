import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../src/store/cartStore';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    
    // Address Details
    addresses: [],
    selectedAddressId: null,
    
    // Payment Details
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Sample addresses for demonstration
  const sampleAddresses = [
    { id: 1, title: 'D-32', description: 'Flat #304, Sameer Colony, Banjara Garden Street, India', isDefault: true },
    { id: 2, title: 'D-33', description: 'Flat #305, Sameer Colony, Banjara Garden Street, India', isDefault: false },
    { id: 3, title: 'D-34', description: 'Flat #306, Sameer Colony, Banjara Garden Street, India', isDefault: false },
  ];

  // Set sample addresses on component mount
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      addresses: sampleAddresses,
      selectedAddressId: sampleAddresses.find(addr => addr.isDefault)?.id || sampleAddresses[0]?.id
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelect = (addressId) => {
    setFormData(prev => ({
      ...prev,
      selectedAddressId: addressId
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process payment and complete order
      handleCompleteOrder();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleCompleteOrder = () => {
    // Process order completion logic here
    clearCart();
    router.replace('/order-confirmation');
  };

  // Render progress bar
  const renderProgressBar = () => (
    <View className="flex-row justify-between items-center px-4 py-6">
      <View className={`h-1 flex-1 ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`h-1 flex-1 mx-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
      <View className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
    </View>
  );

  // Render Basic Details Step
  const renderBasicDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Basic Details</Text>
      
      <Text className="text-xs uppercase text-gray-500 mb-1">FIRST NAME</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        value={formData.firstName}
        onChangeText={(text) => handleInputChange('firstName', text)}
      />
      
      <Text className="text-xs uppercase text-gray-500 mb-1">LAST NAME</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        value={formData.lastName}
        onChangeText={(text) => handleInputChange('lastName', text)}
      />
      
      <Text className="text-xs uppercase text-gray-500 mb-1">EMAIL</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      
      <Text className="text-xs uppercase text-gray-500 mb-1">MOBILE</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={(text) => handleInputChange('mobile', text)}
      />
      
      <View className="flex-1" />
      
      <TouchableOpacity 
        className="bg-white border border-blue-500 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
        onPress={handleNext}
      >
        <Text className="text-blue-500 font-semibold mr-2">NEXT</Text>
        <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );

  // Render Address Details Step
  const renderAddressDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Address Details</Text>
      
      <ScrollView className="flex-1">
        {formData.addresses.map((address) => (
          <TouchableOpacity 
            key={address.id}
            className={`border ${formData.selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
            onPress={() => handleAddressSelect(address.id)}
          >
            <View className="mr-3 mt-1">
              <View className={`w-5 h-5 rounded-full border ${formData.selectedAddressId === address.id ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                {formData.selectedAddressId === address.id && (
                  <View className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">{address.title}</Text>
              <Text className="text-gray-500 text-sm mt-1">{address.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        className="flex-row items-center mb-6 mt-2"
        onPress={() => console.log('Add new address')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
        <Text className="text-blue-500 ml-2">Add New Address</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-white border border-blue-500 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
        onPress={handleNext}
      >
        <Text className="text-blue-500 font-semibold mr-2">NEXT</Text>
        <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );

  // Render Payment Details Step
  const renderPaymentDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Payment Details</Text>
      
      <View className="border border-gray-300 rounded-lg p-4 mb-4">
        <Text className="text-xs uppercase text-gray-500 mb-1">Credit Card</Text>
        <TextInput
          className="border-b border-gray-200 py-2 mb-3"
          placeholder="Card Number"
          keyboardType="number-pad"
          value={formData.cardNumber}
          onChangeText={(text) => handleInputChange('cardNumber', text)}
        />
        
        <TextInput
          className="border-b border-gray-200 py-2 mb-3"
          placeholder="Cardholder Name"
          value={formData.cardName}
          onChangeText={(text) => handleInputChange('cardName', text)}
        />
        
        <View className="flex-row">
          <TextInput
            className="border-b border-gray-200 py-2 flex-1 mr-4"
            placeholder="MM/YY"
            keyboardType="number-pad"
            value={formData.expiryDate}
            onChangeText={(text) => handleInputChange('expiryDate', text)}
          />
          
          <TextInput
            className="border-b border-gray-200 py-2 w-20"
            placeholder="CVV"
            keyboardType="number-pad"
            secureTextEntry
            value={formData.cvv}
            onChangeText={(text) => handleInputChange('cvv', text)}
          />
        </View>
      </View>
      
      <View className="flex-1" />
      
      <TouchableOpacity 
        className="bg-blue-500 rounded-lg py-3 px-6 mb-4 items-center"
        onPress={handleCompleteOrder}
      >
        <Text className="text-white font-semibold">CONFIRM YOUR ORDER</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="font-bold text-lg">Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Step Content */}
        {currentStep === 1 && renderBasicDetailsStep()}
        {currentStep === 2 && renderAddressDetailsStep()}
        {currentStep === 3 && renderPaymentDetailsStep()}
        
     
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}