// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import  useCartStore  from '../../../src/store/cartStore';
// import useAddressStore from '../../../src/store/addressStore';
// import useCheckoutStore from '../../../src/store/checkoutStore';

// export default function Checkout() {
//   const router = useRouter();
//   const { cartItems, clearCart } = useCartStore();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [fetchedAddresses, setFetchedAddresses] = useState([]);
//   const [isEditingAddress, setIsEditingAddress] = useState(false);
//   const [formData, setFormData] = useState({
//     // Basic Details
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',
    
//     // Address Details
//     addresses: [],
//     selectedAddressId: null,
//     newAddress: {
//       streetAddress: '',
//       buildingName: '',
//       flatNo: 'c',
//       area: '',
//       emirate: 'Dubai',
//       country: 'UAE',
//       landmark: '',
//       addressType: 'Home',
//       default: true
//     },
    
//     // Payment Details
//     savedPaymentMethods: [],
//     selectedPaymentId: null,
//     showAddPayment: false,
//     savePaymentDetails: true,
//     cardNumber: '',
//     cardName: '',
//     expiryDate: '',
//     cvv: '',
//   });

//   const handleSelectAddress = (address) => {
//     setSelectedAddress(address);
//     formData.selectedAddressId = address.addressId;
    
//   };

//   // Sample addresses for demonstration
//   const sampleAddresses = [
//     { 
//       id: 1, 
//       title: 'D-32', 
//       description: 'Flat #304, Sameer Colony, Banjara Garden Street, India',
//       streetAddress: 'Banjara Garden Street',
//       buildingName: 'Sameer Colony',
//       flatNo: '304',
//       area: 'Banjara Hills',
//       emirate: 'Dubai',
//       country: 'UAE',
//       landmark: 'Near Park',
//       addressType: 'Home',
//       default: true
//     },
   
//   ];

//   const { addresses, addAddress, fetchAddresses,updatedAddresses,deleteAddress } = useAddressStore();
//   const {placeOrder } = useCheckoutStore();
//   useEffect(() => {
//     fetchAddresses()
//     setFetchedAddresses(addresses);

//   }, [fetchAddresses]);

//   const handleAddAddress = (data) => {
//     if(isEditingAddress==false) {
//       addAddress(data);
//       setShowAddressForm(false);
//     } else {
//       updatedAddresses(data, id);
//       setIsEditingAddress(false);
  
//   };
// }

//   const handleDeleteAddress = (id) => {
//     deleteAddress(id);
//     fetchAddresses()
//   };

//   // Sample payment methods for demonstration
//   const samplePaymentMethods = [
//     { id: 1, type: 'visa', lastFour: '4242', expiryDate: '12/25', name: 'John Doe', isDefault: true },
//     { id: 2, type: 'mastercard', lastFour: '5555', expiryDate: '10/24', name: 'John Doe', isDefault: false },
//   ];

//   // Emirates options for dropdown
//   const emiratesOptions = [
//     'Dubai',
//     'Abu Dhabi',
//     'Sharjah',
//     'Ajman',
//     'Umm Al Quwain',
//     'Ras Al Khaimah',
//     'Fujairah'
//   ];

//   // Address types
//   const addressTypes = ['Home', 'Office', 'Other'];

//   // Set sample data on component mount
//   React.useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       addresses: sampleAddresses,
//       selectedAddressId: sampleAddresses.find(addr => addr.default)?.id || sampleAddresses[0]?.id,
//       savedPaymentMethods: samplePaymentMethods,
//       selectedPaymentId: samplePaymentMethods.find(pm => pm.isDefault)?.id || null
//     }));
//   }, []);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleAddressInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         [field]: value
//       }
//     }));
//   };

//   const handleAddressSelect = (addressId) => {
//     setFormData(prev => ({
//       ...prev,
//       selectedAddressId: addressId
//     }));
//   };

//   const handlePaymentMethodSelect = (paymentId) => {
//     setFormData(prev => ({
//       ...prev,
//       selectedPaymentId: paymentId,
//       showAddPayment: false
//     }));
//   };

//   const toggleAddPayment = () => {
//     setFormData(prev => ({
//       ...prev,
//       showAddPayment: !prev.showAddPayment,
//       selectedPaymentId: prev.showAddPayment ? prev.savedPaymentMethods.find(pm => pm.isDefault)?.id || null : null
//     }));
//   };

//   const handleSavePaymentToggle = () => {
//     setFormData(prev => ({
//       ...prev,
//       savePaymentDetails: !prev.savePaymentDetails
//     }));
//   };

//   const handleAddressTypeSelect = (type) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         addressType: type
//       }
//     }));
//   };

//   const handleEmirateSelect = (emirate) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         emirate
//       }
//     }));
//   };

//   const handleDefaultAddressToggle = () => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         default: !prev.newAddress.default
//       }
//     }));
//   };

//   const handleAddNewAddress = () => {
//     // Validate address fields
//     const { streetAddress, buildingName, flatNo, area, emirate } = formData.newAddress;
//     if (!streetAddress || !buildingName || !flatNo || !area || !emirate) {
//       // Show error
//       return;
//     }

//     const newAddress = {
//       id: Date.now(),
//       title: `${formData.newAddress.buildingName}, ${formData.newAddress.flatNo}`,
//       description: `${formData.newAddress.flatNo}, ${formData.newAddress.buildingName}, ${formData.newAddress.streetAddress}, ${formData.newAddress.area}, ${formData.newAddress.emirate}`,
//       ...formData.newAddress
//     };

//     // If this is set as default, update other addresses
//     let updatedAddresses = [...formData.addresses];
//     if (newAddress.default) {
//       updatedAddresses = updatedAddresses.map(addr => ({
//         ...addr,
//         default: false
//       }));
//     }

//     setFormData(prev => ({
//       ...prev,
//       addresses: [...updatedAddresses, newAddress],
//       selectedAddressId: newAddress.id,
//       newAddress: {
//         streetAddress: '',
//         buildingName: '',
//         flatNo: '',
//         area: '',
//         emirate: 'Dubai',
//         country: 'UAE',
//         landmark: '',
//         addressType: 'Home',
//         default: true
//       }
//     }));

//     setShowAddressForm(false);
//   };

//   const handleAddPaymentMethod = () => {
//     // Validate payment details
//     if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
//       // Show error
//       return;
//     }

//     const newPaymentMethod = {
//       id: Date.now(),
//       type: getCardType(formData.cardNumber),
//       lastFour: formData.cardNumber.slice(-4),
//       expiryDate: formData.expiryDate,
//       name: formData.cardName,
//       isDefault: formData.savedPaymentMethods.length === 0
//     };

//     setFormData(prev => ({
//       ...prev,
//       savedPaymentMethods: [...prev.savedPaymentMethods, newPaymentMethod],
//       selectedPaymentId: newPaymentMethod.id,
//       showAddPayment: false,
//       cardNumber: '',
//       cardName: '',
//       expiryDate: '',
//       cvv: ''
//     }));
//   };

