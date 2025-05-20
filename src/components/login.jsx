import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Ionicons } from '@expo/vector-icons'

export default function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const { control: signupControl, formState: { errors: signupErrors } } = useForm()
  const { control: loginControl, formState: { errors: loginErrors } } = useForm()

  return (
    <View className="flex-1 bg-blue-100">
        <View className="w-full flex items-center justify-center h-1/3">
          <Image
            source={{ uri: "https://cdni.iconscout.com/illustration/premium/thumb/online-registration-illustration-download-in-svg-png-gif-file-formats--user-register-form-sign-create-account-pack-network-communication-illustrations-6381807.png" }}
            // source={require('../../assets/loginVector.png')}
            className="h-full w-64"
            resizeMode="contain"
          />
        </View>
        
      <View className="flex-1 items-center bg-white m-3 rounded-3xl p-4">
        <View className="flex-row w-full mb-5">
          <TouchableOpacity 
            className={`flex-1 p-4 items-center ${activeTab === 'login' ? 'bg-blue-50 rounded-2xl' : ''}`}
            onPress={() => setActiveTab('login')}
          >
            <Text className={`text-heading-4 ${activeTab === 'login' ? 'font-bold text-blue-500' : 'text-gray-500'}`}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 p-4 items-center ${activeTab === 'signup' ? 'bg-blue-50 rounded-2xl' : ''}`}
            onPress={() => setActiveTab('signup')}
          >
            <Text className={`text-heading-4 ${activeTab === 'signup' ? 'font-bold text-blue-500' : 'text-gray-500'}`}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'signup' && (
          <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
            <View className="w-full flex gap-3">
              {/* Full Name Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
                <Controller
                  control={signupControl}
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
                {signupErrors.fullName && (
                  <Text className="text-red-500 mt-1">{signupErrors.fullName.message}</Text>
                )}
              </View>
              
              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <Controller
                  control={signupControl}
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
                        className="flex-1 text-gray-700 ml-2 py-2"
                        placeholder="Enter your email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                      />
                    </View>
                  )}
                />
                {signupErrors.email && (
                  <Text className="text-red-500 mt-1">{signupErrors.email.message}</Text>
                )}
              </View>
              
              <View className="">
                <Text className="text-gray-700 mb-2 font-medium">Mobile Number</Text>
                <Controller
                  control={signupControl}
                  name="mobile"
                  rules={{ required: 'Mobile number is required' }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <View className="flex-row items-center border border-gray-200 rounded-lg px-3 py-2">
                      <Ionicons name="call-outline" size={20} color="#64748b" className="mr-2" />
                      <TextInput
                        className="flex-1 text-gray-700 ml-2 py-2"
                        placeholder="Enter your mobile number"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                />
                {signupErrors.mobile && (
                  <Text className="text-red-500 mt-1">{signupErrors.mobile.message}</Text>
                )}
              </View>
              
              <TouchableOpacity className="bg-blue-500 rounded-xl p-4 items-center mt-5">
                <Text className="text-white font-bold text-heading-4">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'login' && (
          <View className="w-full">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <Controller
                control={loginControl}
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
                      className="flex-1 text-gray-700 ml-2 py-2"
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                    />
                  </View>
                )}
              />
              {loginErrors.email && (
                <Text className="text-red-500 mt-1">{loginErrors.email.message}</Text>
              )}
            </View>
            
           <TouchableOpacity className="bg-blue-500 rounded-xl p-4 items-center mt-5">
              <Text className="text-white font-bold text-heading-4">Login </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}


