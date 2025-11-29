import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedButton, AnimatedProgressBar } from '../../components/animations';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';

interface OnboardingScreenProps {
  onComplete: (level: string, recommendedCourse: string) => void;
}

const questions = [
  {
    id: 1,
    question: "How much do you know about football?",
    options: [
      { text: "Never watched a game", value: 0 },
      { text: "I've seen a few games", value: 1 },
      { text: "I watch regularly", value: 2 },
      { text: "I'm a huge fan", value: 3 },
    ],
  },
  {
    id: 2,
    question: "Do you know what a touchdown is worth?",
    options: [
      { text: "No idea", value: 0 },
      { text: "I think 6 points?", value: 1 },
      { text: "6 points + extra point", value: 2 },
      { text: "6 + PAT or 2-pt conversion", value: 3 },
    ],
  },
  {
    id: 3,
    question: "Can you name 3 positions on a football team?",
    options: [
      { text: "Not really", value: 0 },
      { text: "Maybe quarterback?", value: 1 },
      { text: "QB, WR, RB", value: 2 },
      { text: "I know offense and defense", value: 3 },
    ],
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: number) => {
    const newScore = score + value;
    setScore(newScore);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getLevel = () => {
    if (score <= 2) return { level: 'Rookie', icon: 'school', color: COLORS.primary };
    if (score <= 5) return { level: 'Fan', icon: 'football', color: COLORS.secondary };
    return { level: 'Expert', icon: 'trophy', color: COLORS.accent };
  };

  const getRecommendedCourse = () => {
    if (score <= 2) return { id: 'football-101', title: 'Football 101: The Basics' };
    if (score <= 5) return { id: 'positions', title: 'Positions Explained' };
    return { id: 'how-to-watch', title: 'How to Watch a Game' };
  };

  const handleComplete = () => {
    const { level } = getLevel();
    const { id } = getRecommendedCourse();
    onComplete(level, id);
  };

  if (showResult) {
    const { level, icon, color } = getLevel();
    const course = getRecommendedCourse();

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={[styles.levelBadge, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon as any} size={64} color={color} />
          </View>

          <Text style={styles.resultTitle}>You're a {level}!</Text>
          <Text style={styles.resultSubtitle}>
            {score <= 2 && "No worries! We'll start from the basics."}
            {score > 2 && score <= 5 && "You know some football! Let's build on that."}
            {score > 5 && "Nice! You know your stuff. Let's go deeper."}
          </Text>

          <View style={styles.recommendationCard}>
            <Text style={styles.recommendLabel}>We recommend starting with:</Text>
            <Text style={styles.recommendCourse}>{course.title}</Text>
          </View>

          <AnimatedButton style={styles.startButton} onPress={handleComplete}>
            <Text style={styles.startButtonText}>Let's Go!</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </AnimatedButton>

          <AnimatedButton
            style={styles.skipButton}
            onPress={() => onComplete(level, '')}
          >
            <Text style={styles.skipButtonText}>Skip to Home</Text>
          </AnimatedButton>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <AnimatedProgressBar
            progress={progress}
            height={6}
            backgroundColor={COLORS.border}
            fillColor={COLORS.primary}
            borderRadius={3}
            animationType="spring"
          />
          <Text style={styles.progressText}>
            {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <AnimatedButton
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.value)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </AnimatedButton>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  progressContainer: {
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  questionText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  optionsContainer: {
    paddingBottom: SPACING.xl,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  resultSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  recommendationCard: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  recommendLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  recommendCourse: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
});
