
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/authStore";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import SplashScreen from "../../src/components/widget/SplashScreen";
import useCheckoutStore from '../../src/store/checkoutStore';

export default function TabLayout() {
  const { isAuthenticated, initAuth, isLoadingAuth } = useAuthStore();
  const { clearCheckoutData } = useCheckoutStore();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    
    initAuth();
    checkFirstVisit();
  }, []);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
  
      if (!hasVisited) {
        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      } else {
        setIsFirstVisit(false);
      }
    } catch (error) {
      console.log('Error checking first visit:', error);
      setIsFirstVisit(false);
    }
  };

  const handleSplashComplete = () => {
    setIsFirstVisit(false);
  };
 
  if (isLoadingAuth) {
    return (
      <View className="flex-1 items-center justify-center">
        <LottieView
          source={require('../../assets/Lotties/waterloading.json')}
          autoPlay
          loop
          style={{ height: 100, width: 100 }}
        />
        <Text className="text-gray-900 uppercase text-xs font-bold my-2 animate-pulse">Loading ...</Text>
      </View>
    );
  }

   if (isFirstVisit) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const handleTabPress = () => {
    clearCheckoutData();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        headerShown: false,
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
      screenListeners={{ tabPress: handleTabPress }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bag-handle" size={20} color={color} />
          ),
          // Add listener to reset navigation state when tab is pressed
          listeners: ({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default behavior
              e.preventDefault();
              // Navigate to the root of the shop tab
              navigation.navigate('(tabs)', { screen: 'shop/index' });
            },
          }),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "Service",
          tabBarIcon: ({ color }) => (
            <Ionicons name="logo-dropbox" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: isAuthenticated ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name={isAuthenticated ? "person-sharp" : "lock-closed"} size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
