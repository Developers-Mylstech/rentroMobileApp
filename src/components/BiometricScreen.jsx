import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BiometricScreen({ setIsBiometricAuth }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    checkBiometricSupport();
  }, []);
  
  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      
      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricType(types.includes(2) ? 'face' : 'fingerprint');
      } else {
        setErrorMessage('Biometric authentication not supported on this device');
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setErrorMessage('Error checking biometric support');
    }
  };
  
  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      setErrorMessage('');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      
      if (result.success) {
        setIsBiometricAuth(false); // Fixed: Changed from false to true
      } else {
        setErrorMessage(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrorMessage('Authentication error occurred');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === 'face') {
      return <Ionicons name="face-recognition" size={90} color="#3B82F6" />;
    } else {
      return <Ionicons name="finger-print" size={90} color="#3B82F6" />;
    }
  };

  const getBiometricText = () => {
    if (biometricType === 'face') {
      return "Face ID";
    } else {
      return "Fingerprint";
    }
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0']}
      className="flex-1 justify-center items-center p-4"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="w-full max-w-md items-center p-8 rounded-3xl bg-white shadow-lg shadow-black/10">
        <Text className="text-3xl font-bold mb-3 text-gray-900">Welcome Back</Text>
        <Text className="text-lg text-gray-600 mb-10 text-center">
          Verify it's you with {getBiometricText()}
        </Text>
        
        <View className="my-6 h-36 justify-center items-center">
          {isAuthenticating ? (
            <LottieView
              source={require('../../assets/Lotties/underWorking.json')}
              autoPlay
              loop
              className="w-36 h-36"
            />
          ) : (
            <View className="p-6 bg-blue-50 rounded-full">
              {getBiometricIcon()}
            </View>
          )}
        </View>
        
        {errorMessage ? (
          <Text className="text-red-500 mt-4 text-center text-sm">{errorMessage}</Text>
        ) : null}
        
        <TouchableOpacity
          className={`w-full py-4 px-6 rounded-full items-center mt-6 ${
            isAuthenticating ? 'bg-blue-400' : 'bg-blue-600'
          } ${(!isBiometricSupported || isAuthenticating) ? 'opacity-80' : ''}`}
          onPress={handleBiometricAuth}
          disabled={isAuthenticating || !isBiometricSupported}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">
            {isAuthenticating 
              ? 'Verifying...' 
              : `Use ${getBiometricText()}`
            }
          </Text>
        </TouchableOpacity>
        
        {!isBiometricSupported && (
          <Text className="text-amber-600 mt-6 text-center text-sm">
            Your device doesn't support biometric authentication
          </Text>
        )}
        
        <TouchableOpacity 
          className="mt-8 py-2 px-4 rounded-lg"
          activeOpacity={0.7}
        >
          <Text className="text-blue-600 text-base font-medium">Use password instead</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}