import { Stack } from "expo-router";

export default function ShopLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back", // For iOS
        headerBackTitleVisible: true, // Show back title on iOS
        headerBackVisible: true, // Ensure back button is visible
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Shop Products",
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="[product]" 
        options={{ 
          headerBackVisible: true,
          headerBackTitle: "Back",
          title: "Product Details",
          headerShown: true
        }} 
      />
      
      
    </Stack>
  );
}