import { Platform } from 'react-native';

export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    (Platform.OS === 'android' ? 'https://greenleafmobile.onrender.com' : 'http://localhost:3000');