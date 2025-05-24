import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import useServiceStore from '../../../src/store/ServiceStore';
import OurServiceSkeleton from '../../../src/components/Skeleton/OurServiceSkeleton';
import NotFound from '../../../src/components/widget/NotFound';
import { LinearGradient } from 'expo-linear-gradient';

export default function Service() {
  const router = useRouter();
  const { getAllServices, services, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); 

  useEffect(() => {
    getAllServices();
  }, []);

  const handleServicePress = (service) => {
    router.push(`/service/${service.ourServiceId}`);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleServicePress(item)}
      className={`${viewMode === 'grid' ? 'w-[49%]' : 'w-full'} mb-5 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200`}
      activeOpacity={0.7}
    >
      <View className={viewMode === 'grid' ? 'flex' : 'flex-row'}>
        <View className={viewMode === 'grid' ? 'w-full' : 'w-1/3 h-32'}>
          <Image
            source={{ uri: item.image?.imageUrl || 'https://via.placeholder.com/150' }}
            className={viewMode === 'grid' ? 'w-full h-44 rounded-t-xl' : 'h-full  w-full aspect-square'}
            resizeMode="cover"
          />
        </View>

        <View className={` ${viewMode === 'grid' ? 'flex gap-3 p-3 -mt-2 bg-white rounded-t-xl' : ' p-3 flex-1 bg-white jsustify justify-start gap-1 '}`}>
          <Text 
            className="text-gray-800 font-semibold text-base" 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>

          <Text 
            className="text-gray-500 text-sm" 
            numberOfLines={viewMode === 'grid' ? 2 : 3}
            ellipsizeMode="tail"
          >
            {item.shortDescription}
          </Text>

          
        </View>
      </View>
    </TouchableOpacity>
  );



  const renderFooter = () => (
    <LinearGradient
      colors={['rgba(219, 234, 254, 0.8)', 'white']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="rounded-xl mt-2 mb-6"
      style={{
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="flex-row justify-between items-center p-6 ">
        <Text className="text-heading-5 text-blue-600 w-1/2 font-medium">
          Didn't find what you're looking for?
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-3 rounded-lg"
          onPress={() => console.log('Request quotation')}
        >
          <Text className="text-white font-semibold text-subheading">Request Quote</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-2">
        <View className="flex-row justify-between items-center py-4 mb-2">
          <Text className="text-gray-800 font-bold text-xl">Our Services</Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-blue-50' : ''}`}
            >
              <Ionicons name="list" size={18} color={viewMode === 'list' ? "#3b82f6" : "#64748b"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-blue-50' : ''}`}
            >
              <Ionicons name="grid" size={16} color={viewMode === 'grid' ? "#3b82f6" : "#64748b"} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="bg-gray-50 border border-gray-200 rounded-xl flex-row items-center px-4 py-3 mb-5">
          <Ionicons name="search" size={20} color="#64748b" className="mr-2" />
          <TextInput
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-gray-700 ml-2"
          />
        </View>

        {isLoading ? (
          <OurServiceSkeleton count={6} />
        ) : error ? (
          <View className="min-h-full items-center justify-center py-10">
            <Text className="text-red-500 mb-4">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item,index) => index.toString()}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} 
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between' } : null}
            ListEmptyComponent={<NotFound title={'services'} />}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
