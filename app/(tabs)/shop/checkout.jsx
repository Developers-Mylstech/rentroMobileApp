import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import useCartStore from "../../../src/store/cartStore";
import useAddressStore from "../../../src/store/addressStore";
import useCheckoutStore from "../../../src/store/checkoutStore";
import { useStripe, CardField } from "@stripe/stripe-react-native";
import StripeWrapper from "../../../src/components/StripeWraper";
import axiosInstance from "../../../src/utils/axiosInstance";


export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isDirectCheckout = params.direct === 'true';
  const directProductId = params.productId;
  const directProductType = params.productType;
  const directQuantity = params.quantity;
  const directServiceType = params.serviceType; // New parameter for service type
  const directServiceName = params.serviceName; // New parameter for service name
  
  const { 
    directCheckout, 
    directCheckoutData, 
    paymentCreation, 
    clientSecret, 
    loading, 
    error, 
    clearCheckoutData, // Make sure this is destructured from the store
    placeOrder 
  } = useCheckoutStore();
  
  const [checkoutId, setCheckoutId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, clearCart } = useCartStore();
  const { addresses, fetchAddresses, addAddress } = useAddressStore();
  const { confirmPayment } = useStripe();

  // Core state
  const [currentStep, setCurrentStep] = useState(1);
  const [cardDetails, setCardDetails] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    selectedAddressId: null,
    newAddress: {
      streetAddress: "",
      buildingName: "",
      flatNo: "",
      area: "",
      emirate: "Dubai",
      country: "UAE",
      landmark: "",
      addressType: "Home",
      default: true,
      formattedAddress: "",
    },
  });

  // Constants
  const emiratesOptions = [
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman", 
    "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
  ];
  const addressTypes = ["Home", "Office", "Other"];

  // Load addresses on mount
  useEffect(() => {
    fetchAddresses();
    
    // If this is a direct checkout and we have data, pre-fill the form
    if (isDirectCheckout && directCheckoutData) {
      // Pre-fill address if available
      if (directCheckoutData.deliveryAddress) {
        const addressId = directCheckoutData.deliveryAddress?.addressId;
        if (addressId) {
          setFormData(prev => ({
            ...prev,
            selectedAddressId: addressId,
          }));
        }
      }
      
      // Pre-fill user info if available
      if (directCheckoutData.firstName) {
        setFormData(prev => ({
          ...prev,
          firstName: directCheckoutData.firstName || '',
          lastName: directCheckoutData.lastName || '',
          email: directCheckoutData.email || '',
          mobile: directCheckoutData.mobile || '',
        }));
      }
      
      // Set checkout ID and order ID
      setCheckoutId(directCheckoutData.checkoutId);
      setOrderId(directCheckoutData.orderId);
    }
    
    // Find default address if needed
    if (addresses.length > 0 && !formData.selectedAddressId) {
      const defaultAddr = addresses.find((addr) => addr.default) || addresses[0];
      setFormData((prev) => ({
        ...prev,
        selectedAddressId: defaultAddr ? defaultAddr.addressId : null,
      }));
    }
  }, [fetchAddresses, isDirectCheckout, directCheckoutData]);

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      newAddress: { ...prev.newAddress, [field]: value },
    }));
  };

  const handleAddressSelect = (addressId) => {
    setFormData((prev) => ({ ...prev, selectedAddressId: addressId }));
  };

  const handleEmirateSelect = (emirate) => {
    setFormData((prev) => ({
      ...prev,
      newAddress: { ...prev.newAddress, emirate },
    }));
  };

  const handleDefaultAddressToggle = () => {
    setFormData((prev) => ({
      ...prev,
      newAddress: { ...prev.newAddress, default: !prev.newAddress.default },
    }));
  };

  const handleAddressTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      newAddress: { ...prev.newAddress, addressType: type },
    }));
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Handle direct checkout when user clicks Next on address step
  const handleDirectCheckout = async () => {
    if (!directProductId || !directProductType) {
      Alert.alert("Error", "Product information is missing");
      return;
    }

    try {
      // Find the selected address from the addresses array
      const addressToUse = addresses.find(
        (addr) => addr.addressId === formData.selectedAddressId
      );
      
      if (!addressToUse) {
        Alert.alert("Invalid Address", "Please select a valid delivery address.");
        return;
      }

      // Create payload with user entered data and selected address
      const payload = {
        quantity: parseInt(directQuantity) || 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        addressId: addressToUse.addressId,
        address: {
          streetAddress: addressToUse.streetAddress || "string",
          buildingName: addressToUse.buildingName || "string",
          flatNo: addressToUse.flatNo || "string",
          area: addressToUse.area || "string",
          emirate: addressToUse.emirate || "string",
          country: addressToUse.country || "string",
          landmark: addressToUse.landmark || "string",
          addressType: addressToUse.addressType || "string",
          default: addressToUse.default || true
        }
      };
      
      // Map the product type to the correct enum value expected by the backend
      if (directProductType === 'SERVICE') {
        // For services, use the specific service type instead of 'SERVICE'
        payload.productType = directServiceType || 'OTS';
      } else {
        // For non-services, use the product type directly (SELL or RENT)
        payload.productType = directProductType;
      }

      console.log('Direct checkout payload:', JSON.stringify(payload));

      // Call directCheckout with the product ID and payload
      const response = await directCheckout(directProductId, payload);
      
      // Set checkout ID and order ID
      setCheckoutId(response.checkoutId);
      setOrderId(response.orderId);
      
      // Create payment intent
      await paymentCreation(response.checkoutId);
      
      // Move to payment step
      setCurrentStep(3);
    } catch (error) {
      console.error("Direct checkout error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to process checkout");
    }
  };

  // Update handleNext function
  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate basic details
      const { firstName, lastName, email, mobile } = formData;
      if (!firstName || !lastName || !email || !mobile) {
        Alert.alert("Missing Information", "Please fill all basic details.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate address selection
      if (!formData.selectedAddressId) {
        Alert.alert("Address Required", "Please select an address.");
        return;
      }

      // If this is a direct checkout, handle it differently
      if (isDirectCheckout && directProductId) {
        await handleDirectCheckout();
        return;
      }

      // Otherwise, proceed with normal checkout flow
      try {
        const checkoutData = {
          cartId: cartItems.cartId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobile: formData.mobile,
          email: formData.email,
          addressId: formData.selectedAddressId,
        };

        const res = await placeOrder(checkoutData);
        if (res?.checkoutId) {
          setCheckoutId(res.checkoutId);
          setOrderId(res.orderId);
          await paymentCreation(res.checkoutId);
          setCurrentStep(3);
        } else {
          Alert.alert("Error", "Checkout failed. Please try again.");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        Alert.alert("Error", "Failed to process your order.");
      }
    }
  };

  // Address management
  const handleAddOrUpdateAddress = () => {
    const { streetAddress, buildingName, flatNo, area, emirate, country } = formData.newAddress;
    if (!streetAddress || !buildingName || !flatNo || !area || !emirate || !country) {
      Alert.alert("Missing Information", "Please fill all required address fields.");
      return;
    }

    if (isEditingAddress && addressToEdit) {
      updateAddress({
        ...formData.newAddress,
        addressId: addressToEdit.addressId,
      });
    } else {
      addAddress(formData.newAddress);
    }
    
    // Reset form
    setFormData((prev) => ({
      ...prev,
      newAddress: {
        streetAddress: "",
        buildingName: "",
        flatNo: "",
        area: "",
        emirate: "Dubai",
        country: "UAE",
        landmark: "",
        addressType: "Home",
        default: true,
        formattedAddress: "",
      },
    }));
    setShowAddressForm(false);
    setIsEditingAddress(false);
    setAddressToEdit(null);
  };

  const handleEditAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      newAddress: { ...address },
    }));
    setIsEditingAddress(true);
    setAddressToEdit(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
  };

  // Payment processing
  const handleCompleteOrder = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Incomplete Card Details", "Please enter complete card details.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const billingDetails = {
        email: formData.email,
        phone: formData.mobile,
        name: `${formData.firstName} ${formData.lastName}`,
      };

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        Alert.alert('Payment Failed', error.message);
      } else if (paymentIntent) {
        const response = await axiosInstance.get(
          `/payments/confirm/${paymentIntent.id}?orderId=${orderId}`
        );
        
        if (response.data.success) {
          clearCart();
          clearCheckoutData(); // Now this should work
          router.push('/shop/order-confirmation');
        } else {
          Alert.alert('Payment Error', 'Payment was processed but order confirmation failed.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', error.message || 'An error occurred during payment processing');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Render progress bar
  const renderProgressBar = () => (
    <View className="flex-row justify-between items-center px-4 py-6">
      <View
        className={`h-1 flex-1 ${
          currentStep >= 1 ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
      <View
        className={`h-1 flex-1 mx-1 ${
          currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
      <View
        className={`h-1 flex-1 ${
          currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    </View>
  );

  // Render Basic Details Step (unchanged)
  const renderBasicDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Basic Details</Text>

      <Text className="text-xs uppercase text-gray-500 mb-1">FIRST NAME</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        value={formData.firstName}
        onChangeText={(text) => handleInputChange("firstName", text)}
      />

      <Text className="text-xs uppercase text-gray-500 mb-1">LAST NAME</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        value={formData.lastName}
        onChangeText={(text) => handleInputChange("lastName", text)}
      />

      <Text className="text-xs uppercase text-gray-500 mb-1">EMAIL</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />

      <Text className="text-xs uppercase text-gray-500 mb-1">MOBILE</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Enter here..."
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={(text) => handleInputChange("mobile", text)}
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
          disabled={loading} // Disable next if loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#2976f3" />
          ) : (
            <>
              <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
              <Ionicons name="arrow-forward" size={16} color="#2976f3" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Address Details Step (mostly unchanged, added loading indicator)
  const renderAddressDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Address Details</Text>

      <ScrollView className="flex-1">
        {addresses.length === 0 ? (
          <Text className="text-gray-500 text-center mt-8">
            No addresses found. Add a new address below.
          </Text>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.addressId}
              className={`border ${
                formData.selectedAddressId === address.addressId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              } rounded-lg p-4 mb-4 flex-row items-start`}
              onPress={() => handleAddressSelect(address.addressId)}
            >
              <View className="mr-3 mt-1">
                <View
                  className={`w-5 h-5 rounded-full border ${
                    formData.selectedAddressId === address.addressId
                      ? "border-blue-500"
                      : "border-gray-400"
                  } flex items-center justify-center`}
                >
                  {formData.selectedAddressId === address.addressId && (
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-semibold text-gray-800 flex-1 pr-2">
                    {address.buildingName}, {address.flatNo},{" "}
                    {address.streetAddress}
                  </Text>
                  {address.default && (
                    <View className="bg-blue-100 px-2 py-0.5 rounded">
                      <Text className="text-blue-600 text-xs">Default</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  {address.formattedAddress ||
                    `${address.flatNo}, ${address.buildingName}, ${address.streetAddress}, ${address.area}, ${address.emirate}, ${address.country}`}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {address.addressType}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        className="flex-row items-center mb-6 mt-2"
        onPress={() => {
          setIsEditingAddress(false);
          setAddressToEdit(null);
          setFormData((prev) => ({
            ...prev,
            newAddress: {
              streetAddress: "",
              buildingName: "",
              flatNo: "",
              area: "",
              emirate: "Dubai",
              country: "UAE",
              landmark: "",
              addressType: "Home",
              default: true,
              formattedAddress: "",
            },
          }));
          setShowAddressForm(true);
        }}
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
          disabled={loading} // Disable next if creating payment intent
        >
          {loading ? (
            <ActivityIndicator size="small" color="#2976f3" />
          ) : (
            <>
              <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
              <Ionicons name="arrow-forward" size={16} color="#2976f3" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Add/Edit Address Modal (unchanged) */}
      <Modal
        visible={showAddressForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressForm(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-xl p-4 h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">
                {isEditingAddress ? "Edit Address" : "Add New Address"}
              </Text>
              <TouchableOpacity onPress={() => setShowAddressForm(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <Text className="text-xs uppercase text-gray-500 mb-1">
                STREET ADDRESS
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter street address"
                value={formData.newAddress.streetAddress}
                onChangeText={(text) =>
                  handleAddressInputChange("streetAddress", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                BUILDING NAME
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter building name"
                value={formData.newAddress.buildingName}
                onChangeText={(text) =>
                  handleAddressInputChange("buildingName", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                FLAT/VILLA NUMBER
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter flat or villa number"
                value={formData.newAddress.flatNo}
                onChangeText={(text) =>
                  handleAddressInputChange("flatNo", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">AREA</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter area"
                value={formData.newAddress.area}
                onChangeText={(text) => handleAddressInputChange("area", text)}
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                LANDMARK
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Nearby landmark"
                value={formData.newAddress.landmark}
                onChangeText={(text) =>
                  handleAddressInputChange("landmark", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                EMIRATE
              </Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="py-2"
                >
                  {emiratesOptions.map((emirate) => (
                    <TouchableOpacity
                      key={emirate}
                      className={`px-4 py-2 mx-1 rounded-full ${
                        formData.newAddress.emirate === emirate
                          ? "bg-blue-500"
                          : "bg-gray-100"
                      }`}
                      onPress={() => handleEmirateSelect(emirate)}
                    >
                      <Text
                        className={
                          formData.newAddress.emirate === emirate
                            ? "text-white"
                            : "text-gray-600"
                        }
                      >
                        {emirate}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text className="text-xs uppercase text-gray-500 mb-1">
                COUNTRY
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter country"
                value={formData.newAddress.country}
                onChangeText={(text) =>
                  handleAddressInputChange("country", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                ADDRESS TYPE
              </Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="py-2"
                >
                  {addressTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      className={`px-4 py-2 mx-1 rounded-full ${
                        formData.newAddress.addressType === type
                          ? "bg-blue-500"
                          : "bg-gray-100"
                      }`}
                      onPress={() => handleAddressTypeSelect(type)}
                    >
                      <Text
                        className={
                          formData.newAddress.addressType === type
                            ? "text-white"
                            : "text-gray-600"
                        }
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text className="text-xs uppercase text-gray-500 mb-1">
                FORMATTED ADDRESS
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Auto or manually formatted address"
                value={formData.newAddress.formattedAddress}
                onChangeText={(text) =>
                  handleAddressInputChange("formattedAddress", text)
                }
              />

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
                className="bg-blue-500 rounded-lg py-3 px-6 items-center"
                onPress={handleAddOrUpdateAddress}
              >
                <Text className="text-white font-semibold">
                  {isEditingAddress ? "Update Address" : "Save Address"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  // Render Payment Details Step (Stripe Integration)
  const renderPaymentDetailsStep = () => (
    <View className="px-4 flex-1">
  <Text className="text-xl font-bold mb-6">Payment Details</Text>

  {loading ? (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-4 text-gray-600">Initializing checkout...</Text>
    </View>
  ) : (
    <>
      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />

      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-3 px-6 mb-4 items-center"
        onPress={handleCompleteOrder}
        disabled={paymentProcessing}
      >
        <Text className="text-white font-semibold">
          {paymentProcessing ? 'Processing...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </>
  )}

  <View className="flex-row justify-between items-center mt-auto">
    <TouchableOpacity
      className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
      onPress={handleBack}
    >
      <Ionicons name="arrow-back" size={16} color="#2976f3" />
      <Text className="text-blue-600 font-semibold mr-2">Back</Text>
    </TouchableOpacity>
  </View>
</View>
  );

  return (
    <StripeWrapper>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {renderProgressBar()}

          {currentStep === 1 && renderBasicDetailsStep()}
          {currentStep === 2 && renderAddressDetailsStep()}
          {currentStep === 3 && renderPaymentDetailsStep()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeWrapper>
  );
}

