import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import Banner from './Banner';

const { width } = Dimensions.get('window');

export default function BannerCarousel({ 
  banners = [], 
  onBannerPress = () => {},
  renderPagination
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Default banners with custom colors
  const defaultBanners = [
    {
      id: '1',
      title: "New Year Offer",
      discount: "30% OFF",
      period: "16-31 Dec",
      buttonText: "Get Now",
      imageUrl: "https://via.placeholder.com/150",
      bgColor: "bg-cars/10" // Cars section color
    },
    {
      id: '2',
      title: "Summer Sale",
      discount: "25% OFF",
      period: "1-15 Jun",
      buttonText: "Shop Now",
      imageUrl: "https://via.placeholder.com/150",
      bgColor: "bg-garage/10" // Garage section color
    },
    {
      id: '3',
      title: "Flash Deal",
      discount: "50% OFF",
      period: "Today Only",
      buttonText: "Grab Now",
      imageUrl: "https://via.placeholder.com/150",
      bgColor: "bg-spareparts/10" // Spare parts section color
    }
  ];

  const items = banners.length > 0 ? banners : defaultBanners;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  // Default pagination dots with custom colors
  const PaginationDots = () => (
    <View className="flex-row justify-center my-2">
      {items.map((_, index) => (
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
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={width - 40} // Adjust for padding
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ width: width - 40 }}>
            <Banner
              title={item.title}
              discount={item.discount}
              period={item.period}
              buttonText={item.buttonText}
              imageUrl={item.imageUrl}
              bgColor={item.bgColor}
              onPress={() => onBannerPress(item)}
            />
          </View>
        )}
      />
      
      {renderPagination ? renderPagination(activeIndex, items.length) : <PaginationDots />}
    </View>
  );
}
