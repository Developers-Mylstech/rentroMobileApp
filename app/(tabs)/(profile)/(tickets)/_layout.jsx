import { Stack } from "expo-router";
import React from "react";

export default function TicketsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="[ticketId]"
        options={{
          title: "Support Ticket",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
