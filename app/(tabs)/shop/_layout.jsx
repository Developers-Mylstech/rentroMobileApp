import { Stack } from "expo-router";

export default function ShopLayout() {
  return (
    <Stack>
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
      <Stack.Screen 
        name="[...rest]" 
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