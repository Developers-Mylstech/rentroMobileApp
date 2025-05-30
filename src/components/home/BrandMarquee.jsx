import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, Image, Platform } from 'react-native';
import { InteractionManager } from 'react-native';
import useBrandStore from '../../store/brandStore';

export default function BrandMarquee({
  speed = 30,
  direction = 'left',
  textStyle = {}
}) {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(0);
  const contentWidth = useRef(0);
  const animationRef = useRef(null);
  const { fetchBrands, brands, isLoading, error } = useBrandStore();

  useEffect(() => {
    fetchBrands()
    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (containerWidth.current && contentWidth.current) {
      // Use InteractionManager to ensure animation starts after any interactions
      InteractionManager.runAfterInteractions(() => {
        startAnimation();
      });
    }
  }, [containerWidth.current, contentWidth.current]);

  const startAnimation = () => {
    const distance = contentWidth.current + containerWidth.current;
    const duration = distance * speed;

    scrollAnim.setValue(direction === 'left' ? containerWidth.current : -contentWidth.current);

    animationRef.current = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: direction === 'left' ? -contentWidth.current : containerWidth.current,
        duration,
        easing: Easing.linear,
        useNativeDriver: true, // This is crucial for smooth animations
      })
    );

    animationRef.current.start();
  };

  const handleContainerLayout = (e) => {
    containerWidth.current = e.nativeEvent.layout.width;
    if (contentWidth.current) startAnimation();
  };

  const handleContentLayout = (e) => {
    contentWidth.current = e.nativeEvent.layout.width;
    if (containerWidth.current) startAnimation();
  };

  // Platform-specific shadow styles
  const containerStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  });

  return (
    <View
      className="overflow-hidden my-4 py-3 rounded-lg bg-white"
      style={containerStyle}
      onLayout={handleContainerLayout}
    >
      <View className="mb-2 px-4">
        <Text className="text-gray-800 font-semibold text-base">Our Partners</Text>
      </View>
      
      <Animated.View
        className="flex-row items-center"
        style={{ transform: [{ translateX: scrollAnim }] }}
        onLayout={handleContentLayout}
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
      >
        {brands?.map((brand, index) => (
          <View 
            key={index}
            className="mx-4 items-center justify-center"
          >
            {brand?.image?.imageUrl && (
              <Image
                source={{ uri: brand?.image?.imageUrl }}
                className="w-12 h-12 rounded-full"
                resizeMode="contain"
                style={{
                  backgroundColor: '#f9fafb',
                  borderWidth: 1,
                  borderColor: '#f3f4f6',
                }}
              />
            )}
            <Text
              className="text-gray-700 text-xs mt-1 font-medium"
              style={textStyle}
            >
              {brand?.name}
            </Text>
          </View>
        ))}

        {/* Duplicate brands for seamless looping */}
        {brands.map((brand, index) => (
          <View 
            key={`dup-${index}`}
            className="mx-4 items-center justify-center"
          >
            {brand?.image?.imageUrl && (
              <Image
                source={{ uri: brand?.image?.imageUrl }}
                className="w-12 h-12 rounded-full"
                resizeMode="contain"
                style={{
                  backgroundColor: '#f9fafb',
                  borderWidth: 1,
                  borderColor: '#f3f4f6',
                }}
              />
            )}
            <Text
              className="text-gray-700 text-xs mt-1 font-medium"
              style={textStyle}
            >
              {brand?.name}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
