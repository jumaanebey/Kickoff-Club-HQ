import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface FloatingNumberProps {
  x: number;
  y: number;
  amount: number;
  type: 'coin' | 'kp';
  onComplete: () => void;
}

export default function FloatingNumber({
  x,
  y,
  amount,
  type,
  onComplete,
}: FloatingNumberProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // Pop in
    scale.value = withSequence(
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 100 })
    );

    opacity.value = withTiming(1, { duration: 200 });

    // Float up
    translateY.value = withTiming(-150, {
      duration: 1500,
      easing: Easing.out(Easing.quad),
    });

    // Fade out
    setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });
    }, 800);

    // Clean up
    const timeout = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const displayText = type === 'coin' ? `+${amount}` : `+${amount} KP`;
  const color = type === 'coin' ? '#FFD700' : '#4ECDC4';

  return (
    <Animated.View style={[styles.container, { left: x, top: y }, animatedStyle]}>
      <Text style={[styles.text, { color, textShadowColor: color }]}>
        {displayText}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1001,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textShadowOpacity: 0.8,
  },
});
