import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useFocusEffect } from 'expo-router'
import Login from '../../../src/components/login'
import { useAuthStore } from '../../../src/store/authStore'
import useProfileStore from '../../../src/store/profileStore'
import useOrderStore from '../../../src/store/orderStore'
import useAddressStore from '../../../src/store/addressStore'
import useTicketStore from '../../../src/store/ticketStore'
import useInvoiceStore from '../../../src/store/invoiceStore'
import ProfileSkeleton from '../../../src/components/Skeleton/ProfileSkeleton'

const TABS = [
  { id: 'orders', label: 'Orders', icon: 'cube-outline' },
  { id: 'addresses', label: 'Addresses', icon: 'location-outline' },
  { id: 'tickets', label: 'Support', icon: 'headset-outline' },
  { id: 'invoices', label: 'Invoices', icon: 'receipt-outline' },
]

const STATUS_COLORS = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
  processing: '#F59E0B',
  open: '#3B82F6',
  closed: '#6B7280',
}

export default function ProfileScreen() {
  const router = useRouter()
  const { isAuthenticated, logout, isLoading: isLoadingAuth } = useAuthStore()
  const { fetchProfile, profile, isLoading: profileLoading } = useProfileStore()
  const { getAllOrders, orders, isLoading: ordersLoading } = useOrderStore()
  const { fetchAddresses, addresses, loading: addressesLoading } = useAddressStore()
  const { fetchMyTickets, tickets, isLoading: ticketsLoading } = useTicketStore()
  const { fetchInvoices, invoices, isLoading: invoicesLoading } = useInvoiceStore()

  const [activeTab, setActiveTab] = useState('orders')
  const [refreshing, setRefreshing] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadAllData()
      }
    }, [isAuthenticated])
  )

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated])

  const loadAllData = async () => {
    getAllOrders()
    fetchAddresses()
    fetchMyTickets()
    fetchInvoices()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ])
  }

  if (!isAuthenticated) {
    return <Login />
  }

  if (profileLoading && !profile) {
    return <ProfileSkeleton />
  }

  const isLoading =
    activeTab === 'orders' ? ordersLoading :
    activeTab === 'addresses' ? addressesLoading :
    activeTab === 'tickets' ? ticketsLoading :
    invoicesLoading

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const renderOrdersTab = () => (
    <View>
      {orders.length === 0 ? (
        <View className="items-center py-10">
          <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-500 mt-3 font-medium">No orders yet</Text>
          <Text className="text-gray-400 text-sm mt-1">Start shopping to see your orders</Text>
        </View>
      ) : (
        orders.slice(0, 5).map((order, index) => (
          <TouchableOpacity
            key={order?.orderId || index}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
            onPress={() => router.push(`/(tabs)/(profile)/(orders)/${order?.orderId}`)}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-gray-800">{order.orderNumber || `Order #${index + 1}`}</Text>
              <View className="px-2 py-1 rounded-full" style={{ backgroundColor: `${STATUS_COLORS[order.status] || '#6B7280'}20` }}>
                <Text className="text-xs font-medium" style={{ color: STATUS_COLORS[order.status] || '#6B7280' }}>
                  {order.status?.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400 text-sm">{formatDate(order?.createdAt)}</Text>
              <Text className="font-bold text-gray-800">₹{order?.totalAmount?.toFixed(2) || '0.00'}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
      {orders.length > 5 && (
        <TouchableOpacity
          className="items-center py-3"
          onPress={() => router.push('/(tabs)/(profile)/(orders)')}
        >
          <Text className="text-blue-500 font-medium">View All Orders</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderAddressesTab = () => (
    <View>
      {addresses.length === 0 ? (
        <View className="items-center py-10">
          <Ionicons name="location-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-500 mt-3 font-medium">No addresses added</Text>
          <Text className="text-gray-400 text-sm mt-1">Add an address for checkout</Text>
        </View>
      ) : (
        addresses.slice(0, 3).map((address, index) => (
          <TouchableOpacity
            key={address?.addressId || index}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
            onPress={() => router.push('/personalInfo')}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center mb-1">
              <Ionicons
                name={address?.addressType === 'Office' ? 'briefcase-outline' : 'home-outline'}
                size={16} color="#3B82F6"
              />
              <Text className="font-semibold text-gray-800 ml-2">{address?.buildingName || 'Address'}</Text>
              {address?.default && (
                <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                  <Text className="text-green-700 text-xs font-medium">Default</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm ml-6">{address?.streetAddress}, {address?.area}, {address?.emirate}</Text>
          </TouchableOpacity>
        ))
      )}
      <TouchableOpacity
        className="items-center py-3"
        onPress={() => router.push('/personalInfo')}
      >
        <Text className="text-blue-500 font-medium">Manage Addresses</Text>
      </TouchableOpacity>
    </View>
  )

  const renderTicketsTab = () => (
    <View>
      {tickets.length === 0 ? (
        <View className="items-center py-10">
          <Ionicons name="headset-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-500 mt-3 font-medium">No support tickets</Text>
          <Text className="text-gray-400 text-sm mt-1">Contact us for any issues</Text>
        </View>
      ) : (
        tickets.slice(0, 5).map((ticket, index) => (
          <TouchableOpacity
            key={ticket?.id || index}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
            onPress={() => router.push(`/(tabs)/(profile)/ticket/${ticket?.id}`)}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-gray-800 flex-1 mr-2" numberOfLines={1}>{ticket?.title || ticket?.ticketNumber}</Text>
              <View className={`px-2 py-1 rounded-full ${ticket?.status === 'closed' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                <Text className={`text-xs font-medium ${ticket?.status === 'closed' ? 'text-gray-600' : 'text-blue-600'}`}>
                  {ticket?.status?.toUpperCase() || 'OPEN'}
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 text-sm">{formatDate(ticket?.createdAt)}</Text>
          </TouchableOpacity>
        ))
      )}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl py-3 flex-row justify-center items-center mt-2"
        onPress={() => router.push('/(tabs)/(profile)/tickets')}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white font-semibold ml-1">New Support Ticket</Text>
      </TouchableOpacity>
    </View>
  )

  const renderInvoicesTab = () => (
    <View>
      {invoices.length === 0 ? (
        <View className="items-center py-10">
          <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-500 mt-3 font-medium">No invoices yet</Text>
          <Text className="text-gray-400 text-sm mt-1">Invoices will appear after purchases</Text>
        </View>
      ) : (
        invoices.slice(0, 5).map((invoice, index) => (
          <TouchableOpacity
            key={invoice?.id || index}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
            onPress={() => router.push(`/(tabs)/(profile)/invoice/${invoice?.id}`)}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-gray-800">{invoice?.invoiceNumber || `INV-${index + 1}`}</Text>
              <View className={`px-2 py-1 rounded-full ${invoice?.isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Text className={`text-xs font-medium ${invoice?.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {invoice?.isPaid ? 'PAID' : 'PENDING'}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-400 text-sm">{formatDate(invoice?.createdAt)}</Text>
              <Text className="font-bold text-gray-800">₹{invoice?.totalAmount?.toLocaleString() || '0'}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
      {invoices.length > 5 && (
        <TouchableOpacity className="items-center py-3">
          <Text className="text-blue-500 font-medium">View All Invoices</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View className="items-center py-10">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )
    }
    switch (activeTab) {
      case 'orders': return renderOrdersTab()
      case 'addresses': return renderAddressesTab()
      case 'tickets': return renderTicketsTab()
      case 'invoices': return renderInvoicesTab()
      default: return renderOrdersTab()
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#3B82F6']} />
        }
      >
        {/* Profile Header */}
        <View className="bg-white px-5 pt-2 pb-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-900">Profile</Text>
            <TouchableOpacity onPress={() => router.push('/UserInfo')}>
              <Ionicons name="settings-outline" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/UserInfo')}
            className="flex-row items-center"
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-xl font-bold">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-900">{profile?.name || 'User'}</Text>
              <Text className="text-gray-500 text-sm">{profile?.email || ''}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <StatItem icon="cube-outline" label="Orders" count={orders.length} onPress={() => setActiveTab('orders')} />
          <StatItem icon="location-outline" label="Addresses" count={addresses.length} onPress={() => setActiveTab('addresses')} />
          <StatItem icon="headset-outline" label="Tickets" count={tickets.length} onPress={() => setActiveTab('tickets')} />
          <StatItem icon="receipt-outline" label="Invoices" count={invoices.length} onPress={() => setActiveTab('invoices')} />
        </View>

        {/* Tab Navigation */}
        <View className="mx-4 mt-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white rounded-xl">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                className={`flex-row items-center px-4 py-3 ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
                onPress={() => setActiveTab(tab.id)}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={activeTab === tab.id ? '#3B82F6' : '#6B7280'}
                />
                <Text className={`ml-2 font-medium text-sm ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View className="mx-4 mt-4 mb-6">
          {renderTabContent()}
        </View>

        {/* Settings Section */}
        <View className="mx-4 mb-6 bg-white rounded-xl border border-gray-100">
          <TouchableOpacity
            onPress={() => router.push('/personalInfo')}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
          >
            <Ionicons name="location-outline" size={22} color="#4B5563" />
            <Text className="flex-1 text-base text-gray-800 ml-3">Addresses</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/payment')}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
          >
            <Ionicons name="wallet-outline" size={22} color="#4B5563" />
            <Text className="flex-1 text-base text-gray-800 ml-3">Payments & Payouts</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/(profile)/(orders)')}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
          >
            <Ionicons name="document-text-outline" size={22} color="#4B5563" />
            <Text className="flex-1 text-base text-gray-800 ml-3">Orders</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/security')}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
          >
            <Ionicons name="shield-outline" size={22} color="#4B5563" />
            <Text className="flex-1 text-base text-gray-800 ml-3">Login & Security</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-4 px-4"
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="flex-1 text-base text-red-500 ml-3">Logout</Text>
            <Ionicons name="chevron-forward" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const StatItem = ({ icon, label, count, onPress }) => (
  <TouchableOpacity className="flex-1 items-center" onPress={onPress}>
    <Ionicons name={icon} size={24} color="#3B82F6" />
    <Text className="text-lg font-bold text-gray-900 mt-1">{count}</Text>
    <Text className="text-xs text-gray-500">{label}</Text>
  </TouchableOpacity>
)


