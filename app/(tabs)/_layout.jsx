
// import { Tabs } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuthStore } from "../../src/store/authStore";
// import * as SecureStore from 'expo-secure-store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
// import LottieView from "lottie-react-native";
// import SplashScreen from "../../src/components/widget/SplashScreen";

// export default function TabLayout() {
//   const { isAuthenticated, initAuth, isLoadingAuth } = useAuthStore();
//   const [isFirstVisit, setIsFirstVisit] = useState(true);

//   useEffect(() => {

//     initAuth();
//     checkFirstVisit();
//   }, []);

//   const checkFirstVisit = async () => {
//     try {
//       const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');

//       if (!hasVisited) {
//         await AsyncStorage.setItem('hasVisitedBefore', 'true');
//       } else {
//         setIsFirstVisit(false);
//       }
//     } catch (error) {
//       console.log('Error checking first visit:', error);
//       setIsFirstVisit(false);
//     }
//   };

//   const handleSplashComplete = () => {
//     setIsFirstVisit(false);
//   };

//   if (isLoadingAuth) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <LottieView
//           source={require('../../assets/Lotties/waterloading.json')}
//           autoPlay
//           loop
//           style={{ height: 100, width: 100 }}
//         />
//         <Text className="text-gray-900 uppercase text-xs font-bold my-2 animate-pulse">Loading ...</Text>
//       </View>
//     );
//   }

//   if (isFirstVisit) {
//     return <SplashScreen onComplete={handleSplashComplete} />;
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

//       <Tabs
//         screenOptions={{
//           tabBarActiveTintColor: "#3b82f6",
//           tabBarInactiveTintColor: "#64748b",
//           headerShown: false,
//           // tabBarStyle: { paddingBottom: 5, height: 60 },
//         }}
//       >
//         <Tabs.Screen
//           name="(home)"
//           options={{
//             title: "Home",
//             headerShown: false,
//             tabBarIcon: ({ color }) => (
//               <Ionicons name="home" size={20} color={color} />
//             ),
//           }}
//         />

//         <Tabs.Screen
//           name="shop"
//           options={{
//             title: "Shop",
//             tabBarIcon: ({ color }) => (
//               <Ionicons name="bag-handle" size={20} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="service"
//           options={{
//             title: "Service",
//             tabBarIcon: ({ color }) => (
//               <Ionicons name="logo-dropbox" size={20} color={color} />
//             ),
//           }}
//         />
//         <Tabs.Screen
//           name="(profile)"
//           options={{
//             title: isAuthenticated ? "Profile" : "Login",
//             tabBarIcon: ({ color }) => (
//               <Ionicons name={isAuthenticated ? "person-sharp" : "lock-closed"} size={20} color={color} />
//             ),
//           }}
//         />
//       </Tabs>
//     </SafeAreaView>
//   );
// }
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import SplashScreen from "../../src/components/widget/SplashScreen";

export default function TabLayout() {
  const { isAuthenticated, initAuth, isLoadingAuth } = useAuthStore();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    initAuth();
    checkFirstVisit();
  }, []);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedBefore");
      if (!hasVisited) {
        await AsyncStorage.setItem("hasVisitedBefore", "true");
      } else {
        setIsFirstVisit(false);
      }
    } catch (error) {
      console.log("Error checking first visit:", error);
      setIsFirstVisit(false);
    }
  };

  const handleSplashComplete = () => {
    setIsFirstVisit(false);
  };

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={require("../../assets/Lotties/waterloading.json")}
          autoPlay
          loop
          style={{ height: 100, width: 100 }}
        />
        <Text
          style={{
            color: "#1f2937",
            textTransform: "uppercase",
            fontSize: 12,
            fontWeight: "bold",
            marginVertical: 8,
          }}
        >
          Loading ...
        </Text>
      </View>
    );
  }

  if (isFirstVisit) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#64748b",
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 0,
          },
          // This disables background highlight on tab press:
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 1 }}
              {...props}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="(home)"
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
            title: isAuthenticated ? "Profile" : "Login",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={isAuthenticated ? "person-sharp" : "lock-closed"}
                size={20}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
