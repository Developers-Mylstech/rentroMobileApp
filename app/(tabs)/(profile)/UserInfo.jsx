import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import useProfileStore from '../../../src/store/profileStore'

export default function UserInfo() {
  const { profile, isLoading, error, fetchProfile, updateProfile, clearError } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    verified: false
  });

  const getInitials = (name) => {
    
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    
    return initials;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        verified: profile.verified || false
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    
    const result = await updateProfile(formData);
    if (result) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  if (isLoading && !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-gray-700 text-base font-medium">Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-5">
        <View className="bg-red-50 p-5 rounded-full mb-4">
          <Ionicons name="alert-circle" size={50} color="#ef4444" />
        </View>
        <Text className="mt-3 text-gray-800 text-center text-base font-medium">{error}</Text>
        <TouchableOpacity 
          className="mt-5 bg-blue-600 py-3 px-6 rounded-lg shadow-sm"
          onPress={() => {
            clearError();
            fetchProfile();
          }}
        >
          <Text className="text-white font-semibold text-base">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header with gradient background */}
        <View className="bg-blue-600 px-6 pt-6 pb-20">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-white">Profile</Text>
            <TouchableOpacity 
              className="bg-white/20 p-2 rounded-full"
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons name={isEditing ? "close" : "pencil"} size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        <View className="mx-5 -mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Picture Section */}
          <View className="items-center pt-6 pb-4">
            <View className="w-28 h-28 rounded-full bg-blue-100 border-4 border-white justify-center items-center shadow-lg">
              <Text className="text-blue-600 text-3xl font-bold">
                {getInitials(profile?.name)}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mt-4">{profile?.name}</Text>
            {profile?.verified && (
              <View className="flex-row items-center bg-blue-50 px-4 py-1.5 rounded-full mt-2">
                <Ionicons name="shield-checkmark" size={16} color="#3b82f6" />
                <Text className="text-blue-700 font-medium ml-1">Verified Account</Text>
              </View>
            )}
          </View>

          {/* Profile Details */}
          <View className="px-6 py-6 border-t border-gray-100">
            {/* Name Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="person" size={18} color="#3b82f6" />
                <Text className="text-xs text-gray-500 font-medium ml-2">FULL NAME</Text>
              </View>
              {isEditing ? (
                <TextInput
                  className="border border-gray-200 rounded-lg py-3 px-4 text-base text-gray-800 font-medium bg-gray-50"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder="Enter your full name"
                />
              ) : (
                <Text className="text-base text-gray-800 font-medium py-2">{profile?.name || 'Not provided'}</Text>
              )}
            </View>

            {/* Email Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="mail" size={18} color="#3b82f6" />
                <Text className="text-xs text-gray-500 font-medium ml-2">EMAIL ADDRESS</Text>
              </View>
              {isEditing ? (
                <TextInput
                  className="border border-gray-200 rounded-lg py-3 px-4 text-base text-gray-500 font-medium bg-gray-100"
                  value={formData.email}
                  editable={false}
                  placeholder="Enter your email"
                />
              ) : (
                <Text className="text-base text-gray-800 font-medium py-2">{profile?.email || 'Not provided'}</Text>
              )}
            </View>

            {/* Phone Field */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="call" size={18} color="#3b82f6" />
                <Text className="text-xs text-gray-500 font-medium ml-2">PHONE NUMBER</Text>
              </View>
              {isEditing ? (
                <TextInput
                  className="border border-gray-200 rounded-lg py-3 px-4 text-base text-gray-800 font-medium bg-gray-50"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-base text-gray-800 font-medium py-2">{profile?.phone || 'Not provided'}</Text>
              )}
            </View>
          </View>
        </View>

        {isEditing && (
          <View className="mx-5 mt-6 mb-10">
            <TouchableOpacity 
              className="bg-blue-600 py-4 rounded-lg shadow-md items-center flex-row justify-center"
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text className="text-white font-bold text-base ml-2">SAVE CHANGES</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
