import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className='flex-1 p-5'>



                <View className="flex-row justify-between items-center py-5 mb-2 border-gray-100 border-b">
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                            className="w-10 h-10 rounded-full"
                        />
                    </TouchableOpacity>

                    <View className="flex-row">
                        <TouchableOpacity className="mr-4">
                            <Ionicons name="heart" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="search" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                </View>


                <View className=" py-2">
                    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                        <TextInput
                            placeholder="What are you looking for......"
                            className="flex-1 text-gray-700"
                        />
                        <Ionicons name="search" size={20} color="#007AFF" />
                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} className="flex-1">

                    <View className=" my-3 bg-blue-100 rounded-xl overflow-hidden">
                        <View className="flex-row justify-between p-4">
                            <View className="w-1/2">
                                <Text className="text-blue-800 font-medium">New Year Offer</Text>
                                <Text className="text-blue-800 text-3xl font-bold">30% OFF</Text>
                                <Text className="text-blue-800 mb-2">16-31 Dec</Text>

                                <TouchableOpacity className="bg-blue-500 rounded-full px-4 py-1 self-start">
                                    <Text className="text-white font-medium">Get Now</Text>
                                </TouchableOpacity>
                            </View>

                            <Image
                                source={{ uri: 'https://via.placeholder.com/150' }}
                                className="w-36 h-24"
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Pagination Dots */}
                    <View className="flex-row justify-center my-2">
                        <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
                        <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
                        <View className="h-2 w-2 rounded-full bg-blue-500 mx-1" />
                        <View className="h-2 w-2 rounded-full bg-gray-300 mx-1" />
                    </View>

                    {/* Categories */}
                    <View className=" py-2">
                        <Text className="text-black font-bold text-lg mb-3">Product By Category</Text>

                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                className="border border-gray-300 rounded-lg py-2 px-4 flex-row items-center w-[30%] justify-center"
                                onPress={() => router.push('/shop')}
                            >
                                <Ionicons name="cart" size={20} color="#007AFF" style={{ marginRight: 6 }} />
                                <Text className="text-blue-500 font-medium">Rent</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="border border-gray-300 rounded-lg py-2 px-4 flex-row items-center w-[30%] justify-center"
                                onPress={() => router.push('/shop')}
                            >
                                <Ionicons name="pricetag" size={20} color="#007AFF" style={{ marginRight: 6 }} />
                                <Text className="text-blue-500 font-medium">Sell</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="border border-gray-300 rounded-lg py-2 px-4 flex-row items-center w-[30%] justify-center"
                                onPress={() => router.push('/service')}
                            >
                                <Ionicons name="construct" size={20} color="#007AFF" style={{ marginRight: 6 }} />
                                <Text className="text-blue-500 font-medium">Service</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className=" py-2 mb-20">
                        <Text className="text-black font-bold text-lg mb-3">Top Products</Text>

                        <View className="flex-row flex-wrap justify-between">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    className="bg-white rounded-lg overflow-hidden w-[31%] mb-3 border border-gray-200"
                                    onPress={() => router.push('/shop')}
                                >
                                    <Image
                                        source={{ uri: 'https://via.placeholder.com/100' }}
                                        className="w-full h-24"
                                        resizeMode="cover"
                                    />
                                    <View className="p-2">
                                        <Text className="text-blue-500 text-xs">Service - 1</Text>
                                        <Text className="text-gray-500 text-xs" numberOfLines={2}>
                                            Description Description Description
                                        </Text>
                                        <Text className="font-bold mt-1">AED 56</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>


        </SafeAreaView >
    );
}
