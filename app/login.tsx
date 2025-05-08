// app/login.tsx
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
import useUserStore from '../store/userStore';

const Login: React.FC = () => {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data: any = await apiRequest({
        method: 'post',
        url: '/auth/login',
        data: { username, email, password },
      });

      await AsyncStorage.setItem('userId', data._id);
      login(data);
      router.replace('/(tabs)');
    } catch (error: any) {
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
          placeholder="Username"
          placeholderTextColor="#888"              // lighter gray placeholder
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

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
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center',
  },
  form: { width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',  // ensure light bg
    color: '#000',            // explicitly set text color :contentReference[oaicite:0]{index=0}
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
