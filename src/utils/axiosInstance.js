

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from 'expo-router';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL: apiUrl,
});

axiosInstance.defaults.headers.common['skip_zrok_interstitial'] = 'true';

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('auth_token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error: ", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 500 && 
            originalRequest.url?.includes('/auth/logout')) {
            await SecureStore.deleteItemAsync('auth_token');
            await SecureStore.deleteItemAsync('refresh_token');
            useAuthStore.getState().signOut();
            return Promise.reject(error);
        }


        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (refreshToken) {
                try {
                    delete axiosInstance.defaults.headers.common['Authorization'];

                    const response = await axios.post(`${apiUrl}/auth/refresh-token`,
                        { refreshToken: refreshToken }, {
                        headers: {
                            'skip_zrok_interstitial': 'true',
                        },
                    });

                    const newAccessToken = response.data?.accessToken;
                    if (newAccessToken) {
                        await SecureStore.setItemAsync('auth_token', newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    Alert.alert("Session Expired", "Please log in again.");
                    await SecureStore.deleteItemAsync('auth_token');
                    await SecureStore.deleteItemAsync('refresh_token');
                    useAuthStore.getState().signOut();
                    
                    setTimeout(() => {
                        const { router } = require('expo-router');
                        router.replace('/(tabs)/(profile)');
                    }, 100);

                    return Promise.reject(refreshError);
                }
                
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
