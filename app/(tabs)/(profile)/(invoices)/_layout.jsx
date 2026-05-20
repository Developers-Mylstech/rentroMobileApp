import { Stack } from "expo-router";
import React from "react";

export default function InvoicesLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="[invoiceId]"
        options={{
          title: "Invoice Details",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
