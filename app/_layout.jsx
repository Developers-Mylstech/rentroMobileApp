import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import '../global.css'
export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#3b82f6",
                tabBarInactiveTintColor: "#64748b",
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"

                options={{
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={18} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: "Shop",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bag-handle" size={18} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="service"
                options={{
                    title: "Service",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="logo-dropbox" size={18} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart" size={18} color={color} />
                    ),
                }}
            />


        </Tabs>
    );
}
