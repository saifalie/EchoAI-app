// app/(tabs)/index.tsx

import { useUserStore } from '../../store/userStore';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HomeScreen() {
  const router = useRouter();
  const [hasResume, setHasResume] = useState<boolean>(true);
  const user =  useUserStore((state) =>state.user)


  useEffect( ()=>{
    getData()
    
  })
  const getData = async() =>{
    const userId = await AsyncStorage.getItem('userId')
    console.log('userid',userId);
    console.log('usermain',user);
    
  
    
  }

  const onStartInterview = () => {
    if (hasResume) {
      router.push('/selection');
    } else {
      router.push('/resume-uploader');
    }
  };

  const options = [
    { key: 'resume-uploader', title: 'Build Your Resume PDF For Free', subtitle: 'Approved by HRs and takes only 2 mins to export' },
    { key: 'review', title: 'Resume review with Arya', subtitle: 'Receive in real time depth resume feedback' },
    { key: 'flash', title: 'Rapid practice flash card', subtitle: 'Brush through every aspect of any skill / tools' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hey! {user?.username} 🎉</Text>
          <View style={styles.pointsBox}>
            <Ionicons name="flash" size={18} color="#444" />
            <Text style={styles.pointsText}>458</Text>
          </View>
        </View>

        {/* Resume indicator */}
        <View style={[styles.statusBox, hasResume ? styles.statusOk : styles.statusMissing]}>
          <Text style={styles.statusText}>
            {hasResume ? 'Resume Uploaded' : 'No Resume Found'}
          </Text>
        </View>

        {/* Coach Card */}
        <View style={styles.coachCard}>
          <View style={styles.coachRow}>
            <Image source={require('../../assets/images/sample_resume.jpeg')} style={styles.coachImage} />
            <View style={styles.coachTextContainer}>
              <Text style={styles.coachName}>Hi, I’m Arya</Text>
              <Text style={styles.coachSubtitle}>your Interview coach!</Text>
            </View>
          </View>
          <Text style={styles.coachBodyTitle}>Start a mock interview with me!</Text>
          <Text style={styles.coachBodyText}>
            I am your interview coach, ready to provide feedback to help you ace in the interviews!
          </Text>
          <TouchableOpacity onPress={onStartInterview} style={styles.coachButton}>
            <Text style={styles.coachButtonText}>Start Interview Practice</Text>
          </TouchableOpacity>
        </View>

        {/* Option Cards */}
        {options.map(o => (
          <TouchableOpacity
          onPress={()=>router.push('/review')}
          key={o.key} style={styles.optionCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionTitle}>{o.title}</Text>
              <Text style={styles.optionSubtitle}>{o.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={26} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 18 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFD5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pointsText: { marginLeft: 6, fontWeight: '600', fontSize: 16 },

  statusBox: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  statusOk: { backgroundColor: '#D4EDDA' },
  statusMissing: { backgroundColor: '#F8D7DA' },
  statusText: { fontSize: 14, fontWeight: '600', color: '#155724' },

  coachCard: {
    backgroundColor: '#FDEBD0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  coachRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  coachImage: { width: 56, height: 56, borderRadius: 28 },
  coachTextContainer: { flex: 1, paddingLeft: 14 },
  coachName: { fontWeight: '700', fontSize: 18 },
  coachSubtitle: { color: '#7F6000', fontSize: 14 },

  coachBodyTitle: { fontWeight: '600', marginBottom: 6, fontSize: 16 },
  coachBodyText: { fontSize: 14, marginBottom: 14, color: '#4A4A4A' },
  coachButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  coachButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionTitle: { fontWeight: '600', marginBottom: 6, fontSize: 16 },
  optionSubtitle: { fontSize: 14, color: '#555' },
});