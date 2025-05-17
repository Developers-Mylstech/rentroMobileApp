import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function CartLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#3b82f6",
        drawerInactiveTintColor: "#64748b",
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ 
          title: "Cart",
          drawerLabel: "Cart",
          drawerIcon: ({ color }) => <Ionicons name="cart" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="checkout" 
        options={{ 
          title: "Checkout",
          drawerLabel: "Checkout",
          drawerIcon: ({ color }) => <Ionicons name="card" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="payment" 
        options={{ 
          title: "Payment",
          drawerLabel: "Payment",
          drawerIcon: ({ color }) => <Ionicons name="cash" size={22} color={color} />
        }} 
      />
    </Drawer>
  );
}
