import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Alert, Platform } from 'react-native';

const StripeWrapper = ({ children }) => {
  useEffect(() => {
    const initStripe = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { initPaymentSheet } = await import('@stripe/stripe-react-native');
          await initPaymentSheet({
            merchantIdentifier: 'merchant.com.xyaistic.rentroApp',
          });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to initialize Stripe',error);
      }
    };

    initStripe();
  }, []);

  return (
    <StripeProvider
      publishableKey={'pk_test_51RLOsxP9oSOUDJBLqZRCqPycQ0pD06U65h5e6oDLNOdao4GGbWAsd2s8A0Mfb4Hs5Ty1lENR0VgaF0UrsJPTjizn00WMqTFFDP'}
      merchantIdentifier="merchant.com.xyaistic.rentroApp"
    >
      {children}
    </StripeProvider>
  );
};

export default StripeWrapper;
