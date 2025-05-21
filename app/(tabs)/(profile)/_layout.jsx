import { Stack } from "expo-router";

export default function ProfileLayout() {
  const isLoggedIn  = false
  return (
    <Stack screenOptions={{
        headerShown: false,
      
      }}
    >
      <Stack.Screen 

        name="index" 
        options={{ 

          title: isLoggedIn ? "Profile" : "Login",
          headerShown: isLoggedIn ? true : false
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
        name="wishlist" 
        options={{ 
          title: "Wishlist",
          headerShown: true
        }} 
      />
    </Stack>
  );
}
