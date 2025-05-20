import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../src/store/cartStore';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Details
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    
    // Address Details
    addresses: [],
    selectedAddressId: null,
    newAddress: {
      streetAddress: '',
      buildingName: '',
      flatNo: '',
      area: '',
      emirate: 'Dubai',
      country: 'UAE',
      landmark: '',
      addressType: 'Home',
      default: true
    },
    
    // Payment Details
    savedPaymentMethods: [],
    selectedPaymentId: null,
    showAddPayment: false,
    savePaymentDetails: true,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Sample addresses for demonstration
  const sampleAddresses = [
    { 
      id: 1, 
      title: 'D-32', 
      description: 'Flat #304, Sameer Colony, Banjara Garden Street, India',
      streetAddress: 'Banjara Garden Street',
      buildingName: 'Sameer Colony',
      flatNo: '304',
      area: 'Banjara Hills',
      emirate: 'Dubai',
      country: 'UAE',
      landmark: 'Near Park',
      addressType: 'Home',
      default: true
    },
    { 
      id: 2, 
      title: 'D-33', 
      description: 'Flat #305, Sameer Colony, Banjara Garden Street, India',
      streetAddress: 'Banjara Garden Street',
      buildingName: 'Sameer Colony',
      flatNo: '305',
      area: 'Banjara Hills',
      emirate: 'Abu Dhabi',
      country: 'UAE',
      landmark: 'Near Mall',
      addressType: 'Office',
      default: false
    },
    { 
      id: 3, 
      title: 'D-34', 
      description: 'Flat #306, Sameer Colony, Banjara Garden Street, India',
      streetAddress: 'Banjara Garden Street',
      buildingName: 'Sameer Colony',
      flatNo: '306',
      area: 'Banjara Hills',
      emirate: 'Sharjah',
      country: 'UAE',
      landmark: 'Near School',
      addressType: 'Other',
      default: false
    },
  ];

  // Sample payment methods for demonstration
  const samplePaymentMethods = [
    { id: 1, type: 'visa', lastFour: '4242', expiryDate: '12/25', name: 'John Doe', isDefault: true },
    { id: 2, type: 'mastercard', lastFour: '5555', expiryDate: '10/24', name: 'John Doe', isDefault: false },
  ];

  // Emirates options for dropdown
  const emiratesOptions = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
  ];

  // Address types
  const addressTypes = ['Home', 'Office', 'Other'];

  // Set sample data on component mount
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      addresses: sampleAddresses,
      selectedAddressId: sampleAddresses.find(addr => addr.default)?.id || sampleAddresses[0]?.id,
      savedPaymentMethods: samplePaymentMethods,
      selectedPaymentId: samplePaymentMethods.find(pm => pm.isDefault)?.id || null
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [field]: value
      }
    }));
  };

  const handleAddressSelect = (addressId) => {
    setFormData(prev => ({
      ...prev,
      selectedAddressId: addressId
    }));
  };

  const handlePaymentMethodSelect = (paymentId) => {
    setFormData(prev => ({
      ...prev,
      selectedPaymentId: paymentId,
      showAddPayment: false
    }));
  };

  const toggleAddPayment = () => {
    setFormData(prev => ({
      ...prev,
      showAddPayment: !prev.showAddPayment,
      selectedPaymentId: prev.showAddPayment ? prev.savedPaymentMethods.find(pm => pm.isDefault)?.id || null : null
    }));
  };

  const handleSavePaymentToggle = () => {
    setFormData(prev => ({
      ...prev,
      savePaymentDetails: !prev.savePaymentDetails
    }));
  };

  const handleAddressTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        addressType: type
      }
    }));
  };

  const handleEmirateSelect = (emirate) => {
    setFormData(prev => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        emirate
      }
    }));
  };

  const handleDefaultAddressToggle = () => {
    setFormData(prev => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        default: !prev.newAddress.default
      }
    }));
  };

  const handleAddNewAddress = () => {
    // Validate address fields
    const { streetAddress, buildingName, flatNo, area, emirate } = formData.newAddress;
    if (!streetAddress || !buildingName || !flatNo || !area || !emirate) {
      // Show error
      return;
    }

    const newAddress = {
      id: Date.now(),
      title: `${formData.newAddress.buildingName}, ${formData.newAddress.flatNo}`,
      description: `${formData.newAddress.flatNo}, ${formData.newAddress.buildingName}, ${formData.newAddress.streetAddress}, ${formData.newAddress.area}, ${formData.newAddress.emirate}`,
      ...formData.newAddress
    };

    // If this is set as default, update other addresses
    let updatedAddresses = [...formData.addresses];
    if (newAddress.default) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        default: false
      }));
    }

    setFormData(prev => ({
      ...prev,
      addresses: [...updatedAddresses, newAddress],
      selectedAddressId: newAddress.id,
      newAddress: {
        streetAddress: '',
        buildingName: '',
        flatNo: '',
        area: '',
        emirate: 'Dubai',
        country: 'UAE',
        landmark: '',
        addressType: 'Home',
        default: true
      }
    }));

    setShowAddressForm(false);
  };

  const handleAddPaymentMethod = () => {
    // Validate payment details
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      // Show error
      return;
    }

    const newPaymentMethod = {
      id: Date.now(),
      type: getCardType(formData.cardNumber),
      lastFour: formData.cardNumber.slice(-4),
      expiryDate: formData.expiryDate,
      name: formData.cardName,
      isDefault: formData.savedPaymentMethods.length === 0
    };

    setFormData(prev => ({
      ...prev,
      savedPaymentMethods: [...prev.savedPaymentMethods, newPaymentMethod],
      selectedPaymentId: newPaymentMethod.id,
      showAddPayment: false,
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    }));
  };

  // Helper function to determine card type based on number
  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'card';
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
    // Create payload for order
    const selectedAddress = formData.addresses.find(addr => addr.id === formData.selectedAddressId);
    const selectedPayment = formData.savedPaymentMethods.find(pm => pm.id === formData.selectedPaymentId);
    
    const orderPayload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile
      },
      shippingAddress: {
        streetAddress: selectedAddress.streetAddress,
        buildingName: selectedAddress.buildingName,
        flatNo: selectedAddress.flatNo,
        area: selectedAddress.area,
        emirate: selectedAddress.emirate,
        country: selectedAddress.country,
        landmark: selectedAddress.landmark,
        addressType: selectedAddress.addressType
      },
      payment: {
        method: 'card',
        cardType: selectedPayment.type,
        lastFour: selectedPayment.lastFour
      },
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        type: item.productType
      }))
    };
    
    console.log('Order Payload:', orderPayload);
    
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
      
      <View className="flex-1 " />

      <View className="flex-row justify-between items-center">
        <TouchableOpacity 
          className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={16} color="#2976f3" />
          <Text className="text-blue-600 font-semibold mr-2">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
          onPress={handleNext}
        >
          <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
          <Ionicons name="arrow-forward" size={16} color="#2976f3" />
        </TouchableOpacity>
      </View>

     
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
              <View className="flex-row justify-between">
                <Text className="font-semibold text-gray-800">{address.title}</Text>
                {address.default && (
                  <View className="bg-blue-100 px-2 py-0.5 rounded">
                    <Text className="text-blue-600 text-xs">Default</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-500 text-sm mt-1">{address.description}</Text>
              <Text className="text-gray-400 text-xs mt-1">{address.addressType}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity 
        className="flex-row items-center mb-6 mt-2"
        onPress={() => setShowAddressForm(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#2976f3" />
        <Text className="text-blue-600 ml-2">Add New Address</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-between items-center">
        <TouchableOpacity 
          className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={16} color="#2976f3" />
          <Text className="text-blue-600 font-semibold mr-2">Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
          onPress={handleNext}
        >
          <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
          <Ionicons name="arrow-forward" size={16} color="#2976f3" />
        </TouchableOpacity>
      </View>
      
      {/* Add Address Modal */}
      <Modal
        visible={showAddressForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressForm(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-xl p-4 h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddressForm(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1">
              <Text className="text-xs uppercase text-gray-500 mb-1">STREET ADDRESS</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter street address"
                value={formData.newAddress.streetAddress}
                onChangeText={(text) => handleAddressInputChange('streetAddress', text)}
              />
              
              <Text className="text-xs uppercase text-gray-500 mb-1">BUILDING NAME</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter building name"
                value={formData.newAddress.buildingName}
                onChangeText={(text) => handleAddressInputChange('buildingName', text)}
              />
              
              <Text className="text-xs uppercase text-gray-500 mb-1">FLAT/VILLA NUMBER</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter flat or villa number"
                value={formData.newAddress.flatNo}
                onChangeText={(text) => handleAddressInputChange('flatNo', text)}
              />
              
              <Text className="text-xs uppercase text-gray-500 mb-1">AREA</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter area"
                value={formData.newAddress.area}
                onChangeText={(text) => handleAddressInputChange('area', text)}
              />
              
              <Text className="text-xs uppercase text-gray-500 mb-1">EMIRATE</Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                  {emiratesOptions.map((emirate) => (
                    <TouchableOpacity 
                      key={emirate}
                      className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.emirate === emirate ? 'bg-blue-500' : 'bg-gray-100'}`}
                      onPress={() => handleEmirateSelect(emirate)}
                    >
                      <Text className={formData.newAddress.emirate === emirate ? 'text-white' : 'text-gray-600'}>{emirate}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <Text className="text-xs uppercase text-gray-500 mb-1">ADDRESS TYPE</Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                  {addressTypes.map((type) => (
                    <TouchableOpacity 
                      key={type}
                      className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.addressType === type ? 'bg-blue-500' : 'bg-gray-100'}`}
                      onPress={() => handleAddressTypeSelect(type)}
                    >
                      <Text className={formData.newAddress.addressType === type ? 'text-white' : 'text-gray-600'}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View className="flex-row items-center mb-4">
                <Switch
                  trackColor={{ false: "#cccccc", true: "#22c55e" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#cccccc"
                  onValueChange={handleDefaultAddressToggle}
                  value={formData.newAddress.default}
                />
                <Text className="ml-2">Set as default address</Text>
              </View>
              
              <TouchableOpacity 
                className="bg-blue-500 rounded-lg py-3 px-6"
                onPress={handleAddNewAddress}
              >
                <Text className="text-white font-semibold">Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Render Payment Details Step
  const renderPaymentDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Payment Details</Text>
      
      <ScrollView className="flex-1">
        {/* Saved Payment Methods */}
        {formData.savedPaymentMethods.length > 0 && !formData.showAddPayment && (
          <>
            {formData.savedPaymentMethods.map((payment) => (
              <TouchableOpacity 
                key={payment.id}
                className={`border ${formData.selectedPaymentId === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
                onPress={() => handlePaymentMethodSelect(payment.id)}
              >
                <View className="mr-3 mt-1">
                  <View className={`w-5 h-5 rounded-full border ${formData.selectedPaymentId === payment.id ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                    {formData.selectedPaymentId === payment.id && (
                      <View className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </View>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={payment.type === 'visa' ? 'card' : payment.type === 'mastercard' ? 'card' : 'card'} 
                      size={20} 
                      color="#3b82f6" 
                    />
                    <Text className="font-semibold text-gray-800 ml-2">
                      {payment.type === 'visa' ? 'Visa' : payment.type === 'mastercard' ? 'Mastercard' : 'Card'} •••• {payment.lastFour}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">Expires {payment.expiryDate}</Text>
                  <Text className="text-gray-500 text-sm">{payment.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              className="flex-row items-center mb-6 mt-2"
              onPress={toggleAddPayment}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-blue-500 ml-2">Add New Payment Method</Text>
            </TouchableOpacity>
          </>
        )}
        
        {/* Add New Payment Method Form */}
        {(formData.showAddPayment || formData.savedPaymentMethods.length === 0) && (
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
            
            <View className="flex-row mb-4">
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
            
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-700">Save this card for future use</Text>
              <Switch
                trackColor={{ false: "#cccccc", true: "#22c55e" }}
                thumbColor="#ffffff"
                ios_backgroundColor="#cccccc"
                onValueChange={handleSavePaymentToggle}
                value={formData.savePaymentDetails}
              />
            </View>
            
            <View className="flex-row justify-between">
              {formData.savedPaymentMethods.length > 0 && (
                <TouchableOpacity 
                  className="border border-gray-300 rounded-lg py-2 px-4"
                  onPress={toggleAddPayment}
                >
                  <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                className="bg-blue-500 rounded-lg py-2 px-4 ml-auto"
                onPress={handleAddPaymentMethod}
              >
                <Text className="text-white text-center font-semibold">Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        className="bg-blue-600 rounded-lg py-3 px-6 mb-4 items-center"
        onPress={handleCompleteOrder}
        disabled={!formData.selectedPaymentId && !formData.showAddPayment}
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
        <View className="flex-row items-center justify-center px-4 py-3 border-b border-gray-200">
          {/* <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity> */}
          <Text className="font-bold text-lg">Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Step Content */}
        {currentStep === 1 && renderBasicDetailsStep()}
        {currentStep === 2 && renderAddressDetailsStep()}
        {currentStep === 3 && renderPaymentDetailsStep()}
        
        {/* Bottom Navigation */}
    
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

