import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton, AnimatedProgressBar } from '../../components/animations';
import { getCourseWithLessons, getCourseProgress } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { Course, Lesson, CourseProgress } from '../../types';

export default function CourseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { courseId } = route.params as { courseId: string };

  const [course, setCourse] = useState<(Course & { lessons: Lesson[] }) | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const [courseData, progressData] = await Promise.all([
        getCourseWithLessons(courseId),
        user ? getCourseProgress(user.id, courseId) : null,
      ]);
      setCourse(courseData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    // Check if premium and user is free
    if (course?.is_premium && user?.subscription_tier === 'free') {
      Alert.alert(
        'Premium Content',
        'Upgrade to Pro to access this course',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {} },
        ]
      );
      return;
    }

    (navigation as any).navigate('LessonPlayer', {
      lessonId: lesson.id,
      courseId
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completed_lessons?.includes(lessonId) || false;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Course not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <AnimatedButton
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </AnimatedButton>
        </View>

        {/* Course Hero */}
        <View style={styles.hero}>
          {course.thumbnail_url ? (
            <Image
              source={{ uri: course.thumbnail_url }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="play-circle" size={64} color={COLORS.primary} />
            </View>
          )}
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{course.title}</Text>
            {course.is_premium && (
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="play-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{course.lesson_count} lessons</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{course.duration_minutes} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="school-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{course.difficulty}</Text>
            </View>
          </View>

          {/* Progress */}
          {progress && (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Your Progress</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(progress.progress_percent)}%
                </Text>
              </View>
              <AnimatedProgressBar
                progress={progress.progress_percent}
                height={6}
                backgroundColor={COLORS.border}
                fillColor={COLORS.primary}
                borderRadius={3}
                animationType="spring"
              />
            </View>
          )}
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lessons</Text>

          {course.lessons
            ?.sort((a, b) => a.order_index - b.order_index)
            .map((lesson, index) => (
              <AnimatedButton
                key={lesson.id}
                style={styles.lessonCard}
                onPress={() => handleLessonPress(lesson)}
              >
                <View style={styles.lessonNumber}>
                  {isLessonCompleted(lesson.id) ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.success}
                    />
                  ) : (
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  )}
                </View>

                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonMeta}>
                    <Text style={styles.lessonDuration}>
                      {Math.floor(lesson.duration_seconds / 60)} min
                    </Text>
                    <View style={styles.coinReward}>
                      <Ionicons name="logo-bitcoin" size={12} color={COLORS.accent} />
                      <Text style={styles.coinRewardText}>
                        +{lesson.coin_reward}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons
                  name="play-circle"
                  size={24}
                  color={COLORS.primary}
                />
              </AnimatedButton>
            ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Start/Continue Button */}
      <View style={styles.footer}>
        <AnimatedButton
          style={styles.startButton}
          onPress={() => {
            if (course.lessons?.length > 0) {
              const firstUncompletedLesson = course.lessons.find(
                (l) => !isLessonCompleted(l.id)
              );
              handleLessonPress(firstUncompletedLesson || course.lessons[0]);
            }
          }}
        >
          <Text style={styles.startButtonText}>
            {progress?.progress_percent ? 'Continue' : 'Start Course'}
          </Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
  header: {
    padding: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    height: 200,
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseInfo: {
    padding: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  proBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  proBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  metaText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  progressSection: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  progressPercent: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
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
  lessonsSection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonNumberText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  lessonInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  lessonTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lessonDuration: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  coinReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  coinRewardText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    marginLeft: 2,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
});
