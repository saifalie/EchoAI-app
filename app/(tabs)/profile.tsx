import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserStore } from '../../store/userStore';

const ProfileScreen= () => {
    const router = useRouter()
    const logout = async () =>{
        useUserStore.getState().clearUser()
        await AsyncStorage.removeItem('userId')
        router.replace('/login')
    }
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Profile Screen</Text>
          <Text style={styles.subtitle}>Your profile information will go here.</Text>
          <TouchableOpacity onPress={logout}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 18,
        color: '#666',
      },
    });

export default ProfileScreen
