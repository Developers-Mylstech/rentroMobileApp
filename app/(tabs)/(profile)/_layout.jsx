import { Stack } from "expo-router";
import { useAuthStore } from "../../../src/store/authStore";

export default function ProfileLayout() {
  const { isAuthenticated } = useAuthStore()
  return (
    <Stack screenOptions={{
        headerShown: false,
      
      }}
    >
      <Stack.Screen 

        name="index" 
        options={{ 

          title: isAuthenticated ? "Profile" : "Login",
          headerShown: isAuthenticated ? true : false
        }} 
      />
      <Stack.Screen 
        name="personalInfo" 
        options={{ 
          title: "Personal Info",
          headerShown: true
        }} 
      />
      
      <Stack.Screen 
        name="(orders)" 
        options={{ 
          title: "Orders",
          headerShown: true
        }} 
      />
    </Stack>
  );
}
