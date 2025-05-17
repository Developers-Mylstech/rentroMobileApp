import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import LinearGradient from 'expo-linear-gradient';

export default function Shop() {
  const router = useRouter();
  
  // Sample product data with multiple images
  const products = [
    {
      id: 1,
      name: 'Kent Supreme Extra',
      price: '500.00 AED',
      originalPrice: '600.00 AED',
      images: [
        'https://www.kent.co.in/images/png/Grand-New-11076.png',
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png'
      ],
      tag: 'NEW',
      category: 'Water Purifier',
      rating: 4.5,
      reviews: 120,
      description: 'Advanced water purifier with RO technology for clean drinking water.',
      features: ['RO Purification', 'UV Sterilization', 'Water Saving Technology', '8L Capacity']
    },
    {
      id: 2,
      name: 'Kent Grand Plus',
      price: '450.00 AED',
      originalPrice: '550.00 AED',
      images: [
        'https://www.kent.co.in/images/png/KENT-Grand-Star-400x400px.png',
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
        'https://www.kent.co.in/images/png/grand-star-front-view-400x400px.png'
      ],
      tag: 'NEW',
      category: 'Water Purifier',
      rating: 4.3,
      reviews: 95,
      description: 'Compact water purifier with advanced filtration system.',
      features: ['RO Purification', 'UV Sterilization', '7L Capacity']
    },
    {
      id: 3,
      name: 'Kent Black Star',
      price: '600.00 AED',
      originalPrice: '700.00 AED',
      images: [
        'https://www.kent.co.in/images/png/grand-star-black-400x400px.png',
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
        'https://www.kent.co.in/images/png/grand-star-black-front-view-400x400px.png'
      ],
      tag: 'NEW',
      category: 'Premium Water Purifier',
      rating: 4.7,
      reviews: 150,
      description: 'Premium water purifier with elegant design and advanced features.',
      features: ['RO Purification', 'UV Sterilization', 'Mineral RO Technology', '10L Capacity']
    },
    {
      id: 4,
      name: 'Kent Sapphire',
      price: '550.00 AED',
      originalPrice: '650.00 AED',
      images: [
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
        'https://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png',
        'hhttps://www.kent.co.in/images/water-purifiers/ro/sapphire/kent-sapphire-image-400x400.png'
      ],
      tag: 'NEW',
      category: 'Designer Water Purifier',
      rating: 4.6,
      reviews: 130,
      description: 'Designer water purifier with advanced purification technology.',
      features: ['RO Purification', 'UV Sterilization', 'Designer Look', '9L Capacity']
    }
  ];

  // Function to handle product press - navigate with all product details
  const handleProductPress = (product) => {
    console.log(`Navigating to product ${product.id}`);
    
    // Navigate to product details with all product data as params
    router.push({
      pathname: `/shop/${product.id}`,
      params: {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: JSON.stringify(product.images), // Convert images array to string
        tag: product.tag,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        description: product.description,
        features: JSON.stringify(product.features)
      }
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
      className="flex-row bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden"
    >
      <Image 
        source={{ uri: item.images[0] }} // Use the first image from the array
        className="w-24 h-24"
        resizeMode="contain"
      />
      
      <View className="flex-1 p-3 justify-center">
        <Text className="font-semibold text-base">{item.name}</Text>
        <Text className="text-blue-500 text-sm   ">{item?.brand || "Rent Ro"}</Text>
        <Text className="text-gray-500 rounded-lg  text-sm ">{item.category}</Text>

        <View className="flex-row items-center mt-1">
          <Text className="font-bold text-base">{item.price}</Text>
          <Text className="text-gray-400 text-xs ml-2 line-through">{item.originalPrice}</Text>
        </View>
      </View>
      
      <View className="justify-center items-center pr-3">
        <View className="bg-green-500 px-2 py-1 rounded mb-2">
          <Text className="text-white text-xs font-bold">{item.tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with search and cart */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <View className="flex-1 mx-3 flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <TextInput className="text-gray-400 flex-1" placeholder='Search for products...'></TextInput>
          <Ionicons name="search" size={20} color="gray" />
        </View>
        
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View className="bg-blue-500 mx-4 my-3 rounded-lg p-4">
        <Text className="text-white font-bold text-lg text-center">Pure Water, Pure Trust - Discover the Perfect Purifier for Every Home.</Text>
        <Image
          source={{ uri: 'https://www.kent.co.in/images/v3/ro-water-purifiers-updated.png' }}
          className="w-full h-28 mt-3"
          resizeMode="contain"
        />
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListFooterComponent={<View style={{ height: 20 }} />} // Add some bottom padding
      />
    </SafeAreaView>
  );
}
