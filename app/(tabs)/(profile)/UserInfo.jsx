import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
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

  // Function to get initials from name
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
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-blue-800 text-base font-medium">Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50 p-5">
        <View className="bg-blue-100 p-5 rounded-full mb-4">
          <Ionicons name="alert-circle-outline" size={50} color="#3b82f6" />
        </View>
        <Text className="mt-3 text-blue-800 text-center text-base font-medium">{error}</Text>
        <TouchableOpacity 
          className="mt-5 bg-blue-600 py-3 px-6 rounded-full shadow-sm"
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
    <ScrollView className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-blue-400 px-6 py-4 rounded-b-3xl shadow-md">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white"></Text>
          <TouchableOpacity 
            className="bg-white py-2 px-2 rounded-full shadow"
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text className="text-blue-600 font-semibold">
              {isEditing ? (
                <Ionicons name="close" size={18} color="#3b82f6" />
              ) : (
                <Ionicons name="pencil" size={18} color="#3b82f6" />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Picture Section */}
      <View className="items-center -mt-12 mb-4">
        <View className="w-28 h-28 rounded-full bg-white border-4 border-blue-400 justify-center items-center shadow-lg">
          <View className="w-24 h-24 rounded-full bg-blue-600 justify-center items-center">
            <Text className="text-white text-3xl font-bold">
              {getInitials(profile?.name)}
            </Text>
          </View>
        </View>
        <Text className="text-xl font-bold text-blue-900 mt-4">{profile?.name}</Text>
        {profile?.verified && (
          <View className="flex-row items-center bg-blue-100 px-4 py-1.5 rounded-full mt-2">
            <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
            <Text className="text-blue-800 font-medium ml-1">Verified Account</Text>
          </View>
        )}
      </View>

      {/* Profile Details */}
      <View className="px-6 pb-8">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          {/* Name Field */}
          <View className="mb-6">
            <Text className="text-xs text-blue-500 font-medium mb-1">FULL NAME</Text>
            {isEditing ? (
              <TextInput
                className="border-b border-blue-200 py-3 text-base text-blue-900 font-medium"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
              />
            ) : (
              <Text className="text-base text-blue-900 font-medium py-2">{profile?.name || 'Not provided'}</Text>
            )}
          </View>

          {/* Email Field */}
          <View className="mb-6">
            <Text className="text-xs text-blue-500 font-medium mb-1">EMAIL ADDRESS</Text>
            {isEditing ? (
              <TextInput
                className="border-b border-blue-200 py-3 text-base text-blue-400 font-medium bg-blue-50 rounded px-2"
                value={formData.email}
                editable={false}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text className="text-base text-blue-900 font-medium py-2">{profile?.email || 'Not provided'}</Text>
            )}
          </View>

          {/* Phone Field */}
          <View className="mb-6">
            <Text className="text-xs text-blue-500 font-medium mb-1">PHONE NUMBER</Text>
            {isEditing ? (
              <TextInput
                className="border-b border-blue-200 py-3 text-base text-blue-900 font-medium"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text className="text-base text-blue-900 font-medium py-2">{profile?.phone || 'Not provided'}</Text>
            )}
          </View>


        </View>

        {isEditing && (
          <TouchableOpacity 
            className="bg-blue-600 py-4 rounded-full shadow-md items-center"
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-white font-bold text-base">SAVE CHANGES</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}