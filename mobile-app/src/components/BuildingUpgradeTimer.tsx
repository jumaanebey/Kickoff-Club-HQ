import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface BuildingUpgradeTimerProps {
  upgradeCompleteAt: string;
  onComplete: () => void;
}

export default function BuildingUpgradeTimer({
  upgradeCompleteAt,
  onComplete,
}: BuildingUpgradeTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Rotating hammer animation
    rotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const completeTime = new Date(upgradeCompleteAt).getTime();
      const diff = completeTime - now;

      if (diff <= 0) {
        setIsComplete(true);
        setTimeRemaining('Ready!');
        // Pulsing animation when complete
        scale.value = withRepeat(
          withSequence(
            withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        return;
      }

      // Calculate time remaining
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [upgradeCompleteAt]);

  const hammerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (isComplete) {
    return (
      <Animated.View style={[styles.completeOverlay, containerAnimatedStyle]}>
        <TouchableOpacity onPress={onComplete} activeOpacity={0.9}>
          <LinearGradient
            colors={[COLORS.success, COLORS.success + 'CC']}
            style={styles.completeButton}
          >
            <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
            <Text style={styles.completeText}>Tap to Finish!</Text>
            <View style={styles.sparkle}>
              <Ionicons name="sparkles" size={16} color={COLORS.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.upgradeOverlay}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
        style={styles.upgradeContainer}
      >
        <Animated.View style={hammerAnimatedStyle}>
          <Ionicons name="hammer" size={24} color={COLORS.primary} />
        </Animated.View>
        <View style={styles.timerInfo}>
          <Text style={styles.upgradeLabel}>Upgrading...</Text>
          <Text style={styles.timerText}>{timeRemaining}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  upgradeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BORDER_RADIUS.xl,
  },
  upgradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  timerInfo: {
    alignItems: 'center',
  },
  upgradeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.xl,
  },
  completeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 140,
  },
  completeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
    fontFamily: FONTS.bold,
  },
  sparkle: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
