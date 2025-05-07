import { MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const strengths = [
  "Demonstrated strong knowledge in Flutter application development, particularly in integrating APIs and managing state with provider state management.",
  "Experienced in using OOP concepts such as abstraction, inheritance, and encapsulation in real-world projects.",
  "Proficient in exception handling within Flutter, effectively using try-catch blocks for error management.",
  "Able to articulate project experiences and technical implementations clearly."
]

const improvements = [
  "Lacks a solid understanding of SOLID principles, a fundamental aspect for quality software development.",
  "Needs to improve understanding and application of Dart Mixin, which is critical for effective Flutter development.",
  "Could benefit from deeper exposure to different Dart language features and data structures to enhance coding proficiency.",
  "Could benefit from gaining clarity on implementing Industry-standard best practices overall in the development process."
]

const questions = [
  {
    question: "Hello and welcome! To break the ice, could you describe a project where you extensively used Dart?",
    feedback: "The candidate explained a mobile app project, showcasing confidence in using Dart for navigation and data models."
  },
  {
    question: "Can you explain how you apply OOP principles in Flutter development?",
    feedback: "The candidate mentioned using inheritance and abstraction in widget design. Could elaborate further on polymorphism usage."
  }
]

const ReviewScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Interview Report 📊</Text>

      {/* Feedback */}
      <View style={styles.sectionBoxBlue}>
        <Text style={styles.sectionTitle}>Overall Feedback</Text>
        <Text style={styles.text}>
          The candidate demonstrates adequate technical skills with significant experience in Flutter development, but lacks depth in some critical areas necessary for advanced software architecture and design.
        </Text>
      </View>

      {/* Score and Sentiment */}
      <View style={styles.row}>
        <View style={[styles.card, styles.scoreCard]}>
          <Text style={styles.cardTitle}>Overall Score</Text>
          <Text style={styles.scoreValue}>75/100</Text>
          <Text style={styles.scoreLabel}>Excellent</Text>
        </View>
        <View style={[styles.card, styles.sentimentCard]}>
          <Text style={styles.cardTitle}>Overall Sentiment</Text>
          <Text style={styles.emojiRow}>😅 🙂 👍 💯</Text>
          <Text style={styles.scoreLabel}>OK</Text>
        </View>
      </View>

      {/* Strengths */}
      <View style={styles.sectionBoxGreen}>
        <Text style={styles.sectionTitle}>Areas of Strength</Text>
        {strengths.map((point, index) => (
          <View key={index} style={styles.bulletRow}>
            <MaterialIcons name="check-circle" size={18} color="#28a745" />
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </View>

      {/* Improvements */}
      <View style={styles.sectionBoxRed}>
        <Text style={styles.sectionTitle}>Areas to Improve</Text>
        {improvements.map((point, index) => (
          <View key={index} style={styles.bulletRow}>
            <MaterialIcons name="cancel" size={18} color="#dc3545" />
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </View>

      {/* Questions */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Questions with Evaluation</Text>
        {questions.map((q, index) => (
          <View key={index} style={styles.questionBox}>
            <Text style={styles.question}>Q{index + 1}. {q.question}</Text>
            <Text style={styles.answer}>{q.feedback}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12
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
  sectionBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 14,
    lineHeight: 20
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
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
  question: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  answer: {
    fontSize: 14,
    lineHeight: 18,
    color: '#444'
  }
})

export default ReviewScreen
