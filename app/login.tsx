import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import apiRequest from '../services/apiServices';
import { useUserStore } from '../store/userStore';

const Login: React.FC = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response: any = await apiRequest({
        method: 'post',
        url: '/auth/login',
        data: { email, password },
      });

      const userPayload = response.data;
      console.log('userPayload', userPayload);

      await AsyncStorage.setItem('userId', userPayload._id);
      setUser(userPayload);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('login failed error', error);
      const msg = error?.response?.data?.message || 'Login failed';
      Alert.alert('Error', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    color: '#000',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
