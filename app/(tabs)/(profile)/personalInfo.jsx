import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Switch, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import useAddressStore from '../../../src/store/addressStore'
import AddressSkeleton from '../../../src/components/Skeleton/AddressSkeleton';

export default function PersonalInfo() {
  const { addresses, loading, error, fetchAddresses, addAddress, updateAddress, deleteAddress } = useAddressStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
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
  });

  // Constants
  const emiratesOptions = [
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
    "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
  ];
  const addressTypes = ["Home", "Office", "Other"];

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, addressType: type }));
  };

  const handleDefaultAddressToggle = () => {
    setFormData(prev => ({ ...prev, default: !prev.default }));
  };

  const handleEditAddress = (address) => {
    setFormData({ ...address });
    setIsEditingAddress(true);
    setAddressToEdit(address);
    setShowAddressForm(true);
  };

  const handleAddOrUpdateAddress = async () => {
    const { streetAddress, buildingName, flatNo, area, emirate, country } = formData;
    if (!streetAddress || !buildingName || !flatNo || !area || !emirate || !country) {
      alert("Please fill all required address fields.");
      return;
    }

    if (isEditingAddress && addressToEdit) {
      const res = await updateAddress(addressToEdit?.addressId, formData);
      if (res?.status === 200 || res?.status === 201) {
        fetchAddresses();
      }
    } else {
      const res = await addAddress(formData);
      if (res?.status === 200 || res?.status === 201) {
        fetchAddresses();
      }
    }

    // Reset form
    setFormData({
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
    });
    setShowAddressForm(false);
    setIsEditingAddress(false);
    setAddressToEdit(null);
  };

  const confirmDeleteAddress = async (addressId) => {
    const res = await deleteAddress(addressId);
    if (res) {
      fetchAddresses();
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">My Addresses</Text>

        {loading ? (

          <AddressSkeleton />

        ) : (
          <>
            <ScrollView className="flex-1">
              {addresses.length === 0 ? (
                <View className="flex-1 justify-center items-center py-10">
                  <Ionicons name="location-outline" size={60} color="#d1d5db" />
                  <Text className="text-gray-500 text-center mt-4 mb-2">No addresses found</Text>
                  <Text className="text-gray-400 text-center mb-6">Add a new address to get started</Text>
                </View>
              ) : (
                addresses.map((address, index) => (
                  <View
                    key={index.toString()}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="font-semibold text-gray-800 text-lg">{address.buildingName}, {address.flatNo}</Text>
                          {address.default && (
                            <View className="bg-blue-100 px-2 py-0.5 rounded ml-2">
                              <Text className="text-blue-600 text-xs">Default</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-gray-600 mt-1">{address.streetAddress}</Text>
                        <Text className="text-gray-600">{address.area}, {address.emirate}</Text>
                        <Text className="text-gray-600">{address.country}</Text>
                        {address.landmark && <Text className="text-gray-500 mt-1">Landmark: {address.landmark}</Text>}
                        <Text className="text-gray-400 text-xs mt-2">{address.addressType}</Text>
                      </View>

                      <View className="flex-row">
                        <TouchableOpacity
                          onPress={() => handleEditAddress(address)}
                          className="p-2"
                        >
                          <Ionicons name="pencil" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => confirmDeleteAddress(address?.addressId)}
                          className="p-2"
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 px-6 items-center mt-4"
              onPress={() => {
                setIsEditingAddress(false);
                setAddressToEdit(null);
                setFormData({
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
                });
                setShowAddressForm(true);
              }}
            >
              <Text className="text-white font-semibold">Add New Address</Text>
            </TouchableOpacity>
          </>
        )}
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
                value={formData.streetAddress}
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
                value={formData.buildingName}
                onChangeText={(text) =>
                  handleAddressInputChange("buildingName", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                FLAT/APARTMENT NUMBER
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter flat or apartment number"
                value={formData.flatNo}
                onChangeText={(text) =>
                  handleAddressInputChange("flatNo", text)
                }
              />

              <Text className="text-xs uppercase text-gray-500 mb-1">
                AREA
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter area"
                value={formData.area}
                onChangeText={(text) =>
                  handleAddressInputChange("area", text)
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
                      className={`px-4 py-2 mx-1 rounded-full ${formData.emirate === emirate
                          ? "bg-blue-500"
                          : "bg-gray-100"
                        }`}
                      onPress={() => handleAddressInputChange("emirate", emirate)}
                    >
                      <Text
                        className={
                          formData.emirate === emirate
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
                LANDMARK (OPTIONAL)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter landmark"
                value={formData.landmark}
                onChangeText={(text) =>
                  handleAddressInputChange("landmark", text)
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
                      className={`px-4 py-2 mx-1 rounded-full ${formData.addressType === type
                          ? "bg-blue-500"
                          : "bg-gray-100"
                        }`}
                      onPress={() => handleAddressTypeSelect(type)}
                    >
                      <Text
                        className={
                          formData.addressType === type
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

              <View className="flex-row items-center mb-4">
                <Switch
                  trackColor={{ false: "#cccccc", true: "#22c55e" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#cccccc"
                  onValueChange={handleDefaultAddressToggle}
                  value={formData.default}
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
    </SafeAreaView>
  );
}
