// src/components/StripeWrapper.js (or similar)
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

// Replace with your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

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