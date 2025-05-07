import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const login = () => {

    const router = useRouter();
  
    const handleLogin = () => {
     
      router.replace('/(tabs)');
    };
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
}


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
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
})

export default login