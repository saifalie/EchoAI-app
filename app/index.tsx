import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const SplashScreen = () => {
    const router = useRouter();
    useEffect(()=>{

      const timer  = setTimeout(()=>{
        router.replace('/login')
      },2000)
        return () => clearTimeout(timer)

    },[])
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  )
}

export default SplashScreen