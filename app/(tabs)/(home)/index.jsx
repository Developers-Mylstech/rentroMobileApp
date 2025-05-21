import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

// Import components
import Header from '../../../src/components/home/Header';
import SearchBar from '../../../src/components/home/SearchBar';
import CategorySection from '../../../src/components/home/CategorySection';
import ProductGrid from '../../../src/components/home/ProductGrid';
import BannerCarousel from '../../../src/components/home/BannerCarousel';

import ProductSkeleton from '../../../src/components/Skeleton/ProductSkeleton';
import BannerCarouselSkeleton from '../../../src/components/Skeleton/BannerCarouselSkeleton';
import { useProductStore } from '../../../src/store/productStore';
import { useBannerStore } from '../../../src/store/BannerStore';
import SplashScreen from '../../../src/components/widget/SplashScreen';

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

    const handleProductPress = (product) => {
        router.push({
            pathname: `/shop/product/${product.productId}`,
            params: { from: 'home' }
        });
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
                            banners.length > 0 ? (
                                <BannerCarousel banners={banners} />
                            ) : (
                                <View className="bg-gray-200 h-40 rounded-lg p-4 flex justify-center items-center">
                                    <Text>No Banners</Text>
                                </View>
                            )
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
                        products.length > 0 ? (
                            <ProductGrid
                                title="Top Products"
                                products={products}
                                onProductPress={handleProductPress}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center mt-4">
                                <Text>No Products</Text>
                            </View>
                        )
                        
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
        
    );
}