//   // Helper function to determine card type based on number
//   const getCardType = (number) => {
//     const firstDigit = number.charAt(0);
//     if (firstDigit === '4') return 'visa';
//     if (firstDigit === '5') return 'mastercard';
//     if (firstDigit === '3') return 'amex';
//     return 'card';
//   };

//   const handleNext = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       // Process payment and complete order
//       handleCompleteOrder();
//     }
//   };
  

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     } else {
//       router.back();
//     }
//   };

//   const handleCompleteOrder = () => {
//     // Create payload for order
//     const selectedAddress = formData.addresses.find(addr => addr.id === formData.selectedAddressId);
//     const selectedPayment = formData.savedPaymentMethods.find(pm => pm.id === formData.selectedPaymentId);
    
  
    
//     const finalPayload = {
//       cartId: cartItems.cartId,
//       firstName: firstName,
//       lastName: lastName,
//       email: email,
//       mobile: mobile,
//       addressId: selectedAddress.addressId,
//     }
//     placeOrder(finalPayload);
    
//     console.log('Order Payload:', finalPayload);
    
//     // Process order completion logic here
//     clearCart();
//     router.replace('/order-confirmation');
//   };


//   // Render progress bar
//   const renderProgressBar = () => (
//     <View className="flex-row justify-between items-center px-4 py-6">
//       <View className={`h-1 flex-1 ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//       <View className={`h-1 flex-1 mx-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//       <View className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//     </View>
//   );

//   // Render Basic Details Step
//   const renderBasicDetailsStep = () => (
//     <View className="px-4 flex-1">
//       <Text className="text-xl font-bold mb-6">Basic Details</Text>
      
//       <Text className="text-xs uppercase text-gray-500 mb-1">FIRST NAME</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         value={formData.firstName}
//         onChangeText={(text) => handleInputChange('firstName', text)}
//       />
      
//       <Text className="text-xs uppercase text-gray-500 mb-1">LAST NAME</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         value={formData.lastName}
//         onChangeText={(text) => handleInputChange('lastName', text)}
//       />
      
//       <Text className="text-xs uppercase text-gray-500 mb-1">EMAIL</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         keyboardType="email-address"
//         value={formData.email}
//         onChangeText={(text) => handleInputChange('email', text)}
//       />
      
//       <Text className="text-xs uppercase text-gray-500 mb-1">MOBILE</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         keyboardType="phone-pad"
//         value={formData.mobile}
//         onChangeText={(text) => handleInputChange('mobile', text)}
//       />
      
//       <View className="flex-1 " />

//       <View className="flex-row justify-between items-center">
//         <TouchableOpacity 
//           className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleBack}
//         >
//           <Ionicons name="arrow-back" size={16} color="#2976f3" />
//           <Text className="text-blue-600 font-semibold mr-2">Back</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleNext}
//         >
//           <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
//           <Ionicons name="arrow-forward" size={16} color="#2976f3" />
//         </TouchableOpacity>
//       </View>

     
//     </View>
//   );



// const renderAddressDetailsStep = () => (
//   <View className="px-4 flex-1">
//     <Text className="text-xl font-bold mb-6">Address Details</Text>

//     <ScrollView className="flex-1">
//       {addresses.map((address) => (
//         <TouchableOpacity
//           key={address.addressId} // Use address.id as the key
//           className={`border ${formData.selectedAddressId === address.addressId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
//           onPress={() => handleSelectAddress(address)} // Pass address.id
//         >
//           <View className="mr-3 mt-1">
//             <View className={`w-5 h-5 rounded-full border ${formData.selectedAddressId === address.addressId ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
//               {formData.selectedAddressId === address.addressId && (
//                 <View className="w-3 h-3 rounded-full bg-blue-500" />
//               )}
//             </View>
//           </View>
//           <View className="flex-1">
//             <View className="flex-row justify-between">
//               {/* Display a more descriptive title, perhaps buildingName, flatNo, streetAddress */}
//               <Text className="font-semibold text-gray-800">
//                 {address.buildingName}, {address.flatNo}, {address.streetAddress}
//               </Text>
//               {address.default && (
//                 <View className="bg-blue-100 px-2 py-0.5 rounded">
//                   <Text className="text-blue-600 text-xs">Default</Text>
//                 </View>
//               )}
//             </View>
//             {/* Display formatted address or a combination of fields */}
//             <Text className="text-gray-500 text-sm mt-1">
//               {address.formattedAddress || `${address.flatNo}, ${address.buildingName}, ${address.streetAddress}, ${address.area}, ${address.emirate}, ${address.country}`}
//             </Text>
//             <Text className="text-gray-400 text-xs mt-1">{address.addressType}</Text>
//             <View className="flex justify-end mt-2 w-full">
//               {/* <TouchableOpacity onPress={() => handleAddAddress(address)} className="mr-4">
//                 <Text className="text-blue-500">Edit</Text>
//               </TouchableOpacity> */}
//               <TouchableOpacity onPress={() => handleDeleteAddress(address.addressId)}>
//                 <Ionicons name="trash-outline" size={16} color="#ff0000" />
               
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>

//     <TouchableOpacity
//       className="flex-row items-center mb-6 mt-2"
//       onPress={() => {
//         setIsEditingAddress(false); // Ensure we are in add mode
//         // setAddressToEdit(null);    // Clear any address being edited
//         setShowAddressForm(true);
//       }}
//     >
//       <Ionicons name="add-circle-outline" size={20} color="#2976f3" />
//       <Text className="text-blue-600 ml-2">Add New Address</Text>
//     </TouchableOpacity>

//     <View className="flex-row justify-between items-center">
//       <TouchableOpacity
//         className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//         onPress={handleBack}
//       >
//         <Ionicons name="arrow-back" size={16} color="#2976f3" />
//         <Text className="text-blue-600 font-semibold mr-2">Back</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//         onPress={handleNext}
//       >
//         <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
//         <Ionicons name="arrow-forward" size={16} color="#2976f3" />
//       </TouchableOpacity>
//     </View>

//     {/* The Address Modal (as provided in your previous response) */}
//     {/* You should replace the existing modal in your Checkout.js with the one below */}
//     <Modal
//       visible={showAddressForm}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowAddressForm(false)}
//     >
//       <View className="flex-1 bg-black/50 justify-end">
//         <View className="bg-white rounded-t-xl p-4 h-5/6">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-xl font-bold">{isEditingAddress ? 'Edit Address' : 'Add New Address'}</Text>
//             <TouchableOpacity onPress={() => setShowAddressForm(false)}>
//               <Ionicons name="close" size={24} color="black" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView className="flex-1">
//             <Text className="text-xs uppercase text-gray-500 mb-1">STREET ADDRESS</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Enter street address"
//               value={formData.newAddress.streetAddress}
//               onChangeText={(text) => handleAddressInputChange('streetAddress', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">BUILDING NAME</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Enter building name"
//               value={formData.newAddress.buildingName}
//               onChangeText={(text) => handleAddressInputChange('buildingName', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">FLAT/VILLA NUMBER</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Enter flat or villa number"
//               value={formData.newAddress.flatNo}
//               onChangeText={(text) => handleAddressInputChange('flatNo', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">AREA</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Enter area"
//               value={formData.newAddress.area}
//               onChangeText={(text) => handleAddressInputChange('area', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">LANDMARK</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Nearby landmark"
//               value={formData.newAddress.landmark}
//               onChangeText={(text) => handleAddressInputChange('landmark', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">EMIRATE</Text>
//             <View className="border border-gray-300 rounded-lg mb-4">
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
//                 {emiratesOptions.map((emirate) => (
//                   <TouchableOpacity
//                     key={emirate}
//                     className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.emirate === emirate ? 'bg-blue-500' : 'bg-gray-100'}`}
//                     onPress={() => handleEmirateSelect(emirate)}
//                   >
//                     <Text className={formData.newAddress.emirate === emirate ? 'text-white' : 'text-gray-600'}>{emirate}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             <Text className="text-xs uppercase text-gray-500 mb-1">COUNTRY</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Enter country"
//               value={formData.newAddress.country}
//               onChangeText={(text) => handleAddressInputChange('country', text)}
//             />

//             <Text className="text-xs uppercase text-gray-500 mb-1">ADDRESS TYPE</Text>
//             <View className="border border-gray-300 rounded-lg mb-4">
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
//                 {addressTypes.map((type) => (
//                   <TouchableOpacity
//                     key={type}
//                     className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.addressType === type ? 'bg-blue-500' : 'bg-gray-100'}`}
//                     onPress={() => handleAddressTypeSelect(type)}
//                   >
//                     <Text className={formData.newAddress.addressType === type ? 'text-white' : 'text-gray-600'}>{type}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>

//             <Text className="text-xs uppercase text-gray-500 mb-1">FORMATTED ADDRESS</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//               placeholder="Auto or manually formatted address"
//               value={formData.newAddress.formattedAddress}
//               onChangeText={(text) => handleAddressInputChange('formattedAddress', text)}
//             />

//             <View className="flex-row items-center mb-4">
//               <Switch
//                 trackColor={{ false: "#cccccc", true: "#22c55e" }}
//                 thumbColor="#ffffff"
//                 ios_backgroundColor="#cccccc"
//                 onValueChange={handleDefaultAddressToggle}
//                 value={formData.newAddress.default}
//               />
//               <Text className="ml-2">Set as default address</Text>
//             </View>

//             <TouchableOpacity
//               className="bg-blue-500 rounded-lg py-3 px-6 items-center"
//               onPress={()=>handleAddAddress(formData.newAddress)}

//             >
//               <Text className="text-white font-semibold">{isEditingAddress ? 'Update Address' : 'Save Address'}</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   </View>
// );


//   // Render Payment Details Step
//   const renderPaymentDetailsStep = () => (
//     <View className="px-4 flex-1">
//       <Text className="text-xl font-bold mb-6">Payment Details</Text>
      
//       <ScrollView className="flex-1">
//         {/* Saved Payment Methods */}
//         {formData.savedPaymentMethods.length > 0 && !formData.showAddPayment && (
//           <>
//             {formData.savedPaymentMethods.map((payment) => (
//               <TouchableOpacity 
//                 key={payment.id}
//                 className={`border ${formData.selectedPaymentId === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
//                 onPress={() => handlePaymentMethodSelect(payment.id)}
//               >
//                 <View className="mr-3 mt-1">
//                   <View className={`w-5 h-5 rounded-full border ${formData.selectedPaymentId === payment.id ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
//                     {formData.selectedPaymentId === payment.id && (
//                       <View className="w-3 h-3 rounded-full bg-blue-500" />
//                     )}
//                   </View>
//                 </View>
//                 <View className="flex-1">
//                   <View className="flex-row items-center">
//                     <Ionicons 
//                       name={payment.type === 'visa' ? 'card' : payment.type === 'mastercard' ? 'card' : 'card'} 
//                       size={20} 
//                       color="#3b82f6" 
//                     />
//                     <Text className="font-semibold text-gray-800 ml-2">
//                       {payment.type === 'visa' ? 'Visa' : payment.type === 'mastercard' ? 'Mastercard' : 'Card'} •••• {payment.lastFour}
//                     </Text>
//                   </View>
//                   <Text className="text-gray-500 text-sm mt-1">Expires {payment.expiryDate}</Text>
//                   <Text className="text-gray-500 text-sm">{payment.name}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
            
//             <TouchableOpacity 
//               className="flex-row items-center mb-6 mt-2"
//               onPress={toggleAddPayment}
//             >
//               <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
//               <Text className="text-blue-500 ml-2">Add New Payment Method</Text>
//             </TouchableOpacity>
//           </>
//         )}
        
        
//         {/* Add New Payment Method Form */}
//         {(formData.showAddPayment || formData.savedPaymentMethods.length === 0) && (
//           <View className="border border-gray-300 rounded-lg p-4 mb-4">
//             <Text className="text-xs uppercase text-gray-500 mb-1">Credit Card</Text>
//             <TextInput
//               className="border-b border-gray-200 py-2 mb-3"
//               placeholder="Card Number"
//               keyboardType="number-pad"
//               value={formData.cardNumber}
//               onChangeText={(text) => handleInputChange('cardNumber', text)}
//             />
            
//             <TextInput
//               className="border-b border-gray-200 py-2 mb-3"
//               placeholder="Cardholder Name"
//               value={formData.cardName}
//               onChangeText={(text) => handleInputChange('cardName', text)}
//             />
            
//             <View className="flex-row mb-4">
//               <TextInput
//                 className="border-b border-gray-200 py-2 flex-1 mr-4"
//                 placeholder="MM/YY"
//                 keyboardType="number-pad"
//                 value={formData.expiryDate}
//                 onChangeText={(text) => handleInputChange('expiryDate', text)}
//               />
              
//               <TextInput
//                 className="border-b border-gray-200 py-2 w-20"
//                 placeholder="CVV"
//                 keyboardType="number-pad"
//                 secureTextEntry
//                 value={formData.cvv}
//                 onChangeText={(text) => handleInputChange('cvv', text)}
//               />
//             </View>
            
//             <View className="flex-row items-center justify-between mb-4">
//               <Text className="text-gray-700">Save this card for future use</Text>
//               <Switch
//                 trackColor={{ false: "#cccccc", true: "#22c55e" }}
//                 thumbColor="#ffffff"
//                 ios_backgroundColor="#cccccc"
//                 onValueChange={handleSavePaymentToggle}
//                 value={formData.savePaymentDetails}
//               />
//             </View>
            
//             <View className="flex-row justify-between">
//               {formData.savedPaymentMethods.length > 0 && (
//                 <TouchableOpacity 
//                   className="border border-gray-300 rounded-lg py-2 px-4"
//                   onPress={toggleAddPayment}
//                 >
//                   <Text className="text-gray-500">Cancel</Text>
//                 </TouchableOpacity>
//               )}
              
//               <TouchableOpacity 
//                 className="bg-blue-500 rounded-lg py-2 px-4 ml-auto"
//                 onPress={handleAddPaymentMethod}
//               >
//                 <Text className="text-white text-center font-semibold">Save Card</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </ScrollView>
      
//       <TouchableOpacity 
//         className="bg-blue-600 rounded-lg py-3 px-6 mb-4 items-center"
//         onPress={handleCompleteOrder}
//         disabled={!formData.selectedPaymentId && !formData.showAddPayment}
//       >
//         <Text className="text-white font-semibold">CONFIRM YOUR ORDER</Text>
//       </TouchableOpacity>
//     </View>
//   );


//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         {/* Header */}
       
        
//         {/* Progress Bar */}
//         {renderProgressBar()}
        
//         {/* Step Content */}
//         {currentStep === 1 && renderBasicDetailsStep()}
//         {currentStep === 2 && renderAddressDetailsStep()}
//         {currentStep === 3 && renderPaymentDetailsStep()}
        
//         {/* Bottom Navigation */}
    
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );

