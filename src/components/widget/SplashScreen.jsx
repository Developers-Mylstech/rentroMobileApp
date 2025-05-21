
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const SplashScreen = ({ onComplete = () => {} }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
  {
   title: "Certified Quality",
  description: "Every custom system includes our Quality Promise: NSF-certified materials",
    imageUri: 'https://cdn3d.iconscout.com/3d/premium/thumb/quality-badge-3d-icon-download-in-png-blend-fbx-gltf-file-formats--best-assurance-check-approval-pack-sign-symbols-icons-5073619.png?f=webp',
  },
  {
     title: "Real-Time Order Tracking",
    description: "Track your rental/service requests and product deliveries in real-time",
    imageUri: 'https://cdn3d.iconscout.com/3d/premium/thumb/track-order-3d-icon-download-in-png-blend-fbx-gltf-file-formats--parcel-tracking-package-delivery-location-service-postal-pack-e-commerce-shopping-icons-10446219.png',
  },
  {
   title: "Get Custom Quote",
    description: "Need bulk equipment or commercial solutions? Request a free quotation tailored to your needs.",
    imageUri: 'https://png.pngtree.com/png-clipart/20220612/original/pngtree-document-3d-isolated-png-image_7966092.png',
  }
];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startApp = () => {
    // Call the onComplete callback when user finishes or skips
    onComplete();
  };

  return (
    <View className="flex-1 bg-white justify-between p-6">
      {/* Skip button (top right) */}
      <View className="items-end">
        {currentStep < steps.length - 1 && (
          <TouchableOpacity onPress={startApp}>
            <Text className="text-blue-500 text-lg">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View className="items-center justify-center flex-1">
        <Image 
          source={{ uri: steps[currentStep].imageUri }}
          className="w-64 h-64 mb-8 rounded-lg"
          style={styles.image} 
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-center mb-4 text-gray-800">
          {steps[currentStep].title}
        </Text>
        <Text className="text-lg text-center text-gray-600 px-4">
          {steps[currentStep].description}
        </Text>
      </View>

      {/* Indicators */}
      <View className="flex-row justify-center mb-6">
        {steps.map((_, index) => (
          <View 
            key={index} 
            className={`w-2 h-2 rounded-full mx-1 ${currentStep === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </View>

      {/* Navigation buttons */}
      <View className="flex-row justify-between items-center">
        {currentStep > 0 ? (
          <TouchableOpacity 
            onPress={previousStep}
            className="py-3 px-6"
          >
            <Text className="text-blue-500 text-lg">Back</Text>
          </TouchableOpacity>
        ) : (
          <View className="py-3 px-6" />
        )}

        {currentStep < steps.length - 1 ? (
          <TouchableOpacity 
            onPress={nextStep}
            className="bg-blue-500 py-3 px-8 rounded-full"
          >
            <Text className="text-white text-lg">Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={startApp}
            className="bg-blue-500 py-3 px-8 rounded-full"
          >
            <Text className="text-white text-lg">Let's Start</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    // Additional image styles if needed
    // backgroundColor: '#f3f4f6', // Light gray background as fallback
  },
});

export default SplashScreen;
