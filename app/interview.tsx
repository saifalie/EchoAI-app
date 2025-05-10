// app/(tabs)/QuestionsScreen.tsx
import apiRequest from '@/services/apiServices';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function QuestionsScreen() {
  const router = useRouter();
  const {
    questions,
    company,
    role,
    questionType

  } = useLocalSearchParams();

  const parsedQuestions = JSON.parse(Array.isArray(questions) ? questions[0] : questions);



//   const questions: string[] = [
//     'Tell me about yourself.',
//     'Why do you want to work here?',
//     'What is your greatest strength?',
//     'Describe a challenge you overcame.',
//     'Where do you see yourself in five years?'
//   ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [subtitlesVisible, setSubtitlesVisible] = useState(true);
  const [isLoading,setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        // Configure audio mode for speaker output with microphone off
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true
        });

        // Configure speech options for speaker output
        Speech.speak(parsedQuestions[currentIndex], { rate: 0.9 });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    })();
  }, [currentIndex]);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Please grant microphone access to record audio.');
        return;
      }

      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        // staysActiveInBackground: true  // Add this to ensure recording continues in background
      });

      console.log('Creating new recording...');
      const recording = new Audio.Recording();
      
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,  // Changed to 1 channel for better compatibility
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.IOSAudioQuality.MAX,  // Changed to MAX quality
          sampleRate: 44100,
          numberOfChannels: 1,  // Changed to 1 channel for better compatibility
          bitRate: 128000,
          linearPCMBitDepth: 16,  // Added bit depth
          linearPCMIsBigEndian: false,  // Added endianness
          linearPCMIsFloat: false,  // Added float format specification
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      console.log('Starting recording...');
      await recording.startAsync();
      
      setRecordingInstance(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      if (!recordingInstance) return;

      // Make sure recording is actually recording before stopping
      const status = await recordingInstance.getStatusAsync();
      if (!status.isRecording) {
        console.log('Recording was not active');
        return;
      }

      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      console.log('Recording stopped, URI:', uri);
      
      // Verify the recording exists and has content
      const info = await FileSystem.getInfoAsync(uri!, { size: true });
      console.log('Recording file info:', info);
      
      if (!info.exists || (info.size ?? 0) === 0) {
        console.error('Recording file is empty or does not exist');
        Alert.alert('Recording Error', 'Failed to save recording. Please try again.');
        return;
      }

      if (uri) {
        setRecordings((prev) => [...prev, uri]);
      }
      
      setRecordingInstance(null);
      setIsRecording(false);

      // Switch back to speaker-only playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false
      });

      // Advance to next question or submit
      if(currentIndex < parsedQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        submitAll();
      }
   
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Recording Error', 'Failed to stop recording.');
    }
  };


  const submitAll = async () => {
    console.log('Validating recording file sizes…');
  
    // 1. Inspect on‑disk size for each URI
    for (let i = 0; i < recordings.length; i++) {
      const uri = recordings[i];
      const info = await FileSystem.getInfoAsync(uri, { size: true });
      console.log(`Recording ${i+1}: exists=${info.exists}, size=${(info as any).size ?? 0} bytes`);
      if (!info.exists || (info.size ?? 0) === 0) {
        Alert.alert(
          'Empty Recording',
          `Recording #${i+1} is empty (${(info as any).size ?? 0} bytes). Please retry.`
        );
        return;
      }
    }
  
    console.log('All recordings valid—building FormData…');
  
    const formData = new FormData();
    formData.append('questions', JSON.stringify(parsedQuestions));
    recordings.forEach((uri, i) => {
      formData.append('answers', {
        uri,
        name: `answer_${i}.m4a`,
        type: 'audio/m4a',
      } as any);
    });
  
    try {
      setIsLoading(true);
      const result: any = await apiRequest({
        method: 'post',
        url: '/interview/submit',
        data: formData,
      });
      console.log('Server response:', result);
      
      // The response structure is different from what we expected
      // Let's handle the actual response format
      if (!result || !result.questionCount || !result.reviews) {
        throw new Error('Invalid server response format');
      }

      // Get reviews from the correct path in response
      const reviewData = {
        reviews: result.reviews,
        questionCount: result.questionCount,
        transcriptCount: result.questionCount, // Using questionCount as transcriptCount
        reviewId: result.reviewId
      };
      console.log('reviewData', reviewData);

      router.replace({
        pathname: '/review',
        params: {
          data: JSON.stringify(reviewData),
          company,
          role,
        },
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      Alert.alert(
        'Upload Failed', 
        'Failed to process interview. Please try again. ' + (err.message || 'Unknown error')
      );
    } finally {
      setIsLoading(false);
    }
  };
  




  const toggleQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  const toggleSubtitles = () => {
    setSubtitlesVisible(!subtitlesVisible);
  };

  const goToQuestion = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setShowQuestions(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MOCK INTERVIEW</Text>
        
        {/* Subtitles Toggle Button */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.subtitlesButton, subtitlesVisible && styles.activeButton]}
            onPress={toggleSubtitles}
          >
            <MaterialIcons name="subtitles" size={18} color="white" />
            <Text style={styles.subtitlesText}>Subtitles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
        //   onPress={() => router.back()} 
          style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/images/woman.png')} 
            style={styles.avatar}
            defaultSource={require('../assets/images/woman.png')}
          />
        </View>

        {/* Question Subtitles */}
        {subtitlesVisible && (
          <View style={styles.subtitlesContainer}>
            <Text style={styles.subtitlesText}>{parsedQuestions[currentIndex]}</Text>
          </View>
        )}

        {/* Recording Button */}
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Tap to Stop' : 'Tap to Start'}
          </Text>
          <Ionicons
            name={isRecording ? 'stop-circle' : 'mic'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Questions Panel */}
      <View style={styles.questionsPanel}>
        <TouchableOpacity 
          style={styles.questionsPanelHeader}
          onPress={toggleQuestions}
        >
          <Text style={styles.questionsPanelTitle}>View Questions</Text>
          <MaterialIcons 
            name={showQuestions ? "keyboard-arrow-down" : "keyboard-arrow-up"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        {showQuestions && (
          <ScrollView style={styles.questionsList}>
            {parsedQuestions.map((question:any, index:number) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.questionItem, 
                  currentIndex === index && styles.activeQuestionItem
                ]}
                onPress={() => goToQuestion(index)}
              >
                <Text 
                  style={[
                    styles.questionItemText,
                    currentIndex === index && styles.activeQuestionItemText
                  ]}
                >
                  {question}
                </Text>
                {recordings[index] && (
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  subtitlesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: '#555',
  },
  subtitlesText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  subtitlesContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    maxWidth: '90%',
  },
  recordButton: {
    backgroundColor: '#FF5252',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    minWidth: 150,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
  },
  questionsPanel: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  questionsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  questionsPanelTitle: {
    color: 'white',
    fontWeight: '600',
  },
  questionsList: {
    maxHeight: 200,
  },
  questionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  activeQuestionItem: {
    backgroundColor: '#333',
  },
  questionItemText: {
    color: '#CCC',
    flex: 1,
    paddingRight: 8,
  },
  activeQuestionItemText: {
    color: 'white',
    fontWeight: '500',
  },
});