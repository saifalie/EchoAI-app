// app/(auth)/SplashScreen.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import apiRequest from '../services/apiServices';
import { useUserStore } from '../store/userStore';

const SplashScreen = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const init = async () => {
      // 1. Do we even have a userId?
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        // not logged in → go to login
        return router.replace('/login');
      }

      try {
        // 2. Fetch the user data
        const response:any = await apiRequest<null, { id: string; name: string; email: string }>({
          method: 'get',
          url: '/auth/me',
        });

        console.log('response:',response);
        const user =  response.data
        
        // 3. Put into our Zustand store
        setUser(user);

        // 4. Great — send them into the app
        router.replace('/(tabs)');
      } catch (err) {
        console.error('Failed to load user on splash:', err);
        // if token invalid / user not found, clear storage & go to login
        await AsyncStorage.removeItem('userId');
        router.replace('/login');
      }
    };

    // small delay so the splash spinner actually shows
    const timer = setTimeout(init, 1_000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Loading…</Text>
    </View>
  );
};

export default SplashScreen;
