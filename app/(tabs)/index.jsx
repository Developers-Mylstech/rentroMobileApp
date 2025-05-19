import { View, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

// Import components
import Header from '../../src/components/home/Header';
import SearchBar from '../../src/components/home/SearchBar';
import Banner from '../../src/components/home/Banner';
import CategorySection from '../../src/components/home/CategorySection';
import ProductGrid from '../../src/components/home/ProductGrid';
import BannerCarousel from '../../src/components/home/BannerCarousel';
import { useProductStore } from '../../src/context/ProductContext';

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { products, loading, error, fetchProducts } = useProductStore();

useEffect(()=>{
    fetchProducts()
},[]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className='flex-1 p-5'>
                <Header
                    onProfilePress={() => router.push('/profile')}
                    onHeartPress={() => console.log('Heart pressed')}
                    onSearchPress={() => setShowSearchBar(!showSearchBar)}
                />
                {
                    showSearchBar && (
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    )
                }


                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    <BannerCarousel />
                    <CategorySection
                        onCategoryPress={(route) => router.push(route)}
                    />

                    <ProductGrid
                        onProductPress={() => router.push('/shop')}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
