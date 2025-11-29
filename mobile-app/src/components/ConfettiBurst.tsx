import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Confetti {
  id: number;
  startX: number;
  startY: number;
  color: string;
  delay: number;
  angle: number;
  velocity: number;
  size: number;
  rotation: number;
}

interface ConfettiBurstProps {
  x: number;
  y: number;
  count?: number;
  onComplete: () => void;
}

const COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
];

const createConfetti = (count: number, x: number, y: number): Confetti[] => {
  const confetti: Confetti[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + (Math.random() * 30 - 15);
    confetti.push({
      id: i,
      startX: x,
      startY: y,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 100,
      angle,
      velocity: 150 + Math.random() * 100,
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 360,
    });
  }
  return confetti;
};

const AnimatedConfetti = ({
  confetti,
  onComplete,
}: {
  confetti: Confetti;
  onComplete?: () => void;
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(confetti.rotation);
  const scale = useSharedValue(0);

  useEffect(() => {
    const radians = (confetti.angle * Math.PI) / 180;
    const destX = Math.cos(radians) * confetti.velocity;
    const destY = Math.sin(radians) * confetti.velocity;

    // Pop in
    scale.value = withDelay(
      confetti.delay,
      withSequence(
        withTiming(1.2, {
          duration: 150,
          easing: Easing.out(Easing.back(2)),
        }),
        withTiming(1, { duration: 100 })
      )
    );

    // Shoot out
    translateX.value = withDelay(
      confetti.delay,
      withTiming(destX, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      })
    );

    // Arc trajectory with gravity
    translateY.value = withDelay(
      confetti.delay,
      withSequence(
        withTiming(destY - 50, {
          duration: 400,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(destY + 200, {
          duration: 800,
          easing: Easing.in(Easing.quad),
        })
      )
    );

    // Spin
    rotate.value = withDelay(
      confetti.delay,
      withTiming(confetti.rotation + 720 + Math.random() * 360, {
        duration: 1200,
        easing: Easing.out(Easing.quad),
      })
    );

    // Fade out
    opacity.value = withDelay(
      confetti.delay + 600,
      withTiming(0, {
        duration: 600,
        easing: Easing.in(Easing.quad),
      })
    );

    // Cleanup
    const timeout = setTimeout(() => {
      if (confetti.id === 0 && onComplete) {
        onComplete();
      }
    }, confetti.delay + 1200);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: confetti.startX,
          top: confetti.startY,
          width: confetti.size,
          height: confetti.size,
          backgroundColor: confetti.color,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function ConfettiBurst({
  x,
  y,
  count = 30,
  onComplete,
}: ConfettiBurstProps) {
  const confettiPieces = createConfetti(count, x, y);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((confetti) => (
        <AnimatedConfetti
          key={confetti.id}
          confetti={confetti}
          onComplete={confetti.id === 0 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 10000,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});
