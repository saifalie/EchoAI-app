import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import apiRequest from '../services/apiServices'; // adjust path
import { useUserStore } from '../store/userStore';

export default function ResumeUploaderScreen() {
  const router = useRouter();
  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore(s => s.setUser);

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow gallery access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setResumeUri(result.assets[0].uri);
  };

  const uploadResume = async () => {
    if (!resumeUri) {
      Alert.alert('No Resume', 'Please select or capture a resume first.');
      return;
    }
    setIsLoading(true);
  
    try {
      // Create a FormData object
      const form = new FormData();
      
      // Add file to form data - simplest approach for React Native
      form.append('resume', {
        uri: resumeUri,
        name: `resume_${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);
  
      // Post to your API with correct headers
      const response = await apiRequest<FormData, {
        imageUrl: string;
        extractedText: string;
        overallSummary: string;
        technicalDetails: string;
        recommendations: string;
      }>({
        method: 'post',
        url: '/resume',
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update user, navigate, etc.
      const me = await apiRequest<null, any>({ method: 'get', url: '/auth/me' });
      setUser(me.data);
      Alert.alert('Success', 'Resume uploaded and analyzed!');
      router.replace('/(tabs)');
  
    } catch (err: any) {
      console.error('Upload failed', err);
      Alert.alert('Error', err.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Resume</Text>

      <View style={styles.resumeContainer}>
        {resumeUri ? (
          <Image source={{ uri: resumeUri }} style={styles.resumePreview} />
        ) : (
          <Text style={styles.placeholderText}>No resume selected</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={pickFromGallery} disabled={isLoading}>
        <Text style={styles.buttonText}>Choose From Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, !resumeUri && styles.disabledButton]}
        onPress={uploadResume}
        disabled={!resumeUri || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Resume</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:24, justifyContent:'center', backgroundColor:'#FFFBF5' },
  title:     { fontSize:26, fontWeight:'700', marginBottom:20, textAlign:'center' },
  resumeContainer: {
    height:260,
    backgroundColor:'#FFF',
    borderRadius:16,
    borderWidth:1,
    borderColor:'#E0E0E0',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
  },
  resumePreview:   { width:'100%', height:'100%', borderRadius:16 },
  placeholderText: { color:'#AAA', fontSize:18 },
  button:          { backgroundColor:'#7AB6FF', padding:14, borderRadius:12, marginBottom:12, alignItems:'center' },
  uploadButton:    { backgroundColor:'#7E57C2', padding:14, borderRadius:12, alignItems:'center' },
  disabledButton:  { backgroundColor:'#CCC' },
  buttonText:      { color:'#fff', fontSize:16, fontWeight:'600' },
});