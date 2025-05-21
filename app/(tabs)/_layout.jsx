import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/authStore";
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import LottieView from "lottie-react-native";

export default function TabLayout() {
  const { isAuthenticated, initAuth, isLoadingAuth } = useAuthStore()

  useEffect(() => {
    initAuth();
  }, []);

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

  return (
    <Tabs
      screenOptions={{

        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        headerShown: false,
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
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
