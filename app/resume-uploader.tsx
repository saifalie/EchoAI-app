// app/(tabs)/resume-uploader.tsx
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResumeUploaderScreen() {
  const router = useRouter();
  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access gallery was denied.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) setResumeUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access camera was denied.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) setResumeUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const uploadResume = async () => {
    if (!resumeUri) {
      Alert.alert('No Resume', 'Please select or capture a resume first');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1500));
      Alert.alert('Success', 'Resume uploaded successfully');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resume Upload</Text>

      <View style={styles.resumeContainer}>
        {resumeUri ? (
          <Image source={{ uri: resumeUri }} style={styles.resumePreview} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholderText}>No resume selected</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery} disabled={isLoading}>
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto} disabled={isLoading}>
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, !resumeUri && styles.disabledButton]}
        onPress={uploadResume}
        disabled={!resumeUri || isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadText}>Upload Resume</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#FFFBF5', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: '#222' },
  resumeContainer: { height: 260, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 3 },
  resumePreview: { width: '100%', height: '100%', borderRadius: 16 },
  placeholderText: { color: '#AAA', fontSize: 18 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  galleryButton: { flex: 1, backgroundColor: '#7AB6FF', paddingVertical: 14, borderRadius: 12, marginRight: 10, alignItems: 'center' },
  cameraButton: { flex: 1, backgroundColor: '#FFAB91', paddingVertical: 14, borderRadius: 12, marginLeft: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  uploadButton: { backgroundColor: '#7E57C2', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  uploadText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  disabledButton: { backgroundColor: '#CCC' },
});