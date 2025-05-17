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
          title: "Product Details",
          headerShown: true
        }} 
      />
    </Stack>
  );
}