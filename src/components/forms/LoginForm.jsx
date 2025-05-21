import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'

export default function LoginForm({ onVerifyRequest, setEmail }) {
  const { control, formState: { errors }, handleSubmit } = useForm()
  const { login, isLoading, error: authError, clearError } = useAuthStore()
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
      email: data.email
    }
    setEmail(data.email)
    const res = await login(payload)
    if (res?.status === 200 || res?.status === 201) {
      onVerifyRequest()
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login pressed')
  }

  const handleAppleLogin = () => {
    // Implement Apple login logic here
    console.log('Apple login pressed')
  }

  return (
    <View className="w-full">
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
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
              />
            </View>
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mt-1">{errors.email.message}</Text>
        )}
      </View>

      {formError && (
        <Text className="text-red-500 mt-1">{formError}</Text>
      )}

      <TouchableOpacity 
        className="bg-blue-500 rounded-xl p-4 flex flex-row justify-center gap-3 items-center mt-5"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <EvilIcons name="spinner-3" size={28} color="white" className="animate-spin" />
        ) : (
          <Text className="text-white font-bold text-heading-4">Sent OTP</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-0.5 bg-gray-200" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-0.5 bg-gray-200" />
      </View>

      <View className="space-y-4">
        <TouchableOpacity 
          className="flex-row items-center justify-center border border-gray-300 rounded-xl p-3.5"
          onPress={handleGoogleLogin}
        >
          <Ionicons name="logo-google" size={20} color="#EA4335" className="mr-2" />
          <Text className="text-gray-700 font-medium ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center justify-center border border-gray-300 rounded-xl p-3.5"
          onPress={handleAppleLogin}
        >
          <Ionicons name="logo-apple" size={20} color="#000000" className="mr-2" />
          <Text className="text-gray-700 font-medium ml-2">Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
