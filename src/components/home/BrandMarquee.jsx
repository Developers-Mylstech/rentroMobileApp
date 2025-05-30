import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, Image } from 'react-native';
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

  console.log(brands, 'brands');

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

  return (
    <View
      className="overflow-hidden my-4 py-3 rounded-lg"
      onLayout={handleContainerLayout}
    >
      <Animated.View
        className="flex-row"
        style={{ transform: [{ translateX: scrollAnim }] }}
        onLayout={handleContentLayout}
        shouldRasterizeIOS={true}
        renderToHardwareTextureAndroid={true}
      >
        {brands?.map((brand, index) => (
          <Text
            key={index}
            className="mx-4 text-gray-700 font-medium"
            style={textStyle}
          >
            {brand?.name}
          </Text>
        ))}

        {brands.map((brand, index) => (
          <>
            <View key={`dup-${index}`} >
              <Image
                source={{ uri: brand?.image?.imageUrl }}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>
          </>
        ))}
      </Animated.View>
    </View>
  );
}
