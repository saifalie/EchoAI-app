
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const initialCompanies = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Facebook', 'Tesla'];
const moreCompanies = ['Netflix', 'Adobe', 'Airbnb', 'Spotify', 'Uber'];
const initialRoles = ['Frontend Engineer', 'Backend Engineer', 'Data Scientist', 'Product Manager', 'UX Designer'];
const moreRoles = ['DevOps Engineer', 'AI Researcher', 'Security Analyst', 'QA Engineer', 'Solutions Architect'];
const questionTypes = [
  'Technical',
  'HR',
  'Behavioral',
  'System Design',
  'Managerial',
  'Situational',
  'Coding Round (Speech)',
  'Introduction',
  'Strengths & Weaknesses'
];

// Define types for the topics structure
type SubTopics = {
  [key: string]: string[];
};

type Topics = {
  [key: string]: {
    [key: string]: string[];
  };
};

const topics: Topics = {
  'Technical': {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'Go'],
    'Web Development': ['React', 'Angular', 'Vue', 'Node.js', 'Express'],
    'Database': ['SQL', 'MongoDB', 'Redis', 'PostgreSQL'],
    'System Design': ['Architecture', 'Scalability', 'Microservices'],
    'Data Structures': ['Arrays', 'Linked Lists', 'Trees', 'Graphs'],
    'Algorithms': ['Sorting', 'Searching', 'Dynamic Programming']
  },
  'Non-Technical': {
    'Behavioral': ['Leadership', 'Teamwork', 'Conflict Resolution', 'Problem Solving'],
    'HR': ['Career Goals', 'Company Knowledge', 'Salary Discussion', 'Work Experience'],
    'Situational': ['Project Challenges', 'Time Management', 'Decision Making'],
    'Introduction': ['Self Introduction', 'Background', 'Achievements']
  }
};

const difficultyLevels = ['Easy', 'Moderate', 'Hard'] as const;
type DifficultyLevel = typeof difficultyLevels[number];

export default function SelectionScreen() {
  const router = useRouter();
  const [selectedMainTopic, setSelectedMainTopic] = useState<keyof Topics | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
  const [selectedSpecific, setSelectedSpecific] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const onProceed = () => {
    if (selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty) {
      router.replace({
        pathname: '/questions-preparing',
        params: {
          mainTopic: selectedMainTopic,
          subTopic: selectedSubTopic,
          specific: selectedSpecific,
          difficulty: selectedDifficulty
        }
      });
    }
  };

  const resetSelections = (level: 'main' | 'sub' | 'specific' | 'none') => {
    if (level === 'main') {
      setSelectedSubTopic(null);
      setSelectedSpecific(null);
    } else if (level === 'sub') {
      setSelectedSpecific(null);
    }
    setSelectedDifficulty(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose Interview Topic</Text>

        {/* Main Topics */}
        <Text style={styles.subtitle}>Select Category</Text>
        <View style={styles.bubbleContainer}>
          {Object.keys(topics).map((topic) => {
            const selected = topic === selectedMainTopic;
            return (
              <TouchableOpacity
                key={topic}
                style={[styles.bubble, selected && styles.bubbleSelected]}
                onPress={() => {
                  setSelectedMainTopic(selected ? null : topic);
                  resetSelections('main');
                }}
              >
                <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                  {topic}
                </Text>
                {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sub Topics */}
        {selectedMainTopic && (
          <>
            <Text style={styles.subtitle}>Select Topic</Text>
            <View style={styles.bubbleContainer}>
              {Object.keys(topics[selectedMainTopic]).map((subTopic) => {
                const selected = subTopic === selectedSubTopic;
                return (
                  <TouchableOpacity
                    key={subTopic}
                    style={[styles.bubble, selected && styles.bubbleSelected]}
                    onPress={() => {
                      setSelectedSubTopic(selected ? null : subTopic);
                      resetSelections('sub');
                    }}
                  >
                    <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                      {subTopic}
                    </Text>
                    {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Specific Topics */}
        {selectedMainTopic && selectedSubTopic && (
          <>
            <Text style={styles.subtitle}>Select Specific Area</Text>
            <View style={styles.bubbleContainer}>
              {topics[selectedMainTopic][selectedSubTopic].map((specific) => {
                const selected = specific === selectedSpecific;
                return (
                  <TouchableOpacity
                    key={specific}
                    style={[styles.bubble, selected && styles.bubbleSelected]}
                    onPress={() => {
                      setSelectedSpecific(selected ? null : specific);
                      setSelectedDifficulty(null);
                    }}
                  >
                    <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                      {specific}
                    </Text>
                    {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Difficulty Level */}
        {selectedSpecific && (
          <>
            <Text style={styles.subtitle}>Select Difficulty</Text>
            <View style={styles.bubbleContainer}>
              {difficultyLevels.map((level) => {
                const selected = level === selectedDifficulty;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.bubble, selected && styles.bubbleSelected]}
                    onPress={() => setSelectedDifficulty(selected ? null : level)}
                  >
                    <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                      {level}
                    </Text>
                    {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !(selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty) && 
            styles.nextDisabled
          ]}
          disabled={!(selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty)}
          onPress={onProceed}
        >
          <Text style={styles.nextText}>Start Interview</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#333' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, color: '#555' },
  bubbleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  bubbleSelected: { backgroundColor: '#6C63FF' },
  bubbleText: { fontSize: 14, color: '#333', textAlign: 'center' },
  bubbleTextSelected: { color: '#fff', fontWeight: '600' },
  checkIcon: { marginLeft: 6 },
  moreButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    margin: 4,
  },
  moreText: { color: '#555', fontWeight: '600' },
  nextButton: {
    marginTop: 40,
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextDisabled: { backgroundColor: '#CCC' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});