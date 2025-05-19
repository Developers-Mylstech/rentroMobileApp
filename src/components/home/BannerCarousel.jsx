import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

export default function BannerCarousel({ 
  banners = [], 
  onBannerPress = () => {},
  renderPagination,
  autoplayInterval = 3000 
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Autoplay functionality
  useEffect(() => {
    if (banners.length <= 1) return; 
    
    const autoplayTimer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true
      });
      setActiveIndex(nextIndex);
    }, autoplayInterval);
    
    return () => clearTimeout(autoplayTimer);
  }, [activeIndex, banners.length, autoplayInterval]);
 
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 40));
    setActiveIndex(index);
  };

  
  const PaginationDots = () => (
    <View className="flex-row justify-center my-2">
      {banners.map((_, index) => (
        <View 
          key={index} 
          className={`h-2 w-2 rounded-full mx-1 ${
            index === activeIndex ? 'bg-primary' : 'bg-gray-300'
          }`} 
        />
      ))}
    </View>
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={banners || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={width - 40}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width: width - 40 }}>
            <Banner
              
              imageUrl={item.imageUrl}
            
              onPress={() => onBannerPress(item)}
            />
          </View>
        )}
      />
      
      {renderPagination ? renderPagination(activeIndex, items.length) : <PaginationDots />}
    </View>
  );
}


import { ImageBackground, TouchableOpacity, Text } from 'react-native';

const Banner = ({ imageUrl, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="my-3 rounded-xl mx-2 overflow-hidden"
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        className="w-full h-40 justify-end"
        imageStyle={{ borderRadius: 12 }}
        resizeMode="cover"
      >
        
      </ImageBackground>
    </TouchableOpacity>
  );
};

