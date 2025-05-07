// app/(tabs)/selection.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function SelectionScreen() {
    const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string | null>(null);
  const [showMoreCompanies, setShowMoreCompanies] = useState(false);
  const [showMoreRoles, setShowMoreRoles] = useState(false);

  const companies = showMoreCompanies ? [...initialCompanies, ...moreCompanies] : initialCompanies;
  const roles = showMoreRoles ? [...initialRoles, ...moreRoles] : initialRoles;


  const onProceed = () =>{
    router.replace({
        pathname: '/questions-preparing',
        params: {
          company: selectedCompany!,
          role: selectedRole!,
          questionType: selectedQuestionType!
        }
      });
  }

  useEffect(() => {
    if (selectedCompany && !companies.includes(selectedCompany)) {
      setShowMoreCompanies(true);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedRole && !roles.includes(selectedRole)) {
      setShowMoreRoles(true);
    }
  }, [selectedRole]);

  return (
    <SafeAreaView style={styles.safe}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choose Your Target</Text>

        <Text style={styles.subtitle}>Select Company</Text>
        <View style={styles.bubbleContainer}>
          {companies.map((comp) => {
            const selected = comp === selectedCompany;
            return (
              <TouchableOpacity
                key={comp}
                style={[styles.bubble, selected && styles.bubbleSelected]}
                onPress={() => setSelectedCompany(selected ? null : comp)}
              >
                <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                  {comp}
                </Text>
                {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>} 
              </TouchableOpacity>
            );
          })}
          {!showMoreCompanies && (
            <TouchableOpacity style={styles.moreButton} onPress={() => setShowMoreCompanies(true)}>
              <Text style={styles.moreText}>+ More</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subtitle}>Select Role</Text>
        <View style={styles.bubbleContainer}>
          {roles.map((role) => {
            const selected = role === selectedRole;
            return (
              <TouchableOpacity
                key={role}
                style={[styles.bubble, selected && styles.bubbleSelected]}
                onPress={() => setSelectedRole(selected ? null : role)}
              >
                <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                  {role}
                </Text>
                {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>} 
              </TouchableOpacity>
            );
          })}
          {!showMoreRoles && (
            <TouchableOpacity style={styles.moreButton} onPress={() => setShowMoreRoles(true)}>
              <Text style={styles.moreText}>+ More</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subtitle}>Select Question Type</Text>
        <View style={styles.bubbleContainer}>
          {questionTypes.map((type) => {
            const selected = type === selectedQuestionType;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.bubble, selected && styles.bubbleSelected]}
                onPress={() => setSelectedQuestionType(selected ? null : type)}
              >
                <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
                  {type}
                </Text>
                {selected && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.checkIcon}/>} 
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !(selectedCompany && selectedRole && selectedQuestionType) && styles.nextDisabled]}
          disabled={!(selectedCompany && selectedRole && selectedQuestionType)}
          onPress={onProceed}
        >
          <Text style={styles.nextText}>Next</Text>
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