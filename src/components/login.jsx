import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, ScrollView, StatusBar, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import LoginForm from './forms/LoginForm'
import SignupForm from './forms/SignupForm'
import OtpModal from './modals/OtpModal'
import { LinearGradient } from 'expo-linear-gradient'

export default function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [otpModalVisible, setOtpModalVisible] = useState(false)
  const [email, setEmail] = useState('')
  const handleVerifyRequest = () => {
    setOtpModalVisible(true)
  }

  return (
    <LinearGradient
      colors={['white', '#C6DEF1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
     style={{ flex: 1 }}
    >
      <View className="w-full flex items-center justify-center h-1/3">
        <LottieView
          source={require('../../assets/Lotties/login.json')}
          autoPlay
          loop
          style={{ height: 230, width: 230 }}
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

        {activeTab === 'signup' ? 
          <SignupForm onVerifyRequest={handleVerifyRequest} setEmail={setEmail} /> : 
          <LoginForm onVerifyRequest={handleVerifyRequest} setEmail={setEmail} />
        }
      </View>
      
      <OtpModal 
        email={email}
        visible={otpModalVisible} 
        onClose={() => setOtpModalVisible(false)} 
      />
    </LinearGradient>
  )
}


