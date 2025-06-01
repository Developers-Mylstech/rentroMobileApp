import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import LottieView from 'lottie-react-native'

export default function OtpModal({ visible, onClose, email }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const slideAnim = useRef(new Animated.Value(0)).current
  const { verifyOtp, login } = useAuthStore()
  const { migrateLocalCartToServer, getLocalCartItems } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isResendLoading, setIsResendLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(true)
  const [countdown, setCountdown] = useState(90)
  const countdownRef = useRef(null)

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
      startCountdown()
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      clearCountdown()
    }

    return () => clearCountdown()
  }, [visible])

  const startCountdown = () => {
    setResendDisabled(true)
    setCountdown(90)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    if (text && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join('')
    const payload = {
      email: email,
      otp: otpValue
    }
    setIsLoading(true)
    try {
      const res = await verifyOtp(payload)
      if (res?.status === 200 || res?.status === 201) {
        console.log('OTP verified successfully')

        const localCartItems = await getLocalCartItems()

        if (localCartItems && localCartItems.length > 0) {
          console.log(`Found ${localCartItems.length} local cart items, starting migration...`)
          setTimeout(() => {
            migrateLocalCartToServer()
          }, 500)
        } else {
          console.log('No local cart items found, skipping migration')
        }

        onClose()
        setIsLoading(false)
      } else {
        console.log('OTP verification failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error during OTP verification:', error)
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResendLoading(true)
    try {
      const res = await login({ email })
      if (res?.status === 200 || res?.status === 201) {
        alert('OTP sent successfully')
        // Restart the countdown
        startCountdown()
      } else {
        alert('OTP resend failed')
      }
    } catch (error) {
      console.error('Error during OTP resend:', error)
      alert('Error resending OTP')
    } finally {
      setIsResendLoading(false)
    }
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType='slide'
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              className="bg-white rounded-t-3xl p-6"
              style={{
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-bold text-gray-800">Verification Code</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View className="items-center justify-center mb-2">
                <LottieView
                  source={require('../../../assets/Lotties/otp.json')}
                  autoPlay
                  loop
                  style={{ height: 150, width: 150 }}
                />
              </View>

              <View className="flex-row items-center gap-2 mb-4">
                <Text className="text-gray-600">Enter 6 digit code sent to</Text>
                <Text className="font-bold">{email}</Text>
              </View>

              <View className="flex-row justify-between mb-8">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-bold"
                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index]}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <TouchableOpacity
                className="bg-blue-500 rounded-xl p-4 items-center mb-4"
                onPress={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? (
                  <EvilIcons name="spinner-3" size={28} color="white" className="animate-spin" />
                ) : (
                  <Text className="text-white font-bold text-lg">Verify</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-600">Didn't receive code? </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resendDisabled || isResendLoading}
                >
                  {isResendLoading ? (
                    <Text className="text-blue-500 font-medium">Sending...</Text>
                  ) : resendDisabled ? (
                    <Text className="text-gray-500 font-medium">Resend ({countdown}s)</Text>
                  ) : (
                    <Text className="text-blue-500 font-medium">Resend</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}