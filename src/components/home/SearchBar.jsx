import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useProductStore } from '../../store/productStore';
import debounce from 'lodash.debounce';
import { Platform } from 'react-native';

export default function SearchBar({
  value = "",
  onChangeText = () => { },
  placeholder = "What are you looking for...",
  onItemPress = () => { },
  renderItem = null
}) {
  const [filteredData, setFilteredData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { products, searchProductsApi, isLoading } = useProductStore();

  // Debounced API search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.trim() === '') {
        setFilteredData([]);
        setShowResults(false);
        setIsTyping(false);
        return;
      }

      try {
        const results = await searchProductsApi(searchTerm);
        setFilteredData(results);
        setShowResults(true);
      } catch (error) {
        console.error("Search API error:", error);
        // Fallback to local filtering if API fails
        const filtered = products.filter(item =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setShowResults(true);
      } finally {
        setIsTyping(false);
      }
    }, 500), 
    [searchProductsApi, products]
  );

  const handleTextChange = (text) => {
    onChangeText(text);
    
    if (text.trim() === '') {
      debouncedSearch.cancel();
      setFilteredData([]);
      setShowResults(false);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    debouncedSearch(text);
  };

  const handleSearch = async () => {
    if (value.trim() === '') {
      setFilteredData([]);
      setShowResults(false);
      return;
    }

    setIsTyping(true);
    try {
      const results = await searchProductsApi(value);
      setFilteredData(results);
      setShowResults(true);
    } catch (error) {
      console.error("Search API error:", error);
      const filtered = products.filter(item =>
        item.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setShowResults(true);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear results when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const defaultRenderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onItemPress(item);
        setShowResults(false);
      }}
      className={` ${Platform.OS === 'android' ? 'p-3' : 'p-3'} border-b flex-row gap-3 items-center border-gray-100`}
    >
      <Image
        source={{ uri: item.images?.[0]?.imageUrl || 'https://via.placeholder.com/100' }}
        className="w-10 h-10 rounded-md mr-3"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text numberOfLines={2} className="text-gray-800 font-medium ">{item.name}</Text>
        {item.price && (
          <Text className="text-gray-500 mt-1">${item.price.toFixed(2)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="py-2 relative">
      <View className={`flex-row items-center border border-gray-200 rounded-lg px-4   ${Platform.OS === 'android' ? 'py-1' : 'py-3'}`}>
        <TextInput
          value={value}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          placeholder={placeholder}
          className={`flex-1 text-gray-700  ${Platform.OS === 'android' ? 'p-3' : 'p-0'}`}
          returnKeyType="search"
          placeholderTextColor="#9CA3AF"
          clearButtonMode="while-editing"
          
        />
        <TouchableOpacity onPress={handleSearch} className="ml-2">
          <Ionicons name="search" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {(isLoading || isTyping) && (
        <View className="absolute shadow-black  top-16 left-0 right-0 border border-gray-200 rounded-lg bg-white p-4 shadow-md z-10">
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#007AFF" />
            <Text className="text-gray-500 ml-2">Searching...</Text>
          </View>
        </View>
      )}

      {showResults && filteredData.length > 0 && !isLoading && !isTyping && (
        <View className="absolute top-16 left-0 right-0 border border-gray-200 rounded-lg bg-white shadow-lg shadow-black z-10">
          <FlatList
            data={filteredData}
            renderItem={renderItem || defaultRenderItem}
            keyExtractor={(item, index) => item.productId?.toString() || index.toString()}
            className="max-h-60"
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View className="p-2 border-b border-gray-100">
                <Text className="font-medium text-gray-500">
                  {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
                </Text>
              </View>
            }
          />
        </View>
      )}
      {showResults && filteredData.length === 0 && value.trim() !== '' && !isLoading && !isTyping && (
        <View className="absolute top-16 left-0 right-0 border border-gray-200 rounded-lg bg-white p-4 shadow-sm z-10">
          <Text className="text-gray-500 text-center">No products found for "{value}"</Text>
        </View>
      )}
    </View>
  );
}
