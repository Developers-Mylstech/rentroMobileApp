import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import useTicketStore from '../../../../src/store/ticketStore'

const STATUS_COLORS = {
  open: { bg: '#EFF6FF', text: '#3B82F6' },
  in_progress: { bg: '#FEF3C7', text: '#F59E0B' },
  resolved: { bg: '#D1FAE5', text: '#10B981' },
  closed: { bg: '#F3F4F6', text: '#6B7280' },
}

const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  URGENT: 'bg-red-100 text-red-600',
}

export default function TicketDetail() {
  const { ticketId } = useLocalSearchParams()
  const router = useRouter()
  const [commentText, setCommentText] = useState('')
  const [sendingComment, setSendingComment] = useState(false)

  const { selectedTicket, isLoading, error, getTicketById, addComment, updateStatus, clearSelectedTicket } = useTicketStore()

  useEffect(() => {
    getTicketById(ticketId)
    return () => clearSelectedTicket()
  }, [ticketId])

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a message')
      return
    }
    setSendingComment(true)
    const result = await addComment(ticketId, commentText.trim())
    setSendingComment(false)
    if (result) {
      setCommentText('')
    }
  }

  const handleCloseTicket = () => {
    Alert.alert('Close Ticket', 'Are you sure you want to close this ticket?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Close', style: 'destructive', onPress: () => updateStatus(ticketId, 'CLOSED') },
    ])
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (isLoading && !selectedTicket) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (error && !selectedTicket) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
        <Text className="text-red-500 text-lg font-bold mt-4">Failed to load ticket</Text>
        <Text className="text-gray-500 mt-2 text-center">{error}</Text>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-xl mt-6" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!selectedTicket) return null

  const statusInfo = STATUS_COLORS[selectedTicket.status] || STATUS_COLORS.open
  const isClosed = selectedTicket.status === 'closed'
  const comments = selectedTicket.comments || []

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Ticket Info Card */}
          <View className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 overflow-hidden">
            <View className="px-4 py-3" style={{ backgroundColor: statusInfo.bg }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="pricetag" size={16} color={statusInfo.text} />
                  <Text className="font-bold text-base ml-2" style={{ color: statusInfo.text }}>
                    {selectedTicket.ticketNumber || `Ticket #${ticketId}`}
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${selectedTicket.priority ? (PRIORITY_COLORS[selectedTicket.priority] || 'bg-gray-100 text-gray-600').split(' ')[0] : 'bg-gray-100'}`}>
                  <Text className={`text-xs font-medium ${selectedTicket.priority ? (PRIORITY_COLORS[selectedTicket.priority] || 'text-gray-600').split(' ')[1] : 'text-gray-600'}`}>
                    {selectedTicket.priority || 'LOW'}
                  </Text>
                </View>
              </View>
            </View>

            <View className="p-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-lg font-bold text-gray-900">{selectedTicket.title}</Text>
                  {selectedTicket.category && (
                    <View className="bg-gray-100 self-start px-2 py-0.5 rounded mt-1">
                      <Text className="text-gray-500 text-xs">{selectedTicket.category.replace(/_/g, ' ')}</Text>
                    </View>
                  )}
                </View>
                <View className="px-3 py-1 rounded-full" style={{ backgroundColor: statusInfo.bg }}>
                  <Text className="text-xs font-semibold" style={{ color: statusInfo.text }}>
                    {selectedTicket.status?.replace(/_/g, ' ')?.toUpperCase() || 'OPEN'}
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="text-gray-800 leading-6">{selectedTicket.description || 'No description'}</Text>
              </View>

              <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                <View>
                  <Text className="text-gray-400 text-xs">Raised by</Text>
                  <Text className="text-gray-700 text-sm font-medium">{selectedTicket.raisedByName || 'You'}</Text>
                </View>
                <Text className="text-gray-400 text-xs">{formatDate(selectedTicket.createdAt)}</Text>
              </View>

              {!isClosed && (
                <TouchableOpacity
                  className="flex-row items-center justify-center mt-3 pt-3 border-t border-gray-100"
                  onPress={handleCloseTicket}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                  <Text className="text-red-500 text-sm font-medium ml-1">Close Ticket</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Comments Section */}
          <View className="mx-4 mt-4">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Comments ({comments.length})
            </Text>
            {comments.length === 0 ? (
              <View className="bg-white rounded-xl border border-gray-100 p-6 items-center">
                <Ionicons name="chatbubbles-outline" size={40} color="#D1D5DB" />
                <Text className="text-gray-500 mt-2">No comments yet</Text>
                <Text className="text-gray-400 text-sm">Our team will respond shortly</Text>
              </View>
            ) : (
              comments.map((comment, index) => {
                const isSupport = comment.authorName !== selectedTicket.raisedByName
                return (
                  <View
                    key={comment.id || index}
                    className={`mb-3 ${isSupport ? 'items-start' : 'items-end'}`}
                  >
                    <View
                      className={`max-w-[85%] rounded-xl p-3 ${isSupport ? 'bg-white border border-gray-100 rounded-tl-sm' : 'bg-blue-500 rounded-tr-sm'}`}
                    >
                      {isSupport && (
                        <Text className="text-xs font-semibold text-blue-500 mb-1">
                          {comment.authorName || 'Support Team'}
                        </Text>
                      )}
                      <Text className={isSupport ? 'text-gray-800' : 'text-white'}>{comment.message}</Text>
                      <Text className={`text-xs mt-1 ${isSupport ? 'text-gray-400' : 'text-blue-100'}`}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </View>
                  </View>
                )
              })
            )}
          </View>

          {/* Close Status Message */}
          {isClosed && (
            <View className="mx-4 mt-4 mb-6 bg-gray-100 rounded-xl p-4 flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#6B7280" />
              <Text className="text-gray-600 ml-2 font-medium">This ticket has been closed</Text>
            </View>
          )}
        </ScrollView>

        {/* Comment Input */}
        {!isClosed && (
          <View className="bg-white border-t border-gray-200 px-4 py-3">
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-gray-800 max-h-20"
                placeholder="Type your comment..."
                placeholderTextColor="#9CA3AF"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                editable={!sendingComment}
              />
              <TouchableOpacity
                className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center ml-2"
                onPress={handleSendComment}
                disabled={sendingComment || !commentText.trim()}
              >
                {sendingComment ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
