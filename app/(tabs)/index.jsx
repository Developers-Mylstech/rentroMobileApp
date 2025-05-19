import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

// Import components
import Header from '../../src/components/home/Header';
import SearchBar from '../../src/components/home/SearchBar';
import CategorySection from '../../src/components/home/CategorySection';
import ProductGrid from '../../src/components/home/ProductGrid';
import BannerCarousel from '../../src/components/home/BannerCarousel';
import { useProductStore } from '../../src/context/ProductStore';
import { useBannerStore } from '../../src/context/Banner';
import ProductSkeleton from '../../src/components/Skeleton/ProductSkeleton';
import BannerCarouselSkeleton from '../../src/components/Skeleton/BannerCarouselSkeleton';

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const { fetchProducts, products, isLoading, error } = useProductStore();
    const { fetchBanners, banners, isLoading: bannerLoading } = useBannerStore();

    useEffect(() => {
        fetchProducts();
        fetchBanners()
    }, []);

    const handleProductPress = (productId) => {
        router.push(`/product/${productId}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 p-5">
                <Header
                    onProfilePress={() => router.push('/profile')}
                    onHeartPress={() => console.log('Heart pressed')}
                    onSearchPress={() => setShowSearchBar(!showSearchBar)}
                />

                {showSearchBar && (
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                )}

                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    className="flex-1"
                >
                    {
                        bannerLoading ? (
                            <BannerCarouselSkeleton />
                        ) : (
                            <BannerCarousel banners={banners} />
                        )
                    }
                    <CategorySection
                        onCategoryPress={(route) => router.push(route)}
                    />

                    {isLoading ? (
                        <ProductSkeleton />
                    ) : error ? (
                        <View className="flex-1 items-center justify-center mt-4">
                            <Text>{error}</Text>
                        </View>
                    ) : (
                        <ProductGrid
                            title="Top Products"
                            products={products}
                            onProductPress={handleProductPress}
                        />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
