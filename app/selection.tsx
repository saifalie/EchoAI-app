
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
  const [mode, setMode] = useState<'topic' | 'company' | null>(null);
  const [selectedMainTopic, setSelectedMainTopic] = useState<keyof Topics | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
  const [selectedSpecific, setSelectedSpecific] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string | null>(null);

  const resetSelections = (level: 'all' | 'main' | 'sub' | 'specific' | 'none') => {
    if (level === 'all') {
      setSelectedMainTopic(null);
      setSelectedSubTopic(null);
      setSelectedSpecific(null);
      setSelectedDifficulty(null);
      setSelectedCompany(null);
      setSelectedRole(null);
      setSelectedQuestionType(null);
    } else if (level === 'main') {
      setSelectedSubTopic(null);
      setSelectedSpecific(null);
      setSelectedDifficulty(null);
    } else if (level === 'sub') {
      setSelectedSpecific(null);
      setSelectedDifficulty(null);
    }
  };

  const onProceed = () => {
    if (mode === 'topic' && selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty) {
      router.replace({
        pathname: '/questions-preparing',
        params: {
          mainTopic: selectedMainTopic,
          subTopic: selectedSubTopic,
          specific: selectedSpecific,
          difficulty: selectedDifficulty
        }
      });
    } else if (mode === 'company' && selectedCompany && selectedRole && selectedQuestionType) {
      router.replace({
        pathname: '/questions-preparing',
        params: {
          company: selectedCompany,
          role: selectedRole,
          questionType: selectedQuestionType
        }
      });
    }
  };

  const renderModeSelection = () => (
    <View style={styles.section}>
      <Text style={styles.subtitle}>Select Interview Type</Text>
      <View style={styles.bubbleContainer}>
        <TouchableOpacity
          style={[styles.bubble, mode === 'topic' && styles.bubbleSelected]}
          onPress={() => {
            setMode(mode === 'topic' ? null : 'topic');
            resetSelections('all');
          }}
        >
          <Text style={[styles.bubbleText, mode === 'topic' && styles.bubbleTextSelected]}>
            Topic Based
          </Text>
          {mode === 'topic' && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bubble, mode === 'company' && styles.bubbleSelected]}
          onPress={() => {
            setMode(mode === 'company' ? null : 'company');
            resetSelections('all');
          }}
        >
          <Text style={[styles.bubbleText, mode === 'company' && styles.bubbleTextSelected]}>
            Company Based
          </Text>
          {mode === 'company' && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Interview Preparation</Text>
        
        {renderModeSelection()}

        {mode === 'topic' ? (
          <>
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
          </>
        ) : mode === 'company' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.subtitle}>Select Company</Text>
              <View style={styles.bubbleContainer}>
                {initialCompanies.map((company) => (
                  <TouchableOpacity
                    key={company}
                    style={[styles.bubble, selectedCompany === company && styles.bubbleSelected]}
                    onPress={() => setSelectedCompany(selectedCompany === company ? null : company)}
                  >
                    <Text style={[styles.bubbleText, selectedCompany === company && styles.bubbleTextSelected]}>
                      {company}
                    </Text>
                    {selectedCompany === company && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedCompany && (
              <View style={styles.section}>
                <Text style={styles.subtitle}>Select Role</Text>
                <View style={styles.bubbleContainer}>
                  {initialRoles.map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[styles.bubble, selectedRole === role && styles.bubbleSelected]}
                      onPress={() => setSelectedRole(selectedRole === role ? null : role)}
                    >
                      <Text style={[styles.bubbleText, selectedRole === role && styles.bubbleTextSelected]}>
                        {role}
                      </Text>
                      {selectedRole === role && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {selectedRole && (
              <View style={styles.section}>
                <Text style={styles.subtitle}>Select Question Type</Text>
                <View style={styles.bubbleContainer}>
                  {questionTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.bubble, selectedQuestionType === type && styles.bubbleSelected]}
                      onPress={() => setSelectedQuestionType(selectedQuestionType === type ? null : type)}
                    >
                      <Text style={[styles.bubbleText, selectedQuestionType === type && styles.bubbleTextSelected]}>
                        {type}
                      </Text>
                      {selectedQuestionType === type && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : null}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !((mode === 'topic' && selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty) ||
              (mode === 'company' && selectedCompany && selectedRole && selectedQuestionType)) &&
            styles.nextDisabled
          ]}
          disabled={
            !((mode === 'topic' && selectedMainTopic && selectedSubTopic && selectedSpecific && selectedDifficulty) ||
              (mode === 'company' && selectedCompany && selectedRole && selectedQuestionType))
          }
          onPress={onProceed}
        >
          <Text style={styles.nextText}>Start Interview</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 20,
    paddingBottom: 60
  },
  section: {
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#555'
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4
  },
  bubbleSelected: {
    backgroundColor: '#6C63FF'
  },
  bubbleText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center'
  },
  bubbleTextSelected: {
    color: '#fff',
    fontWeight: '600'
  },
  checkIcon: {
    marginLeft: 6
  },
  nextButton: {
    marginTop: 32,
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  nextDisabled: {
    backgroundColor: '#CCC'
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});