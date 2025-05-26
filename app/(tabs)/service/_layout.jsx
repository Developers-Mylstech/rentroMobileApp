import { Stack } from "expo-router";

export default function ServiceLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="service" 
        options={{ 
          title: "Our Services",
          headerShown: false 
        }} 
        />
      <Stack.Screen 
        name="[serviceId]" 
        options={{ 
          headerBackTitle: "Back",
          headerBackVisible: true,
          title: "Service Details",
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="serviceproduct/[product]" 
        options={{ 
          title: "Product Details",
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="RequestQoutation" 
        options={{ 
          title: "Request Qoutation",
          headerShown: true,
          headerBackTitle: "Back",
          headerBackVisible: true,
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
