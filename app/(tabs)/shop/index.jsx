import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function ShopScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Shop Products</Text>
      
      <Link href="/shop/product1" asChild>
        <Pressable style={{ padding: 15, backgroundColor: '#eee', marginBottom: 10 }}>
          <Text>Product 1</Text>
        </Pressable>
      </Link>
      
      <Link href="/shop/product2" asChild>
        <Pressable style={{ padding: 15, backgroundColor: '#eee' }}>
          <Text>Product 2</Text>
        </Pressable>
      </Link>
    </View>
  );
}