import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert, Dimensions, Image, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import useTicketStore from '../../../src/store/ticketStore'
import axiosInstance from '../../../src/utils/axiosInstance'

const SCREEN_HEIGHT = Dimensions.get('window').height

const CATEGORIES = [
  { value: 'ORDER_ISSUE', label: 'Order Issue' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'SHIPPING', label: 'Shipping' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'ACCOUNT', label: 'Account' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'OTHER', label: 'Other' },
]

const PRIORITIES = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

export default function TicketsScreen() {
  const router = useRouter()
  const { tickets, isLoading, error, fetchMyTickets, createTicket } = useTicketStore()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('ORDER_ISSUE')
  const [priority, setPriority] = useState('LOW')
  const [selectedImages, setSelectedImages] = useState([])
  const [uploadedImageIds, setUploadedImageIds] = useState([])
  const [creating, setCreating] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    fetchMyTickets()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const pickImage = async () => {
    Alert.alert('Upload Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync()
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required')
            return
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [4, 3],
          })
          if (!result.canceled) {
            setSelectedImages(prev => [...prev, result.assets[0]])
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Gallery permission is required')
            return
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [4, 3],
          })
          if (!result.canceled) {
            setSelectedImages(prev => [...prev, result.assets[0]])
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setUploadedImageIds(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async () => {
    if (selectedImages.length === 0) return []
    setUploadingImages(true)
    const ids = []
    try {
      for (const image of selectedImages) {
        const formData = new FormData()
        formData.append('file', {
          uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          type: 'image/jpeg',
          name: 'upload.jpg',
        })
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/image-entities/upload?quality=80&fallbackToJpeg=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          body: formData,
        })
        const responseData = await response.json()
        const imageId = responseData?.image?.imageId || responseData?.imageId
        if (imageId) {
          ids.push(imageId)
        }
      }
      setUploadedImageIds(ids)
    } catch (error) {
      console.error('Image upload error:', error)
      Alert.alert('Upload Error', 'Failed to upload some images. Continue without them?')
    } finally {
      setUploadingImages(false)
    }
    return ids
  }

  const handleCreateTicket = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your issue')
      return
    }
    setCreating(true)
    const imageIds = await uploadImages()
    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      attachmentImageIds: imageIds.length > 0 ? imageIds : undefined,
    }
    const result = await createTicket(payload)
    setCreating(false)
    if (result) {
      setShowCreateForm(false)
      setTitle('')
      setDescription('')
      setCategory('ORDER_ISSUE')
      setPriority('LOW')
      setSelectedImages([])
      setUploadedImageIds([])
      router.push(`/(tabs)/(profile)/ticket/${result.id}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-600'
      case 'in_progress': return 'bg-yellow-100 text-yellow-600'
      case 'resolved': return 'bg-green-100 text-green-600'
      case 'closed': return 'bg-gray-100 text-gray-600'
      default: return 'bg-blue-100 text-blue-600'
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <View className="bg-white px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Support Tickets</Text>
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
              onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-semibold ml-1">New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading && tickets.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : tickets.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="headset-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-700 text-lg font-semibold mt-4">No Support Tickets</Text>
            <Text className="text-gray-500 text-center mt-2">Create a ticket and our team will help you</Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-xl mt-6 flex-row items-center"
              onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Create Ticket</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
            {tickets.map((ticket, index) => (
              <TouchableOpacity
                key={ticket.id || index}
                className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
                onPress={() => router.push(`/(tabs)/(profile)/ticket/${ticket.id}`)}
                activeOpacity={0.8}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-semibold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                    {ticket.title || ticket.ticketNumber || `Ticket #${ticket.id}`}
                  </Text>
                  <View className={`px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                    <Text className="text-xs font-medium">
                      {ticket.status?.replace(/_/g, ' ')?.toUpperCase() || 'OPEN'}
                    </Text>
                  </View>
                </View>
                {ticket.description && (
                  <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>{ticket.description}</Text>
                )}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    {ticket.category && (
                      <View className="bg-gray-100 px-2 py-0.5 rounded">
                        <Text className="text-gray-500 text-xs">{ticket.category.replace(/_/g, ' ')}</Text>
                      </View>
                    )}
                    {ticket.priority && (
                      <View className={`px-2 py-0.5 rounded ${ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs ${ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'text-red-500' : 'text-gray-500'}`}>
                          {ticket.priority}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-400 text-xs">{formatDate(ticket.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Create Ticket Modal */}
      <Modal visible={showCreateForm} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-end">
            <View
              className="bg-white rounded-t-2xl flex-1"
              style={{
                maxHeight: SCREEN_HEIGHT * 0.85,
              }}
            >
              <View className="flex-row justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">New Support Ticket</Text>
                <TouchableOpacity onPress={() => setShowCreateForm(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text className="text-sm font-medium text-gray-700 mb-1">Title *</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-800"
                  placeholder="Brief title for your issue"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text className="text-sm font-medium text-gray-700 mb-1">Description *</Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-800"
                  placeholder="Describe your issue in detail"
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />

                {/* Image Upload */}
                <Text className="text-sm font-medium text-gray-700 mb-2">Attachments</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {selectedImages.map((img, index) => (
                    <View key={index} className="mr-3 relative">
                      <Image source={{ uri: img.uri }} className="w-20 h-20 rounded-lg border border-gray-200" />
                      <TouchableOpacity
                        className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center"
                        onPress={() => removeImage(index)}
                      >
                        <Text className="text-white font-bold text-xs">✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {selectedImages.length < 5 && (
                    <TouchableOpacity
                      className="w-20 h-20 border-2 border-dashed border-blue-300 rounded-lg items-center justify-center bg-blue-50"
                      onPress={pickImage}
                    >
                      <Ionicons name="camera-outline" size={24} color="#3B82F6" />
                      <Text className="text-blue-500 text-xs mt-1">Add</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>

                {/* Category */}
                <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      className={`px-4 py-2 rounded-full mr-2 ${category === cat.value ? 'bg-blue-500' : 'bg-gray-100'}`}
                      onPress={() => setCategory(cat.value)}
                    >
                      <Text className={`font-medium text-sm ${category === cat.value ? 'text-white' : 'text-gray-600'}`}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Priority */}
                <Text className="text-sm font-medium text-gray-700 mb-2">Priority</Text>
                <View className="flex-row gap-2 mb-6">
                  {PRIORITIES.map((p) => (
                    <TouchableOpacity
                      key={p.value}
                      className={`flex-1 py-3 rounded-xl items-center ${priority === p.value ? 'bg-blue-500' : 'bg-gray-100'}`}
                      onPress={() => setPriority(p.value)}
                    >
                      <Text className={`font-semibold text-sm ${priority === p.value ? 'text-white' : 'text-gray-600'}`}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className="bg-blue-500 py-4 rounded-xl items-center mb-6"
                  onPress={handleCreateTicket}
                  disabled={creating || uploadingImages}
                >
                  {creating || uploadingImages ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold text-base ml-2">
                        {uploadingImages ? 'Uploading Images...' : 'Submitting...'}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-white font-semibold text-base">Submit Ticket</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}