// }

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import useCartStore from '../../../src/store/cartStore';
// import useAddressStore from '../../../src/store/addressStore';
// import useCheckoutStore from '../../../src/store/checkoutStore';

// export default function Checkout() {
//   const router = useRouter();
//   const { cartItems, clearCart } = useCartStore();
//   const { addresses, addAddress, fetchAddresses, updateAddress, deleteAddress } = useAddressStore(); // Corrected: Renamed updatedAddresses to updateAddress
//   const { placeOrder } = useCheckoutStore();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [isEditingAddress, setIsEditingAddress] = useState(false);
//   const [addressToEdit, setAddressToEdit] = useState(null); // State to hold the address being edited

//   const [formData, setFormData] = useState({
//     // Basic Details
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',

//     // Address Details
//     selectedAddressId: null,
//     newAddress: {
//       streetAddress: '',
//       buildingName: '',
//       flatNo: '',
//       area: '',
//       emirate: 'Dubai',
//       country: 'UAE',
//       landmark: '',
//       addressType: 'Home',
//       default: true,
//       formattedAddress: '', // Added formattedAddress to newAddress state
//     },

//     // Payment Details
//     savedPaymentMethods: [],
//     selectedPaymentId: null,
//     showAddPayment: false,
//     savePaymentDetails: true,
//     cardNumber: '',
//     cardName: '',
//     expiryDate: '',
//     cvv: '',
//   });

