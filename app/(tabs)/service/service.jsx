import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import useServiceStore from '../../../src/context/ServiceStore';
import OurServiceSkeleton from '../../../src/components/Skeleton/OurServiceSkeleton';
import NotFound from '../../../src/components/widget/NotFound';
import { LinearGradient } from 'expo-linear-gradient';

export default function Service() {
  const router = useRouter();
  const { getAllServices, services, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    getAllServices();
  }, []);

  const handleServicePress = (service) => {
    console.log(`Service selected: ${service.title}`);
  
    router.push(`/service/${service.ourServiceId}`);
  };

  const renderServiceItem = ({ item }) => (
    <>
      {viewMode === 'grid' ? (
        <TouchableOpacity
          onPress={() => handleServicePress(item)}
          className="w-[48%] m-1 mb-4 bg-blue-50 rounded-lg overflow-hidden"
        >
          <View className=" items-center">
            <Image
              source={{ uri: item.image?.imageUrl || 'https://via.placeholder.com/150' }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="w-full flex gap-2 p-2">
              <Text className="text-gray-700 text-heading-5">
                {item.title.split(' ').length > 6 
                  ? item.title.split(' ').slice(0, 6).join(' ') + '...'
                  : item.title}
              </Text>
              <Text className="text-gray-500 text-xs" numberOfLines={3}>
                {item.shortDescription.slice(0, 50)}...
              </Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between px-3 py-2 border border-gray-100 bg-white rounded-lg"
                onPress={() => handleServicePress(item)}
              >
                <Text className="text-blue-500 mr-1">View Service</Text>
                <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleServicePress(item)}
          className="w-full mb-3 bg-blue-50 rounded-lg overflow-hidden"
        >
          <View className="flex-row p-4">
            <Image
              source={{ uri: item.image?.imageUrl || 'https://via.placeholder.com/150' }}
              className="w-20 h-20"
              resizeMode="contain"
            />
            <View className="flex-1 ml-4 justify-center gap-1">
             <Text className="text-black text-heading-5">
               {item.title.split(' ').length > 10 
                  ? item.title.split(' ').slice(0, 10).join(' ') + '...'
                  : item.title}
              </Text>
              <Text className="text-gray-500 text-xs" numberOfLines={3}>
                {item.shortDescription.slice(0, 50)}...
              </Text>
              <TouchableOpacity 
                className="flex-row items-center w-full bg-white px-3 py-1.5 rounded-lg border border-gray-100 self-start"
                onPress={() => handleServicePress(item)}
              >
                <Text className="text-blue-500 mr-1">View Service</Text>
                <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );

  const renderFooter = () => (
    <LinearGradient
      colors={['rgba(219, 234, 254, 1)', 'white']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="rounded-lg"
      style={{
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View className="flex-row justify-between items-center p-6 gap-5">
        <Text className="text-heading-5 text-blue-500 flex-1">
          Didn't Find What Are You Looking For...??
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-3 py-3 rounded-lg"
          onPress={() => console.log('Request quotation')}
        >
          <Text className="text-white font-semibold text-subheading">Request Quotation</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center py-3 mb-2">
          <Text className="text-gray-800 font-bold text-xl">Explore Our Services</Text>
          <TouchableOpacity>
            <Text className="text-blue-500">Search</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-gray-50 border border-gray-200 rounded-lg flex-row items-center px-4 py-2 mb-4">
          <TextInput
            placeholder="What are you looking for......"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-gray-700 py-1"
          />
          <TouchableOpacity>
            <Ionicons name="search" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>


        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity className="flex-row items-center justify-center">
            <Text className="font-bold mr-2">FILTER</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              className={` ${viewMode === 'list' ? 'opacity-100' : 'opacity-50'}`}
            >
              <Ionicons name="list" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'opacity-100' : 'opacity-50'}
            >
              <Ionicons name="grid" size={14} color="#000" />
            </TouchableOpacity>
          </View>
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
            keyExtractor={(item) => item.ourServiceId.toString()}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NotFound title={'services'} />}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
