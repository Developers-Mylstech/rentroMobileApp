import { View, Text, Image, TouchableOpacity, ScrollView, VirtualizedList } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { Link } from 'expo-router'
import Login from '../../../src/components/login'


export default function index() {

  return (
    // <ScrollView className="flex-1 bg-white">
    //   <View className="p-5">
    //     {/* Header */}
    //     <Text className="text-3xl font-semibold mb-5">Profile</Text>

    //     {/* Profile Section */}
    //     <TouchableOpacity className="flex-row items-center mb-5 pb-5 border-b border-gray-200">
    //       <Image
    //         source={{ uri: "https://via.placeholder.com/60" }}
    //         className="w-14 h-14 rounded-full bg-gray-200"
    //       />
    //       <View className="ml-4 flex-1">
    //         <Text className="text-lg font-medium">Judy</Text>
    //         <Text className="text-gray-500">Show profile</Text>
    //       </View>
    //       <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //     </TouchableOpacity>

    //     {/* Order Tracking Card */}
    //     <View className="bg-blue-50 rounded-xl p-4 mb-8 flex-row items-center">
    //       <View className="bg-blue-500 p-2 rounded-lg mr-3">
    //         <Ionicons name="cube" size={24} color="white" />
    //       </View>
    //       <View className="flex-1">
    //         <Text className="text-lg font-medium">Track Your Last Order</Text>
    //         <Text className="text-gray-500">Delivered Till 25 May</Text>
    //       </View>
    //     </View>

    //     {/* Settings Section */}
    //     <Text className="text-2xl font-semibold mb-4">Settings</Text>

    //     {/* Settings Menu Items */}
    //     <Link href="/(tabs)/(profile)/personalInfo" asChild>
    //       <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
    //         <Ionicons name="person-circle-outline" size={24} color="#4b5563" className="mr-3" />
    //         <Text className="flex-1 text-base">Personal information</Text>
    //         <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //       </TouchableOpacity>
    //     </Link>
    //     <Link href="/(tabs)/(profile)/payment" asChild>

    //       <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
    //         <Ionicons name="wallet-outline" size={24} color="#4b5563" className="mr-3" />
    //         <Text className="flex-1 text-base">Payments and payouts</Text>
    //         <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //       </TouchableOpacity>
    //     </Link>

    //     <Link href="/(tabs)/(profile)/order" asChild>
    //       <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
    //         <Ionicons name="document-text-outline" size={24} color="#4b5563" className="mr-3" />
    //         <Text className="flex-1 text-base">Orders</Text>
    //         <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //       </TouchableOpacity>
    //     </Link>

    //     <Link href="/(tabs)/(profile)/security" asChild>

    //       <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
    //         <Ionicons name="shield-outline" size={24} color="#4b5563" className="mr-3" />
    //         <Text className="flex-1 text-base">Login & security</Text>
    //         <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //       </TouchableOpacity>

    //     </Link>
        
    //     <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
    //       <Ionicons name="options-outline" size={24} color="#4b5563" className="mr-3" />
    //       <Text className="flex-1 text-base">Accessibility</Text>
    //       <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    //     </TouchableOpacity>
    //   </View>
    // </ScrollView >
    <>

    <Login/>
    </>
  )
}