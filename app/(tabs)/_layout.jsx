import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";

export default function TabLayout() {
  const pathname = usePathname();
  
  // Check if the current path is a product details page
  const isProductDetailsPage = pathname.includes('/shop/') && !pathname.endsWith('/shop');
  
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#64748b",
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
           
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={20} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="shop"
          options={{
            title: "Shop",
            tabBarIcon: ({ color }) => (
              <Ionicons name="bag-handle" size={20} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="service"
          options={{
            title: "Service",
            tabBarIcon: ({ color }) => (
              <Ionicons name="logo-dropbox" size={20} color={color} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-sharp" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
