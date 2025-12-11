import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

interface AchievementToastProps {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'success' | 'warning' | 'info';
  duration?: number;
  onDismiss: () => void;
}

export default function AchievementToast({
  title,
  message,
  icon = 'trophy',
  type = 'success',
  duration = 3000,
  onDismiss,
}: AchievementToastProps) {
  const translateY = useSharedValue(-200);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Slide in from top with bounce
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });

    // Pop in scale
    scale.value = withSequence(
      withTiming(1.1, {
        duration: 200,
        easing: Easing.out(Easing.back(2)),
      }),
      withTiming(1, { duration: 100 })
    );

    // Fade in
    opacity.value = withTiming(1, { duration: 200 });

    // Auto dismiss after duration
    const timeout = setTimeout(() => {
      // Slide out to top
      translateY.value = withTiming(-200, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      });

      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      });

      setTimeout(() => {
        onDismiss();
      }, 300);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getGradientColors = () => {
    switch (type) {
      case 'success':
        return [COLORS.primary, COLORS.secondary];
      case 'warning':
        return ['#FFA726', '#FF7043'];
      case 'info':
        return ['#42A5F5', '#1E88E5'];
      default:
        return [COLORS.primary, COLORS.secondary];
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return COLORS.accent;
      case 'warning':
        return '#FFD54F';
      case 'info':
        return '#90CAF9';
      default:
        return COLORS.accent;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={getGradientColors() as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color={getIconColor()} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {/* Sparkle decoration */}
        <View style={styles.sparkles}>
          <Ionicons name="sparkles" size={16} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10000,
  },
  gradient: {
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    fontFamily: FONTS.bold,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: FONTS.regular,
  },
  sparkles: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
