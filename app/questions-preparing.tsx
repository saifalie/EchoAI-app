// app/(tabs)/PreparingScreen.tsx
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import apiRequest from '../services/apiServices';

export const options = {
  headerBackVisible: false,
  gestureEnabled: false,
};

export default function PreparingScreen() {
  const router = useRouter();
  const { company, role, questionType } = useLocalSearchParams();

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
        const payload = { company, role, questionType };
        const data = await apiRequest<any, any>({
          method: 'post',
          url: '/interview/questions',
          data: payload,
        });

        console.log('questions-data',data);
        
        router.replace({
          pathname: '/interview',
          params: {
            questions: JSON.stringify(data.questions),
            company,
            role,
            questionType
          },
        });
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [company, role, questionType, router]);

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