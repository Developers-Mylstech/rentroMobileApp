// src/components/StripeWrapper.js (or similar)
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

// Replace with your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RLOsxP9oSOUDJBLqZRCqPycQ0pD06U65h5e6oDLNOdao4GGbWAsd2s8A0Mfb4Hs5Ty1lENR0VgaF0UrsJPTjizn00WMqTFFDP';

const StripeWrapper = ({ children }) => {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      // urlScheme="your-app-scheme" // Required for 3D Secure on iOS sometimes
      // merchantIdentifier="merchant.com.your_app_name" // Required for Apple Pay
    >
      {children}
    </StripeProvider>
  );
};

export default StripeWrapper;