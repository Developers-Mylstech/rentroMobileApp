import { Stack } from "expo-router";
import React from "react";

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "",
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
          title: "Order Details",
          animation: "slide_from_right",
          headerBackTitle: "My Orders", // Change back button text to "My Orders"
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
