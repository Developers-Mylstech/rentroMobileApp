import { Stack } from "expo-router";
import React from "react";

export default function ShopLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Shop Products",
        }} 
      />
      <Stack.Screen 
        name="[product]" 
        options={{ 
          title: "Product Details",
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="rent-products" 
        options={{ 
          title: "Rent Products",
        }} 
      />
      <Stack.Screen 
        name="sell-products" 
        options={{ 
          title: "Sell Products",
        }} 
      />

       <Stack.Screen 
        name="checkout" 
        options={{ 
          title: "Checkout",
        }} 
      />
     
    </Stack>
  );
}
