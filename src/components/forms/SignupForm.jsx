import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { EvilIcons, Fontisto, Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'

export default function SignupForm({ onVerifyRequest, setEmail }) {
  const { control, formState: { errors }, handleSubmit } = useForm()
  const { singup, error: authError, isLoading, clearError } = useAuthStore()
  const [formError, setFormError] = useState(null)
  
 
  useEffect(() => {
    if (authError) {
      setFormError(authError)
      clearError() 
    }
  }, [authError])

  const onSubmit = async (data) => {
    setFormError(null)
    
    const payload = {
      name: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.mobile,
      password: data.password || 'string'
    }
    setEmail(data.email.toLowerCase())

    const res = await singup(payload)
    if (res?.status === 200 || res?.status === 201) {
      onVerifyRequest()
    } else if (res?.data?.message?.includes('Duplicate entry') && res?.data?.message?.includes('idx_email')) {
      setFormError('This email is already registered. Please use a different email or try logging in.')
    }
    else if (res?.data?.message?.includes('Duplicate entry') && res?.data?.message?.includes('idx_phone')) {
      setFormError('This phone number is already registered. Please use a different phone number or try logging in.')
    }
  }
  
  return (
    <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
      <View className="w-full flex gap-3">
        {/* Full Name Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            rules={{ required: 'Full name is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                <Ionicons name="person-outline" size={20} color="#64748b" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-700 ml-2 py-2 h-10"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
          {errors.fullName && (
            <Text className="text-red-500 mt-1">{errors.fullName.message}</Text>
          )}
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email'
              }
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                <Ionicons name="mail-outline" size={20} color="#64748b" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-700 ml-2 py-2 h-10"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={(text) => onChange(text.toLowerCase())}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mt-1">{errors.email.message}</Text>
          )}
        </View>

        <View className="">
          <Text className="text-gray-700 mb-2 font-medium">Mobile Number</Text>
          <Controller
            control={control}
            name="mobile"
            rules={{ 
              required: 'Mobile number is required',
              pattern: {
                value: /^(\+91|0091|0)?[6-9]\d{9}$|^(\+971|00971|0)?5\d{8}$/,
                message: 'Please enter a valid Indian or UAE mobile number'
              }
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                <Ionicons name="call-outline" size={20} color="#64748b" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-700 ml-2 py-2 h-10"
                  placeholder="Enter your mobile number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                />
              </View>
            )}
          />
          {errors.mobile && (
            <Text className="text-red-500 mt-1">{errors.mobile.message}</Text>
          )}
        </View>

        {formError && (
          <Text className="text-red-500 mt-1">{formError}</Text>
        )}

        <TouchableOpacity
          className="bg-blue-500 rounded-xl p-4 flex flex-row justify-center gap-3 items-center mt-5"
          onPress={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <EvilIcons name="spinner-3" size={28} color="white" className="animate-spin" />
          ):(
            <Text className="text-white font-bold text-heading-4">Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
