// src/components/StripeWrapper.js (or similar)
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

const StripeWrapper = ({ children }) => {
  return (
    <StripeProvider
      publishableKey={'pk_test_51RLOsxP9oSOUDJBLqZRCqPycQ0pD06U65h5e6oDLNOdao4GGbWAsd2s8A0Mfb4Hs5Ty1lENR0VgaF0UrsJPTjizn00WMqTFFDP'}
    >
      {children}
    </StripeProvider>
  );
};

export default StripeWrapper;