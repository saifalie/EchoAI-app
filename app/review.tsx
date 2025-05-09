import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

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
    question: "Describe a project where you extensively used Dart.",
    answer: "I worked on a ride-sharing app where I used Dart to handle navigation, state, and API data parsing.",
    feedback: "The candidate explained a mobile app project, showcasing confidence in using Dart for navigation and data models."
  },
  {
    question: "How do you apply OOP principles in Flutter development?",
    answer: "I use classes and inheritance to create reusable widgets, and abstract classes for service layers.",
    feedback: "Candidate mentioned using inheritance and abstraction in widget design. Could elaborate further on polymorphism usage."
  }
]

const ReviewScreen = () => {
  const { data } = useLocalSearchParams();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // Parse the data correctly and get the reviews array
  const parsedData = JSON.parse(Array.isArray(data) ? data[0] : data);
  const reviews = parsedData.reviews;

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Calculate average rating - now with proper null checks
  const averageRating = reviews?.reduce((acc: number, curr: any) => {
    const rating = parseInt(curr.rating.split('/')[0]);
    return acc + rating;
  }, 0) / (reviews?.length || 1);

  // Get overall sentiment based on average rating
  const getSentiment = (rating: number) => {
    if (rating >= 8) return { emoji: "😊 🌟 💪 💯", label: "Excellent" };
    if (rating >= 6) return { emoji: "🙂 👍 💪", label: "Good" };
    if (rating >= 4) return { emoji: "😐 💭 📝", label: "Needs Improvement" };
    return { emoji: "😅 📚 💡", label: "Requires Attention" };
  };
  
  const sentiment = getSentiment(averageRating);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.headerText}>Interview Result 📊</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Score and Sentiment */}
        <View style={styles.row}>
          <View style={[styles.card, styles.scoreCard]}>
            <Text style={styles.cardTitle}>Overall Score</Text>
            <Text style={styles.scoreValue}>{Math.round(averageRating)}/10</Text>
            <Text style={styles.scoreLabel}>{sentiment.label}</Text>
          </View>
          <View style={[styles.card, styles.sentimentCard]}>
            <Text style={styles.cardTitle}>Overall Sentiment</Text>
            <Text style={styles.emojiRow}>{sentiment.emoji}</Text>
            <Text style={styles.scoreLabel}>{sentiment.label}</Text>
          </View>
        </View>

        {/* Questions with Answer & Feedback */}
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
                  <Text style={styles.answerLabel}>Analysis:</Text>
                  <Text style={styles.answerText}>{review.analysis}</Text>
                  <Text style={styles.answerLabel}>Rating:</Text>
                  <Text style={styles.answerText}>{review.rating}</Text>
                  <Text style={styles.answerLabel}>Suggestions:</Text>
                  <Text style={styles.answerText}>{review.suggestions}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

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
  }
})

export default ReviewScreen
