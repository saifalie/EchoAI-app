import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ReviewScreen = () => {
  const { data } = useLocalSearchParams();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const parsedData = JSON.parse(Array.isArray(data) ? data[0] : data);
  const reviews = parsedData.reviews;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Remove rating calculation since it's not in the response
  const getSentiment = () => {
    return { 
      emoji: "🎯 💡 📝", 
      label: "Interview Complete" 
    };
  };
  
  const sentiment = getSentiment();

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
    }
  };

  const playAudio = async (audioUrl: string, index: number) => {

    try {
      setIsLoading(true);
      // Stop any currently playing audio
      await stopSound();

      // Load and play the new audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingIndex(index);

      // Handle audio finish
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await stopSound();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async (audioUrl: string, index: number) => {
    if (isPlaying && currentPlayingIndex === index) {
      await stopSound();
    } else {
      await playAudio(audioUrl, index);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.fixedHeader}>
        <Text style={styles.headerText}>Interview Result 📊</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.row}>
          <View style={[styles.card, styles.scoreCard]}>
            <Text style={styles.cardTitle}>Overall Score</Text>
            <Text style={styles.scoreValue}>75/100</Text>
            <Text style={styles.scoreLabel}>Excellent</Text>
          </View>
          <View style={[styles.card, styles.sentimentCard]}>
            <Text style={styles.cardTitle}>Overall Sentiment</Text>
            <Text style={styles.emojiRow}>😊 😐 🤔 💪</Text>
            <Text style={styles.scoreLabel}>OK</Text>
          </View>
        </View> */}

        {/* Strengths Section */}
        <View style={[styles.sectionBox, styles.sectionBoxSuccess]}>
          <Text style={styles.sectionTitle}>Areas of Strength</Text>
          {reviews.map((review: any, index: number) => (
            <View key={`strength-${index}`} style={styles.bulletRow}>
              <MaterialIcons name="check-circle" size={20} color="#15803d" />
              <Text style={styles.bulletText}>{review.feedback.split('.')[0]}.</Text>
            </View>
          ))}
        </View>

        {/* Improvements Section */}
        <View style={[styles.sectionBox, styles.sectionBoxWarning]}>
          <Text style={styles.sectionTitle}>Areas to Improve</Text>
          {reviews.map((review: any, index: number) => (
            <View key={`improvement-${index}`} style={styles.bulletRow}>
              <MaterialIcons name="error-outline" size={20} color="#dc2626" />
              <Text style={styles.bulletText}>{review.idealAnswer.split('.')[0]}.</Text>
            </View>
          ))}
        </View>

        {/* Suggestions Section */}
        <View style={[styles.sectionBox, styles.sectionBoxPrimary]}>
          <Text style={styles.sectionTitle}>Suggested Resources</Text>
          <TouchableOpacity 
            style={styles.resourceLink}
            onPress={() => Linking.openURL('https://www.coursera.org/learn/technical-communication')}
          >
            <MaterialIcons name="school" size={20} color="#0369a1" />
            <Text style={styles.resourceText}>Practice Technical Communication</Text>
          </TouchableOpacity>
        </View>

        {/* Questions with Evaluation */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Questions with Evaluation</Text>
          {reviews.map((review: any, index: number) => (
            <View key={index} style={styles.questionBox}>
              <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionRow}>
                <Text style={styles.question}>Q{index + 1}. {review.question}</Text>
                <MaterialIcons
                  name={expandedIndex === index ? 'expand-less' : 'expand-more'}
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <View style={styles.answerBox}>
                  <View style={styles.audioPlayerContainer}>
                    <TouchableOpacity 
                      onPress={() => {
                        console.log('audioUrl: ', review.audio);
                        
                        togglePlayPause(review.audio, index)}}
                      style={styles.playButton}
                      disabled={isLoading || !review.audio}
                    >
                      {isLoading && currentPlayingIndex === index ? (
                        <ActivityIndicator color="#333" />
                      ) : (
                        <MaterialIcons
                          name={isPlaying && currentPlayingIndex === index ? 'pause' : 'play-arrow'}
                          size={24}
                          color="#333"
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.audioLabel}>
                      {review.audio ? 'Your Answer Recording' : 'No recording available'}
                    </Text>
                  </View>
                  
                  <Text style={styles.answerLabel}>Your Answer:</Text>
                  <Text style={styles.answerText}>{review.answer}</Text>
                  
                  <Text style={styles.answerLabel}>Feedback:</Text>
                  <Text style={styles.answerText}>{review.feedback}</Text>
                  
                  <Text style={styles.answerLabel}>Ideal Answer:</Text>
                  <Text style={styles.answerText}>{review.idealAnswer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff'
  },
  fixedHeader: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    padding: 16,
    paddingBottom: 40
  },
  sectionBoxPrimary: {
    backgroundColor: '#e0f0fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBoxSuccess: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBoxWarning: {
    backgroundColor: '#ffe2e2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBoxBlue: {
    backgroundColor: '#e0f0fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBoxGreen: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionBoxRed: {
    backgroundColor: '#ffe2e2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  // sectionBox: {
  //   backgroundColor: '#f3f4f6',
  //   borderRadius: 12,
  //   padding: 14,
  //   marginBottom: 16
  // },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 14,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4
  },
  scoreCard: {
    backgroundColor: '#fef3c7'
  },
  sentimentCard: {
    backgroundColor: '#e0f2fe'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600'
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  emojiRow: {
    fontSize: 18,
    marginVertical: 6
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  bulletText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    lineHeight: 18
  },
  questionBox: {
    marginBottom: 12
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  question: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    marginRight: 8
  },
  answerBox: {
    marginTop: 8
  },
  answerLabel: {
    fontWeight: '600',
    marginTop: 6,
    fontSize: 13,
    color: '#444'
  },
  answerText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#333'
  },
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  audioLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 4
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginTop: 8,
  },
  resourceText: {
    marginLeft: 12,
    color: '#0369a1',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default ReviewScreen;
