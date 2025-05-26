import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Home",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="[product]" 
        options={{ 
          title: "Product Details",
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="wishlist" 
        options={{ 
          title: "Wishlist",
          headerShown: true,
        }} 
      />
     
    </Stack>
  );
}