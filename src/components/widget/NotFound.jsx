import { View, Text, Image } from 'react-native'
import React from 'react'
import notFound from '../../../assets/55024593_9264822.webp';

export default function NotFound({title}) {
    return (
        <View className="min-h-full items-center justify-center py-10">
            <Image
                source={notFound}
                className="w-40 h-40"
                resizeMode="contain"
            />
            <Text className="text-black mb-4 uppercase text-sm font-semibold ">{title} not found ... !!</Text>
        </View>
    )
}