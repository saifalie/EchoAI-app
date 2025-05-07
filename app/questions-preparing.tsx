// app/(tabs)/PreparingScreen.tsx
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

// Disable back gesture and hide back button
export const options = {
  headerBackVisible: false,
  gestureEnabled: false,
};

export default function PreparingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { company, role, questionType } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const navigation = useNavigation();
useEffect(() => {
  navigation.setOptions({
    headerShown: false,
    headerBackVisible: false,
    gestureEnabled: false,
  });
}, [navigation]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // const payload = { company, role, questionType };
        // const response = await fetch('https://your-api.example.com/questions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // });
        // if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // const data = await response.json();

        // Replace this screen in history so user cannot go back
        // router.replace({
        //   pathname: '/interview',
        //   params: { questions: JSON.stringify(data), company, role, questionType },

        setTimeout(() => {
            router.replace({
                pathname: '/interview',
                params: {  company, role, questionType },
              });
        }, 3000);
       
        // });
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../assets/animations/searching.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.message}>Preparing your questions…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.error}>Failed to load questions: {error}</Text>
      <Button title="Try Again" onPress={() => {
        setError(null);
        setLoading(true);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
