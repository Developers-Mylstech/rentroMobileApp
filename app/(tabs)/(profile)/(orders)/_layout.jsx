import { Stack } from "expo-router";
import React from "react";

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "My Orders",
        }} 
      />
      <Stack.Screen 
        name="[orderId]" 
        options={{ 
            headerBackTitle: "Back",
          title: "Order Details",
          headerBackVisible: true,
          animation: "slide_from_right",
        }} 
      />
      <Stack.Screen 
        name="track" 
        options={{ 
          title: "Track Order",
        }} 
      />
    </Stack>
  );
}
