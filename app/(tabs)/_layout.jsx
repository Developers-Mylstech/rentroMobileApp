import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const isLoggedIn  = false

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
          
          title: isLoggedIn ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name={isLoggedIn ? "person-sharp" : "lock-closed"} size={20} color={color} />
          ),
        }}
      />
    
    </Tabs>
  );
}
