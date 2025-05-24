import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function security() {
  return (
    <View className="flex-1 bg-white p-4 justify-center items-center">
      <LottieView
        source={require('../../../assets/Lotties/underWorking.json')}
        autoPlay
        loop
        style={{ height: 200, width: 200 }}
      />
      <Text className="text-gray-800 text-xs font-semibold uppercase mt-4">This feature under development</Text>
    </View>
  )
}
