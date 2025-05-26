import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RequestQuotationModal from '../formComponent/RequestQuotationModal';
import { useRouter } from 'expo-router';

const NoProductsFound = () => {
  const shineAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [showQuotationModal, setShowQuotationModal] = useState(false);

  useEffect(() => {
    const shine = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    );
    
    shine.start();
    return () => shine.stop();
  }, []);

  const colorInterpolation = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b82f6', '#186acf'] // From blue-600 to blue-400
  });

  const scaleInterpolation = shineAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.02, 1] // Subtle pulse effect
  });

  const handleRequestQuotation = () => {
    setShowQuotationModal(true);
  };

  return (
    <View className="flex-1 items-center justify-between gap-4 rounded-lg shadow-sm bg-blue-50 p-6">
      <Text className="text-heading-3 text-center text-gray-500 mb-2 text-sm">
        Didn't find what you're looking for?
      </Text>
      
      <Animated.View style={{ transform: [{ scale: scaleInterpolation }] }}>
        <TouchableOpacity 
          className="flex-row items-center justify-center py-3 px-6 rounded-lg"
          onPress={handleRequestQuotation}
          activeOpacity={0.8}
          style={{
            backgroundColor: colorInterpolation,
          }}
        >
          <Text className="text-white font-bold text-md">Request Quotation</Text>
        </TouchableOpacity>
      </Animated.View>
      
      <RequestQuotationModal 
        visible={showQuotationModal}
        onClose={() => setShowQuotationModal(false)}
      />
    </View>
  );
};

export default NoProductsFound;
