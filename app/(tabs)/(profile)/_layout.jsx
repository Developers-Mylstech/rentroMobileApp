import { Stack, useNavigation } from "expo-router";
import { useAuthStore } from "../../../src/store/authStore";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileLayout() {
  const { isAuthenticated } = useAuthStore()
  const navigation = useNavigation();

  return (
    <Stack screenOptions={{
      // headerShown: false,

    }}
    >
      <Stack.Screen

        name="index"
        options={{

          title: isAuthenticated ? "Profile" : "Login",
          headerShown: isAuthenticated ? true : false
        }}
      />
      <Stack.Screen
        name="personalInfo"
        options={{
          title: "Personal Info",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
          headerShown: true
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: "Login & Security",
          headerShown: true
        }}
      />

      <Stack.Screen
        name="(orders)"
        options={({ navigation }) => ({
          headerShown: false,
          title: "Orders",
          headerBackTitle: "Back",

        })}
      />
    </Stack>
  );
}
