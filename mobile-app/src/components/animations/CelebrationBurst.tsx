import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface CelebrationBurstProps {
  onComplete: () => void;
  x: number;
  y: number;
}

/**
 * Celebration burst animation for training completion
 * - Creates particle explosion effect
 * - Multiple animated circles bursting outward
 * - FarmVille-style juice
 */
export const CelebrationBurst: React.FC<CelebrationBurstProps> = ({
  onComplete,
  x,
  y,
}) => {
  // Create 8 particles in a circle pattern
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      id: i,
      targetX: Math.cos(angle) * 80,
      targetY: Math.sin(angle) * 80,
    };
  });

  useEffect(() => {
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Complete after animation
    setTimeout(() => runOnJS(onComplete)(), 600);
  }, []);

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          targetX={particle.targetX}
          targetY={particle.targetY}
        />
      ))}
    </View>
  );
};

const Particle: React.FC<{ targetX: number; targetY: number }> = ({
  targetX,
  targetY,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Scale in
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });

    // Burst outward
    translateX.value = withTiming(targetX, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });

    translateY.value = withTiming(targetY, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });

    // Fade out
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
    }, 400);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  particle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
