import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface BuildingIdleAnimationProps {
  children: React.ReactNode;
  delay?: number;
  isProducing?: boolean;
}

export default function BuildingIdleAnimation({
  children,
  delay = 0,
  isProducing = false,
}: BuildingIdleAnimationProps) {
  // Floating animation values
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Gentle floating motion - up and down
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-3, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Infinite repeat
        false
      )
    );

    // Subtle breathing scale effect
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.02, {
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    // Pulsing glow for buildings with production ready
    if (isProducing) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.3, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      );
    }
  }, [delay, isProducing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Glow effect for producing buildings */}
      {isProducing && (
        <Animated.View style={[styles.glow, glowStyle]} />
      )}

      {/* Animated building */}
      <Animated.View style={[styles.building, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  building: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
});
