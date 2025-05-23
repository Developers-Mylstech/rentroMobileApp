import { View, Text, Image, TouchableOpacity, ScrollView, VirtualizedList } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { Link } from 'expo-router'
import Login from '../../../src/components/login'
import { useAuthStore } from '../../../src/store/authStore'
import useProfileStore from '../../../src/store/profileStore'
import ProfileSkeleton from '../../../src/components/Skeleton/ProfileSkeleton'


export default function index() {
  const { isAuthenticated,logout } = useAuthStore()

  const { fetchProfile, profile, isLoading, error } = useProfileStore()

  useEffect(() => {
    fetchProfile()
  }, [])

  console.log(profile, 'profile')

  if (isLoading) {
    return <ProfileSkeleton/>
  }

  if (!isAuthenticated) {
    return <Login/>
  }

  return (
    <>

      <ScrollView className="flex-1 bg-white">
        <View className="p-5">
          {/* Header */}
          <Text className="text-3xl font-semibold mb-5">Profile</Text>

          <TouchableOpacity className="flex-row items-center mb-5 pb-5 border-b border-gray-200">
            <Ionicons name="person-circle-outline" size={50} color="#4b5563" className="mr-3" />
            
            <View className="ml-4 flex-1">
              <Text className="text-lg font-medium">{profile?.name}</Text>
              <Text className="text-gray-500">{profile?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Order Tracking Card */}
          <View className="bg-blue-50 rounded-xl p-4 mb-8 flex-row items-center">
            <View className="bg-blue-500 p-2 rounded-lg mr-3">
              <Ionicons name="cube" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-medium">Track Your Last Order</Text>
              <Text className="text-gray-500">Delivered Till 25 May</Text>
            </View>
          </View>

          {/* Settings Section */}
          <Text className="text-2xl font-semibold mb-4">Settings</Text>

          {/* Settings Menu Items */}
          <Link href="/(tabs)/(profile)/personalInfo" asChild>
            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
              <Ionicons name="person-circle-outline" size={24} color="#4b5563" className="mr-3" />
              <Text className="flex-1 text-base">Personal information</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/(profile)/payment" asChild>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
              <Ionicons name="wallet-outline" size={24} color="#4b5563" className="mr-3" />
              <Text className="flex-1 text-base">Payments and payouts</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/(profile)/(orders)" asChild>
            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
              <Ionicons name="document-text-outline" size={24} color="#4b5563" className="mr-3" />
              <Text className="flex-1 text-base">Orders</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/(profile)/security" asChild>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
              <Ionicons name="shield-outline" size={24} color="#4b5563" className="mr-3" />
              <Text className="flex-1 text-base">Login & security</Text>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

          </Link>

          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-200">
            <Ionicons name="options-outline" size={24} color="#4b5563" className="mr-3" />
            <Text className="flex-1 text-base">Accessibility</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center py-4 border-b border-gray-200"
            onPress={() => logout()}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" className="mr-3" />
            <Text className="flex-1 text-base text-red-500">Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView >
    </>

  )
}
