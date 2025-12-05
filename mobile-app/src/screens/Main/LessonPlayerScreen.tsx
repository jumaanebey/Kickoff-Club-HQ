import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useAuth } from '../../context/AuthContext';
import {
  getCourseWithLessons,
  updateCourseProgress,
  addCoins,
} from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { Lesson } from '../../types';

const { width } = Dimensions.get('window');

export default function LessonPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user, refreshProfile } = useAuth();
  const { lessonId, courseId } = route.params as {
    lessonId: string;
    courseId: string;
  };

  const videoRef = useRef<Video>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const courseData = await getCourseWithLessons(courseId);
      if (courseData?.lessons) {
        const sortedLessons = courseData.lessons.sort(
          (a: any, b: any) => a.order_index - b.order_index
        );
        setAllLessons(sortedLessons);
        const currentLesson = sortedLessons.find((l: any) => l.id === lessonId);
        setLesson(currentLesson || null);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'Failed to load lesson');
    }
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Check if video is complete (90% watched)
      if (
        status.positionMillis &&
        status.durationMillis &&
        status.positionMillis / status.durationMillis >= 0.9 &&
        !completed
      ) {
        handleLessonComplete();
      }
    }
  };

  const handleLessonComplete = async () => {
    if (!user || !lesson || completed) return;

    setCompleted(true);

    try {
      // Update progress
      await updateCourseProgress(user.id, courseId, lessonId);

      // Award coins
      await addCoins(
        user.id,
        lesson.coin_reward,
        `Completed: ${lesson.title}`
      );

      await refreshProfile();

      // Show completion message
      Alert.alert(
        'Lesson Complete!',
        `You earned ${lesson.coin_reward} Coins!`,
        [
          {
            text: 'Next Lesson',
            onPress: goToNextLesson,
          },
          {
            text: 'Back to Course',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      (navigation as any).navigate('LessonPlayer', {
        lessonId: nextLesson.id,
        courseId
      });
    } else {
      Alert.alert('Course Complete!', 'You\'ve finished all lessons!');
      navigation.goBack();
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      (navigation as any).navigate('LessonPlayer', {
        lessonId: prevLesson.id,
        courseId
      });
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.lessonNumber}>
            Lesson {currentIndex + 1} of {allLessons.length}
          </Text>
        </View>
        <View style={styles.coinReward}>
          <Ionicons name="logo-bitcoin" size={16} color={COLORS.accent} />
          <Text style={styles.coinRewardText}>+{lesson.coin_reward}</Text>
        </View>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: lesson.video_url }}
          style={styles.video}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          shouldPlay
        />

        {/* Custom Controls Overlay */}
        <TouchableOpacity
          style={styles.videoOverlay}
          onPress={togglePlayPause}
          activeOpacity={1}
        >
          {!isPlaying && (
            <View style={styles.playButton}>
              <Ionicons name="play" size={48} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${duration > 0 ? (position / duration) * 100 : 0}%` },
            ]}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Lesson Info */}
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
          onPress={goToPreviousLesson}
          disabled={!hasPrevious}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={hasPrevious ? COLORS.text : COLORS.textMuted}
          />
          <Text
            style={[
              styles.navButtonText,
              !hasPrevious && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleLessonComplete}
        >
          <Text style={styles.completeButtonText}>
            {completed ? 'Completed' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
          onPress={goToNextLesson}
          disabled={!hasNext}
        >
          <Text
            style={[
              styles.navButtonText,
              !hasNext && styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={hasNext ? COLORS.text : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  lessonNumber: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  coinReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  coinRewardText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
    fontWeight: '600',
    marginLeft: 4,
  },
  videoContainer: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  timeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  lessonInfo: {
    padding: SPACING.lg,
    flex: 1,
  },
  lessonTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  lessonDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginHorizontal: SPACING.xs,
  },
  navButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  completeButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  completeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
