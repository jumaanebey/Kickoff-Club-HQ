import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HeartLikeButton } from '../../components/microinteractions/HeartLikeButton';
import { PullToRefresh } from '../../components/microinteractions/PullToRefresh';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton } from '../../components/animations';
import { getCourses, getCourseProgress } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { Course, CourseProgress, LearnScreenNavigationProp } from '../../types';

export default function LearnScreen() {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedCourses, setLikedCourses] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData || []);

      // Load progress for each course
      if (user && coursesData) {
        const progressMap: Record<string, CourseProgress> = {};
        await Promise.all(
          coursesData.map(async (course) => {
            const courseProgress = await getCourseProgress(user.id, course.id);
            if (courseProgress) {
              progressMap[course.id] = courseProgress;
            }
          })
        );
        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === 'all') return true;
    return course.difficulty === selectedCategory;
  });

  // Separate free and premium courses
  const freeCourses = filteredCourses.filter((course) => !course.is_premium);
  const premiumCourses = filteredCourses.filter((course) => course.is_premium);

  const handleCoursePress = (course: Course) => {
    // Check if premium and user is free
    if (course.is_premium && user?.subscription_tier === 'free') {
      // Show upgrade prompt or navigate to course with locked state
    }
    navigation.navigate('CourseDetail', { courseId: course.id });
  };

  
  const handleLike = (courseId: string, liked: boolean) => {
    setLikedCourses(prev => ({ ...prev, [courseId]: liked }));
    // TODO: Persist like state to backend
  };

  return (
    <SafeAreaView style={styles.container}>
      <PullToRefresh onRefresh={loadData}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Master football knowledge</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <AnimatedButton
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </AnimatedButton>
          ))}
        </ScrollView>

        {/* Free Lessons Section */}
        {freeCourses.length > 0 && (
          <View style={styles.coursesContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="gift-outline" size={20} color={COLORS.success} />
                <Text style={styles.sectionTitle}>Free Lessons</Text>
              </View>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            </View>
            {freeCourses.map((course) => (
              <AnimatedButton
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCoursePress(course)}
              >
                <View style={styles.thumbnail}>
                  {course.thumbnail_url ? (
                    <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnailImage} />
                  ) : (
                    <View style={styles.thumbnailPlaceholder}>
                      <Ionicons name="play-circle" size={40} color={COLORS.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.courseInfo}>
                  <View style={styles.courseHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                    </View>
                    <HeartLikeButton
                      initialLiked={!!likedCourses[course.id]}
                      onLikeChange={(liked) => handleLike(course.id, liked)}
                      size={20}
                    />
                  </View>
                  <Text style={styles.courseDescription} numberOfLines={2}>{course.description}</Text>
                  <View style={styles.courseMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="play-circle-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{course.lesson_count} lessons</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{course.duration_minutes} min</Text>
                    </View>
                    <View style={[styles.difficultyBadge, course.difficulty === 'beginner' && styles.difficultyBeginner, course.difficulty === 'intermediate' && styles.difficultyIntermediate, course.difficulty === 'advanced' && styles.difficultyAdvanced]}>
                      <Text style={styles.difficultyText}>{course.difficulty}</Text>
                    </View>
                  </View>
                  {progress[course.id] && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress[course.id].progress_percent}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{Math.round(progress[course.id].progress_percent)}%</Text>
                    </View>
                  )}
                </View>
              </AnimatedButton>
            ))}
          </View>
        )}

        {/* Premium Lessons Section */}
        {premiumCourses.length > 0 && (
          <View style={styles.coursesContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="star" size={20} color={COLORS.accent} />
                <Text style={styles.sectionTitle}>Premium Lessons</Text>
              </View>
              <View style={styles.proBadgeLarge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>

            {/* Upgrade CTA for free users */}
            {user?.subscription_tier === 'free' && (
              <AnimatedButton style={styles.upgradeBanner}>
                <Ionicons name="rocket" size={24} color={COLORS.white} />
                <View style={styles.upgradeBannerText}>
                  <Text style={styles.upgradeBannerTitle}>Unlock All Lessons</Text>
                  <Text style={styles.upgradeBannerSubtitle}>Get unlimited access to premium content</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
              </AnimatedButton>
            )}

            {premiumCourses.map((course) => (
              <AnimatedButton
                key={course.id}
                style={[styles.courseCard, user?.subscription_tier === 'free' && styles.courseCardLocked]}
                onPress={() => handleCoursePress(course)}
              >
                <View style={styles.thumbnail}>
                  {course.thumbnail_url ? (
                    <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnailImage} />
                  ) : (
                    <View style={styles.thumbnailPlaceholder}>
                      <Ionicons name="play-circle" size={40} color={COLORS.accent} />
                    </View>
                  )}
                  {user?.subscription_tier === 'free' && (
                    <View style={styles.premiumBadge}>
                      <Ionicons name="lock-closed" size={12} color={COLORS.white} />
                    </View>
                  )}
                </View>
                <View style={styles.courseInfo}>
                  <View style={styles.courseHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                    </View>
                    <View style={styles.proBadge}>
                      <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                  </View>
                  <Text style={styles.courseDescription} numberOfLines={2}>{course.description}</Text>
                  <View style={styles.courseMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="play-circle-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{course.lesson_count} lessons</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>{course.duration_minutes} min</Text>
                    </View>
                    <View style={[styles.difficultyBadge, course.difficulty === 'beginner' && styles.difficultyBeginner, course.difficulty === 'intermediate' && styles.difficultyIntermediate, course.difficulty === 'advanced' && styles.difficultyAdvanced]}>
                      <Text style={styles.difficultyText}>{course.difficulty}</Text>
                    </View>
                  </View>
                  {progress[course.id] && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress[course.id].progress_percent}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{Math.round(progress[course.id].progress_percent)}%</Text>
                    </View>
                  )}
                </View>
              </AnimatedButton>
            ))}
          </View>
        )}

        {/* Empty State */}
        {freeCourses.length === 0 && premiumCourses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
      </PullToRefresh>
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
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.backgroundLight,
    marginRight: SPACING.sm,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  coursesContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  freeBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  freeBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  proBadgeLarge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  upgradeBannerText: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  upgradeBannerTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  upgradeBannerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  courseCardLocked: {
    opacity: 0.7,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 100,
    height: 120,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.sm,
    padding: 4,
  },
  courseInfo: {
    flex: 1,
    padding: SPACING.sm,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseTitle: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  proBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.xs,
  },
  proBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyBeginner: {
    backgroundColor: COLORS.success + '30',
  },
  difficultyIntermediate: {
    backgroundColor: COLORS.warning + '30',
  },
  difficultyAdvanced: {
    backgroundColor: COLORS.error + '30',
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
