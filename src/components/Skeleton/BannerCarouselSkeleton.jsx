import React from 'react';
import { View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function BannerCarouselSkeleton() {
  return (
    <View>
      <View style={{ width: width - 40 }}>
        <View className="bg-gray-200 h-40 rounded-lg animate-pulse">
        </View>
      </View>
      

      <View className="flex-row justify-center my-2">
        {[1, 2, 3].map((_, index) => (
          <View 
            key={index} 
            className="h-2 w-2 rounded-full mx-1 bg-gray-300" 
          />
        ))}
      </View>
    </View>
  );
}