//   // Fetch addresses on component mount and update when addresses change in store
//   useEffect(() => {
//     fetchAddresses();
//     // Set initial selected address if addresses are available
//     if (addresses.length > 0 && !formData.selectedAddressId) {
//       const defaultAddr = addresses.find(addr => addr.default) || addresses[0];
//       setFormData(prev => ({
//         ...prev,
//         selectedAddressId: defaultAddr ? defaultAddr.addressId : null
//       }));
//     }
//   }, [fetchAddresses]); // Depend on 'addresses' from the store too

//   // Handler for adding or updating an address
//   const handleAddOrUpdateAddress = () => {
//     // Basic validation
//     const { streetAddress, buildingName, flatNo, area, emirate, country } = formData.newAddress;
//     if (!streetAddress || !buildingName || !flatNo || !area || !emirate || !country) {
//       alert('Please fill all required address fields.');
//       return;
//     }

//     if (isEditingAddress && addressToEdit) {
//       // Update existing address
//       updateAddress({ ...formData.newAddress, addressId: addressToEdit.addressId });
//     } else {
//       // Add new address
//       addAddress(formData.newAddress);
//     }
//     // Reset form and close modal
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         streetAddress: '',
//         buildingName: '',
//         flatNo: '',
//         area: '',
//         emirate: 'Dubai',
//         country: 'UAE',
//         landmark: '',
//         addressType: 'Home',
//         default: true,
//         formattedAddress: '',
//       }
//     }));
//     setShowAddressForm(false);
//     setIsEditingAddress(false);
//     setAddressToEdit(null);
//   };


//   const handleDeleteAddress = (id) => {
//     deleteAddress(id);
//   };

//   const handleEditAddress = (address) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: { ...address } // Pre-fill the form with the address data
//     }));
//     setIsEditingAddress(true);
//     setAddressToEdit(address); // Store the address being edited
//     setShowAddressForm(true);
//   };

//   // Sample payment methods for demonstration (already integrated)
//   const samplePaymentMethods = [
//     { id: 1, type: 'visa', lastFour: '4242', expiryDate: '12/25', name: 'John Doe', isDefault: true },
//     { id: 2, type: 'mastercard', lastFour: '5555', expiryDate: '10/24', name: 'John Doe', isDefault: false },
//   ];

//   // Emirates options for dropdown
//   const emiratesOptions = [
//     'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
//   ];

//   // Address types
//   const addressTypes = ['Home', 'Office', 'Other'];

//   // Set sample data on component mount
//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       savedPaymentMethods: samplePaymentMethods,
//       selectedPaymentId: samplePaymentMethods.find(pm => pm.isDefault)?.id || null
//     }));
//   }, []); // Run only once on mount

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleAddressInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         [field]: value
//       }
//     }));
//   };

//   const handleAddressSelect = (addressId) => {
//     setFormData(prev => ({
//       ...prev,
//       selectedAddressId: addressId
//     }));
//   };

//   const handlePaymentMethodSelect = (paymentId) => {
//     setFormData(prev => ({
//       ...prev,
//       selectedPaymentId: paymentId,
//       showAddPayment: false
//     }));
//   };

//   const toggleAddPayment = () => {
//     setFormData(prev => ({
//       ...prev,
//       showAddPayment: !prev.showAddPayment,
//       selectedPaymentId: prev.showAddPayment ? prev.savedPaymentMethods.find(pm => pm.isDefault)?.id || null : null
//     }));
//   };

//   const handleSavePaymentToggle = () => {
//     setFormData(prev => ({
//       ...prev,
//       savePaymentDetails: !prev.savePaymentDetails
//     }));
//   };

//   const handleAddressTypeSelect = (type) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         addressType: type
//       }
//     }));
//   };

//   const handleEmirateSelect = (emirate) => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         emirate
//       }
//     }));
//   };

//   const handleDefaultAddressToggle = () => {
//     setFormData(prev => ({
//       ...prev,
//       newAddress: {
//         ...prev.newAddress,
//         default: !prev.newAddress.default
//       }
//     }));
//   };

//   const handleAddPaymentMethod = () => {
//     // Validate payment details
//     if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
//       alert('Please fill all payment details.');
//       return;
//     }

//     const newPaymentMethod = {
//       id: Date.now(),
//       type: getCardType(formData.cardNumber),
//       lastFour: formData.cardNumber.slice(-4),
//       expiryDate: formData.expiryDate,
//       name: formData.cardName,
//       isDefault: formData.savedPaymentMethods.length === 0
//     };

//     setFormData(prev => ({
//       ...prev,
//       savedPaymentMethods: [...prev.savedPaymentMethods, newPaymentMethod],
//       selectedPaymentId: newPaymentMethod.id,
//       showAddPayment: false,
//       cardNumber: '',
//       cardName: '',
//       expiryDate: '',
//       cvv: ''
//     }));
//   };

//   // Helper function to determine card type based on number
//   const getCardType = (number) => {
//     const firstDigit = number.charAt(0);
//     if (firstDigit === '4') return 'visa';
//     if (firstDigit === '5') return 'mastercard';
//     if (firstDigit === '3') return 'amex';
//     return 'card'; // Default
//   };

//   const handleNext = () => {
//     if (currentStep === 1) {
//       // Validate Basic Details
//       const { firstName, lastName, email, mobile } = formData;
//       if (!firstName || !lastName || !email || !mobile) {
//         alert('Please fill all basic details.');
//         return;
//       }
//     } else if (currentStep === 2) {
//       // Validate Address Details
//       if (!formData.selectedAddressId) {
//         alert('Please select an address.');
//         return;
//       }
//     }
//     setCurrentStep(currentStep + 1);
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     } else {
//       router.back();
//     }
//   };

//   const handleCompleteOrder = () => {
//     // Validate Payment Details
//     if (!formData.selectedPaymentId && formData.savedPaymentMethods.length === 0) {
//       alert('Please add or select a payment method.');
//       return;
//     }
//     // If no payment method is selected but 'Add New Payment Method' form is open, try to add it.
//     if (!formData.selectedPaymentId && formData.showAddPayment) {
//       handleAddPaymentMethod(); // This will set selectedPaymentId if successful
//       if (!formData.selectedPaymentId) { // Check again after attempting to add
//         alert('Please complete the new payment method details.');
//         return;
//       }
//     }


//     const selectedAddress = addresses.find(addr => addr.addressId === formData.selectedAddressId);
//     const selectedPayment = formData.savedPaymentMethods.find(pm => pm.id === formData.selectedPaymentId);

//     if (!selectedAddress) {
//       alert('No address selected. Please select an address.');
//       return;
//     }
//     if (!selectedPayment) {
//       alert('No payment method selected. Please select or add a payment method.');
//       return;
//     }

//     // Construct dummy payment data
//     const dummyPaymentData = {
//       paymentMethodId: selectedPayment.id,
//       type: selectedPayment.type,
//       lastFour: selectedPayment.lastFour,
//       expiryDate: selectedPayment.expiryDate,
//       cardholderName: selectedPayment.name,
//       transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Dummy transaction ID
//       amount: cartItems.totalPrice, // Assuming cartItems has totalPrice
//       currency: 'AED', // Example currency
//       status: 'Paid', // Dummy status
//     };

//     const orderPayload = {
//       cartId: cartItems.cartId, // Make sure your cartStore provides a cartId
    
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       email: formData.email,
//       mobile: formData.mobile,
//       addressId: selectedAddress.addressId, // Pass the full selected address object
//       // paymentDetails: dummyPaymentData, // Include dummy payment data
//       // items: cartItems.items.map(item => ({ // Assuming cartItems.items is an array of products
//       //   productId: item.productId,
//       //   name: item.name,
//       //   quantity: item.quantity,
//       //   price: item.price,
//       // })),
//       // totalAmount: cartItems.totalPrice,
//       // orderDate: new Date().toISOString(),
//       // status: 'Pending',
//     };

//     console.log('Order Payload:', JSON.stringify(orderPayload, null, 2));

//     // Call the placeOrder action from checkoutStore
//     placeOrder(orderPayload);

//     // Clear cart and navigate to order confirmation
//     clearCart();
//     router.replace('/order-confirmation');
//   };

//   // Render progress bar
//   const renderProgressBar = () => (
//     <View className="flex-row justify-between items-center px-4 py-6">
//       <View className={`h-1 flex-1 ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//       <View className={`h-1 flex-1 mx-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//       <View className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`} />
//     </View>
//   );

//   // Render Basic Details Step
//   const renderBasicDetailsStep = () => (
//     <View className="px-4 flex-1">
//       <Text className="text-xl font-bold mb-6">Basic Details</Text>

//       <Text className="text-xs uppercase text-gray-500 mb-1">FIRST NAME</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         value={formData.firstName}
//         onChangeText={(text) => handleInputChange('firstName', text)}
//       />

//       <Text className="text-xs uppercase text-gray-500 mb-1">LAST NAME</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         value={formData.lastName}
//         onChangeText={(text) => handleInputChange('lastName', text)}
//       />

//       <Text className="text-xs uppercase text-gray-500 mb-1">EMAIL</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         keyboardType="email-address"
//         value={formData.email}
//         onChangeText={(text) => handleInputChange('email', text)}
//       />

//       <Text className="text-xs uppercase text-gray-500 mb-1">MOBILE</Text>
//       <TextInput
//         className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//         placeholder="Enter here..."
//         keyboardType="phone-pad"
//         value={formData.mobile}
//         onChangeText={(text) => handleInputChange('mobile', text)}
//       />

//       <View className="flex-1 " />

//       <View className="flex-row justify-between items-center">
//         <TouchableOpacity
//           className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleBack}
//         >
//           <Ionicons name="arrow-back" size={16} color="#2976f3" />
//           <Text className="text-blue-600 font-semibold mr-2">Back</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleNext}
//         >
//           <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
//           <Ionicons name="arrow-forward" size={16} color="#2976f3" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderAddressDetailsStep = () => (
//     <View className="px-4 flex-1">
//       <Text className="text-xl font-bold mb-6">Address Details</Text>

//       <ScrollView className="flex-1">
//         {addresses.length === 0 ? (
//           <Text className="text-gray-500 text-center mt-8">No addresses found. Add a new address below.</Text>
//         ) : (
//           addresses.map((address) => (
//             <TouchableOpacity
//               key={address.addressId}
//               className={`border ${formData.selectedAddressId === address.addressId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
//               onPress={() => handleAddressSelect(address.addressId)}
//             >
//               <View className="mr-3 mt-1">
//                 <View className={`w-5 h-5 rounded-full border ${formData.selectedAddressId === address.addressId ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
//                   {formData.selectedAddressId === address.addressId && (
//                     <View className="w-3 h-3 rounded-full bg-blue-500" />
//                   )}
//                 </View>
//               </View>
//               <View className="flex-1">
//                 <View className="flex-row justify-between items-start">
//                   <Text className="font-semibold text-gray-800 flex-1 pr-2">
//                     {address.buildingName}, {address.flatNo}, {address.streetAddress}
//                   </Text>
//                   {address.default && (
//                     <View className="bg-blue-100 px-2 py-0.5 rounded">
//                       <Text className="text-blue-600 text-xs">Default</Text>
//                     </View>
//                   )}
//                 </View>
//                 <Text className="text-gray-500 text-sm mt-1">
//                   {address.formattedAddress || `${address.flatNo}, ${address.buildingName}, ${address.streetAddress}, ${address.area}, ${address.emirate}, ${address.country}`}
//                 </Text>
//                 <Text className="text-gray-400 text-xs mt-1">{address.addressType}</Text>
//                 <View className="flex-row justify-end mt-2 w-full">
//                   <TouchableOpacity onPress={() => handleEditAddress(address)} className="mr-4">
//                     <Text className="text-blue-500">Edit</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => handleDeleteAddress(address.addressId)}>
//                     <Text className="text-red-500">Delete</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
//       </ScrollView>

//       <TouchableOpacity
//         className="flex-row items-center mb-6 mt-2"
//         onPress={() => {
//           setIsEditingAddress(false); // Ensure we are in add mode
//           setAddressToEdit(null);    // Clear any address being edited
//           setFormData(prev => ({
//             ...prev,
//             newAddress: { // Reset newAddress form
//               streetAddress: '',
//               buildingName: '',
//               flatNo: '',
//               area: '',
//               emirate: 'Dubai',
//               country: 'UAE',
//               landmark: '',
//               addressType: 'Home',
//               default: true,
//               formattedAddress: '',
//             }
//           }));
//           setShowAddressForm(true);
//         }}
//       >
//         <Ionicons name="add-circle-outline" size={20} color="#2976f3" />
//         <Text className="text-blue-600 ml-2">Add New Address</Text>
//       </TouchableOpacity>

//       <View className="flex-row justify-between items-center">
//         <TouchableOpacity
//           className="bg-blue-50 border border-blue-600 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleBack}
//         >
//           <Ionicons name="arrow-back" size={16} color="#2976f3" />
//           <Text className="text-blue-600 font-semibold mr-2">Back</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className=" border border-blue-600 bg-blue-50 rounded-lg py-3 px-6 mb-4 flex-row items-center justify-center"
//           onPress={handleNext}
//         >
//           <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
//           <Ionicons name="arrow-forward" size={16} color="#2976f3" />
//         </TouchableOpacity>
//       </View>

//       {/* Add/Edit Address Modal */}
//       <Modal
//         visible={showAddressForm}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowAddressForm(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-end">
//           <View className="bg-white rounded-t-xl p-4 h-5/6">
//             <View className="flex-row justify-between items-center mb-4">
//               <Text className="text-xl font-bold">{isEditingAddress ? 'Edit Address' : 'Add New Address'}</Text>
//               <TouchableOpacity onPress={() => setShowAddressForm(false)}>
//                 <Ionicons name="close" size={24} color="black" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView className="flex-1">
//               <Text className="text-xs uppercase text-gray-500 mb-1">STREET ADDRESS</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Enter street address"
//                 value={formData.newAddress.streetAddress}
//                 onChangeText={(text) => handleAddressInputChange('streetAddress', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">BUILDING NAME</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Enter building name"
//                 value={formData.newAddress.buildingName}
//                 onChangeText={(text) => handleAddressInputChange('buildingName', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">FLAT/VILLA NUMBER</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Enter flat or villa number"
//                 value={formData.newAddress.flatNo}
//                 onChangeText={(text) => handleAddressInputChange('flatNo', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">AREA</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Enter area"
//                 value={formData.newAddress.area}
//                 onChangeText={(text) => handleAddressInputChange('area', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">LANDMARK</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Nearby landmark"
//                 value={formData.newAddress.landmark}
//                 onChangeText={(text) => handleAddressInputChange('landmark', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">EMIRATE</Text>
//               <View className="border border-gray-300 rounded-lg mb-4">
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
//                   {emiratesOptions.map((emirate) => (
//                     <TouchableOpacity
//                       key={emirate}
//                       className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.emirate === emirate ? 'bg-blue-500' : 'bg-gray-100'}`}
//                       onPress={() => handleEmirateSelect(emirate)}
//                     >
//                       <Text className={formData.newAddress.emirate === emirate ? 'text-white' : 'text-gray-600'}>{emirate}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>

//               <Text className="text-xs uppercase text-gray-500 mb-1">COUNTRY</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Enter country"
//                 value={formData.newAddress.country}
//                 onChangeText={(text) => handleAddressInputChange('country', text)}
//               />

//               <Text className="text-xs uppercase text-gray-500 mb-1">ADDRESS TYPE</Text>
//               <View className="border border-gray-300 rounded-lg mb-4">
//                 <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
//                   {addressTypes.map((type) => (
//                     <TouchableOpacity
//                       key={type}
//                       className={`px-4 py-2 mx-1 rounded-full ${formData.newAddress.addressType === type ? 'bg-blue-500' : 'bg-gray-100'}`}
//                       onPress={() => handleAddressTypeSelect(type)}
//                     >
//                       <Text className={formData.newAddress.addressType === type ? 'text-white' : 'text-gray-600'}>{type}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </ScrollView>
//               </View>

//               <Text className="text-xs uppercase text-gray-500 mb-1">FORMATTED ADDRESS</Text>
//               <TextInput
//                 className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
//                 placeholder="Auto or manually formatted address"
//                 value={formData.newAddress.formattedAddress}
//                 onChangeText={(text) => handleAddressInputChange('formattedAddress', text)}
//               />

//               <View className="flex-row items-center mb-4">
//                 <Switch
//                   trackColor={{ false: "#cccccc", true: "#22c55e" }}
//                   thumbColor="#ffffff"
//                   ios_backgroundColor="#cccccc"
//                   onValueChange={handleDefaultAddressToggle}
//                   value={formData.newAddress.default}
//                 />
//                 <Text className="ml-2">Set as default address</Text>
//               </View>

//               <TouchableOpacity
//                 className="bg-blue-500 rounded-lg py-3 px-6 items-center"
//                 onPress={handleAddOrUpdateAddress}
//               >
//                 <Text className="text-white font-semibold">{isEditingAddress ? 'Update Address' : 'Save Address'}</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );

//   // Render Payment Details Step
//   const renderPaymentDetailsStep = () => (
//     <View className="px-4 flex-1">
//       <Text className="text-xl font-bold mb-6">Payment Details</Text>

//       <ScrollView className="flex-1">
//         {/* Saved Payment Methods */}
//         {formData.savedPaymentMethods.length > 0 && !formData.showAddPayment && (
//           <>
//             {formData.savedPaymentMethods.map((payment) => (
//               <TouchableOpacity
//                 key={payment.id}
//                 className={`border ${formData.selectedPaymentId === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
//                 onPress={() => handlePaymentMethodSelect(payment.id)}
//               >
//                 <View className="mr-3 mt-1">
//                   <View className={`w-5 h-5 rounded-full border ${formData.selectedPaymentId === payment.id ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
//                     {formData.selectedPaymentId === payment.id && (
//                       <View className="w-3 h-3 rounded-full bg-blue-500" />
//                     )}
//                   </View>
//                 </View>
//                 <View className="flex-1">
//                   <View className="flex-row items-center">
//                     <Ionicons
//                       name={payment.type === 'visa' ? 'card' : payment.type === 'mastercard' ? 'card' : 'card'}
//                       size={20}
//                       color="#3b82f6"
//                     />
//                     <Text className="font-semibold text-gray-800 ml-2">
//                       {payment.type === 'visa' ? 'Visa' : payment.type === 'mastercard' ? 'Mastercard' : 'Card'} •••• {payment.lastFour}
//                     </Text>
//                   </View>
//                   <Text className="text-gray-500 text-sm mt-1">Expires {payment.expiryDate}</Text>
//                   <Text className="text-gray-500 text-sm">{payment.name}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}

//             <TouchableOpacity
//               className="flex-row items-center mb-6 mt-2"
//               onPress={toggleAddPayment}
//             >
//               <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
//               <Text className="text-blue-500 ml-2">Add New Payment Method</Text>
//             </TouchableOpacity>
//           </>
//         )}

//         {/* Add New Payment Method Form */}
//         {(formData.showAddPayment || formData.savedPaymentMethods.length === 0) && (
//           <View className="border border-gray-300 rounded-lg p-4 mb-4">
//             <Text className="text-xs uppercase text-gray-500 mb-1">Credit Card</Text>
//             <TextInput
//               className="border-b border-gray-200 py-2 mb-3"
//               placeholder="Card Number"
//               keyboardType="number-pad"
//               value={formData.cardNumber}
//               onChangeText={(text) => handleInputChange('cardNumber', text)}
//             />

//             <TextInput
//               className="border-b border-gray-200 py-2 mb-3"
//               placeholder="Cardholder Name"
//               value={formData.cardName}
//               onChangeText={(text) => handleInputChange('cardName', text)}
//             />

//             <View className="flex-row mb-4">
//               <TextInput
//                 className="border-b border-gray-200 py-2 flex-1 mr-4"
//                 placeholder="MM/YY"
//                 keyboardType="number-pad"
//                 value={formData.expiryDate}
//                 onChangeText={(text) => handleInputChange('expiryDate', text)}
//               />

//               <TextInput
//                 className="border-b border-gray-200 py-2 w-20"
//                 placeholder="CVV"
//                 keyboardType="number-pad"
//                 secureTextEntry
//                 value={formData.cvv}
//                 onChangeText={(text) => handleInputChange('cvv', text)}
//               />
//             </View>

//             <View className="flex-row items-center justify-between mb-4">
//               <Text className="text-gray-700">Save this card for future use</Text>
//               <Switch
//                 trackColor={{ false: "#cccccc", true: "#22c55e" }}
//                 thumbColor="#ffffff"
//                 ios_backgroundColor="#cccccc"
//                 onValueChange={handleSavePaymentToggle}
//                 value={formData.savePaymentDetails}
//               />
//             </View>

//             <View className="flex-row justify-between">
//               {formData.savedPaymentMethods.length > 0 && (
//                 <TouchableOpacity
//                   className="border border-gray-300 rounded-lg py-2 px-4"
//                   onPress={toggleAddPayment}
//                 >
//                   <Text className="text-gray-500">Cancel</Text>
//                 </TouchableOpacity>
//               )}

//               <TouchableOpacity
//                 className="bg-blue-500 rounded-lg py-2 px-4 ml-auto"
//                 onPress={handleAddPaymentMethod}
//               >
//                 <Text className="text-white text-center font-semibold">Save Card</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       <TouchableOpacity
//         className="bg-blue-600 rounded-lg py-3 px-6 mb-4 items-center"
//         onPress={handleCompleteOrder}
//         disabled={!formData.selectedPaymentId && !formData.showAddPayment} // Ensure a payment is selected or being added
//       >
//         <Text className="text-white font-semibold">CONFIRM YOUR ORDER</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         className="flex-1"
//       >
//         {/* Progress Bar */}
//         {renderProgressBar()}

//         {/* Step Content */}
//         {currentStep === 1 && renderBasicDetailsStep()}
//         {currentStep === 2 && renderAddressDetailsStep()}
//         {currentStep === 3 && renderPaymentDetailsStep()}

//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useCartStore from '../../../src/store/cartStore';
import useAddressStore from '../../../src/store/addressStore';
import useCheckoutStore from '../../../src/store/checkoutStore';

export default function Checkout() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStore();
  const { addresses, addAddress, fetchAddresses, updateAddress, deleteAddress } = useAddressStore();
  const { placeOrder, checkoutId, loading, error } = useCheckoutStore(); // Destructure checkoutId, loading, and error

  const [currentStep, setCurrentStep] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  const [formData, setFormData] = useState({
    // Basic Details
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',

    // Address Details
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
      default: true,
      formattedAddress: '',
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

  // Fetch addresses on component mount and update when addresses change in store
  useEffect(() => {
    fetchAddresses();
    // Set initial selected address if addresses are available
    if (addresses.length > 0 && !formData.selectedAddressId) {
      const defaultAddr = addresses.find(addr => addr.default) || addresses[0];
      setFormData(prev => ({
        ...prev,
        selectedAddressId: defaultAddr ? defaultAddr.addressId : null
      }));
    }
  }, [fetchAddresses]);

  // Handler for adding or updating an address
  const handleAddOrUpdateAddress = () => {
    // Basic validation
    const { streetAddress, buildingName, flatNo, area, emirate, country } = formData.newAddress;
    if (!streetAddress || !buildingName || !flatNo || !area || !emirate || !country) {
      alert('Please fill all required address fields.');
      return;
    }

    if (isEditingAddress && addressToEdit) {
      // Update existing address
      updateAddress({ ...formData.newAddress, addressId: addressToEdit.addressId });
    } else {
      // Add new address
      addAddress(formData.newAddress);
    }
    // Reset form and close modal
    setFormData(prev => ({
      ...prev,
      newAddress: {
        streetAddress: '',
        buildingName: '',
        flatNo: '',
        area: '',
        emirate: 'Dubai',
        country: 'UAE',
        landmark: '',
        addressType: 'Home',
        default: true,
        formattedAddress: '',
      }
    }));
    setShowAddressForm(false);
    setIsEditingAddress(false);
    setAddressToEdit(null);
  };

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
  };

  const handleEditAddress = (address) => {
    setFormData(prev => ({
      ...prev,
      newAddress: { ...address } // Pre-fill the form with the address data
    }));
    setIsEditingAddress(true);
    setAddressToEdit(address); // Store the address being edited
    setShowAddressForm(true);
  };

  // Sample payment methods for demonstration (already integrated)
  const samplePaymentMethods = [
    { id: 1, type: 'visa', lastFour: '4242', expiryDate: '12/25', name: 'John Doe', isDefault: true },
    { id: 2, type: 'mastercard', lastFour: '5555', expiryDate: '10/24', name: 'John Doe', isDefault: false },
  ];

  // Emirates options for dropdown
  const emiratesOptions = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
  ];

  // Address types
  const addressTypes = ['Home', 'Office', 'Other'];

  // Set sample data on component mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
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

  const handleAddPaymentMethod = () => {
    // Validate payment details
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      alert('Please fill all payment details.');
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
    return 'card'; // Default
  };

  const handleNext = async () => { // Changed to async to await placeOrder if needed for currentStep 2
    if (currentStep === 1) {
      // Validate Basic Details
      const { firstName, lastName, email, mobile } = formData;
      if (!firstName || !lastName || !email || !mobile) {
        alert('Please fill all basic details.');
        return;
      }
    } else if (currentStep === 2) {
      // Validate Address Details
      if (!formData.selectedAddressId) {
        alert('Please select an address.');
        return;
      }

      // Prepare data for checkout hit as per provided structure
      const selectedAddress = addresses.find(addr => addr.addressId === formData.selectedAddressId);
      if (!selectedAddress) {
        alert('Selected address not found. Please select a valid address.');
        return;
      }

      const checkoutData = {
        cartId: cartItems.cartId, // Assuming cartItems provides a cartId
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        addressId: selectedAddress.addressId,
      };

      console.log('Hitting checkout with data:', JSON.stringify(checkoutData, null, 2));

      // Call placeOrder action and save the checkoutId
      const receivedCheckoutId = await placeOrder(checkoutData);

      if (receivedCheckoutId) {
        console.log('Checkout successful! Checkout ID:', receivedCheckoutId);
        // The checkoutId is already saved in the store by placeOrder action
        // No need to explicitly set state here as it's managed by Zustand store.
        // You can use the `checkoutId` from `useCheckoutStore()` directly in your component.
      } else {
        alert(error || 'Failed to initiate checkout. Please try again.');
        return; // Prevent moving to next step if checkout fails
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleCompleteOrder = () => {
    // Validate Payment Details
    if (!formData.selectedPaymentId && formData.savedPaymentMethods.length === 0) {
      alert('Please add or select a payment method.');
      return;
    }
    // If no payment method is selected but 'Add New Payment Method' form is open, try to add it.
    if (!formData.selectedPaymentId && formData.showAddPayment) {
      handleAddPaymentMethod(); // This will set selectedPaymentId if successful
      if (!formData.selectedPaymentId) { // Check again after attempting to add
        alert('Please complete the new payment method details.');
        return;
      }
    }

    const selectedAddress = addresses.find(addr => addr.addressId === formData.selectedAddressId);
    const selectedPayment = formData.savedPaymentMethods.find(pm => pm.id === formData.selectedPaymentId);

    if (!selectedAddress) {
      alert('No address selected. Please select an address.');
      return;
    }
    if (!selectedPayment) {
      alert('No payment method selected. Please select or add a payment method.');
      return;
    }

    // Construct dummy payment data
    const dummyPaymentData = {
      paymentMethodId: selectedPayment.id,
      type: selectedPayment.type,
      lastFour: selectedPayment.lastFour,
      expiryDate: selectedPayment.expiryDate,
      cardholderName: selectedPayment.name,
      transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Dummy transaction ID
      amount: cartItems.totalPrice, // Assuming cartItems has totalPrice
      currency: 'AED', // Example currency
      status: 'Paid', // Dummy status
    };

    // The orderPayload now combines checkout data with payment details for final order placement
    // Ensure you modify `placeOrder` in `useCheckoutStore` to accept and process this full payload.
    const orderPayload = {
        cartId: cartItems.cartId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        addressId: selectedAddress.addressId,
        checkoutId: checkoutId, // Use the checkoutId obtained in the previous step
        paymentDetails: dummyPaymentData,
        items: cartItems.items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        totalAmount: cartItems.totalPrice,
        orderDate: new Date().toISOString(),
        status: 'Pending',
    };

    console.log('Final Order Payload for confirmation:', JSON.stringify(orderPayload, null, 2));

    // Call placeOrder action from checkoutStore for final order confirmation
    // Note: If placeOrder is meant only for the initial checkout hit, you might need a separate action for "confirmOrder"
    // For this example, we'll re-use placeOrder assuming it handles the entire process based on the payload.
    placeOrder(orderPayload); // This might need to be a different action for final order confirmation

    // Clear cart and navigate to order confirmation
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

  const renderAddressDetailsStep = () => (
    <View className="px-4 flex-1">
      <Text className="text-xl font-bold mb-6">Address Details</Text>

      <ScrollView className="flex-1">
        {addresses.length === 0 ? (
          <Text className="text-gray-500 text-center mt-8">No addresses found. Add a new address below.</Text>
        ) : (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.addressId}
              className={`border ${formData.selectedAddressId === address.addressId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg p-4 mb-4 flex-row items-start`}
              onPress={() => handleAddressSelect(address.addressId)}
            >
              <View className="mr-3 mt-1">
                <View className={`w-5 h-5 rounded-full border ${formData.selectedAddressId === address.addressId ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                  {formData.selectedAddressId === address.addressId && (
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <Text className="font-semibold text-gray-800 flex-1 pr-2">
                    {address.buildingName}, {address.flatNo}, {address.streetAddress}
                  </Text>
                  {address.default && (
                    <View className="bg-blue-100 px-2 py-0.5 rounded">
                      <Text className="text-blue-600 text-xs">Default</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  {address.formattedAddress || `${address.flatNo}, ${address.buildingName}, ${address.streetAddress}, ${address.area}, ${address.emirate}, ${address.country}`}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">{address.addressType}</Text>
                <View className="flex-row justify-end mt-2 w-full">
                  <TouchableOpacity onPress={() => handleEditAddress(address)} className="mr-4">
                    <Text className="text-blue-500">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAddress(address.addressId)}>
                    <Text className="text-red-500">Delete</Text>
                  </TouchableOpacity>
                </View>
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
          setFormData(prev => ({
            ...prev,
            newAddress: {
              streetAddress: '',
              buildingName: '',
              flatNo: '',
              area: '',
              emirate: 'Dubai',
              country: 'UAE',
              landmark: '',
              addressType: 'Home',
              default: true,
              formattedAddress: '',
            }
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
        >
          <Text className="text-blue-600 font-semibold mr-2">NEXT</Text>
          <Ionicons name="arrow-forward" size={16} color="#2976f3" />
        </TouchableOpacity>
      </View>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddressForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressForm(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-xl p-4 h-5/6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">{isEditingAddress ? 'Edit Address' : 'Add New Address'}</Text>
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

              <Text className="text-xs uppercase text-gray-500 mb-1">LANDMARK</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Nearby landmark"
                value={formData.newAddress.landmark}
                onChangeText={(text) => handleAddressInputChange('landmark', text)}
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

              <Text className="text-xs uppercase text-gray-500 mb-1">COUNTRY</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter country"
                value={formData.newAddress.country}
                onChangeText={(text) => handleAddressInputChange('country', text)}
              />

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

              <Text className="text-xs uppercase text-gray-500 mb-1">FORMATTED ADDRESS</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Auto or manually formatted address"
                value={formData.newAddress.formattedAddress}
                onChangeText={(text) => handleAddressInputChange('formattedAddress', text)}
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
                <Text className="text-white font-semibold">{isEditingAddress ? 'Update Address' : 'Save Address'}</Text>
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