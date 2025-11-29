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
import { Ionicons } from '@expo/vector-icons';

interface Particle {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  size: number;
  icon: 'star' | 'sparkles' | 'ellipse';
  color: string;
}

interface AmbientParticlesProps {
  width: number;
  height: number;
  count?: number;
}

const createParticles = (count: number, width: number, height: number): Particle[] => {
  const particles: Particle[] = [];
  const icons: Array<'star' | 'sparkles' | 'ellipse'> = ['star', 'sparkles', 'ellipse'];
  const colors = ['#FFD700', '#FFFFFF', '#4ECDC4', '#FFA500'];

  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      startX: Math.random() * width,
      startY: Math.random() * height,
      duration: 8000 + Math.random() * 12000, // 8-20 seconds
      delay: Math.random() * 10000, // Random start delay
      size: 8 + Math.random() * 12, // 8-20px
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return particles;
};

const AnimatedParticle = ({
  particle,
  height,
}: {
  particle: Particle;
  height: number;
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Float upward
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(-height * 0.3, {
            duration: particle.duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    // Gentle horizontal drift
    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(30, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-30, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    // Twinkle/pulse opacity
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(0.6, {
            duration: particle.duration / 4,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, {
            duration: particle.duration / 4,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.6, {
            duration: particle.duration / 4,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: particle.duration / 4,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    // Gentle rotation
    rotate.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(360, {
          duration: particle.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Pulse scale
    scale.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: particle.duration / 3,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.8, {
            duration: particle.duration / 3,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: particle.duration / 3,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );
  }, [particle.delay, particle.duration, height]);

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
        styles.particle,
        {
          left: particle.startX,
          top: particle.startY,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={particle.icon} size={particle.size} color={particle.color} />
    </Animated.View>
  );
};

export default function AmbientParticles({
  width,
  height,
  count = 15,
}: AmbientParticlesProps) {
  const particles = createParticles(count, width, height);

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {particles.map((particle) => (
        <AnimatedParticle key={particle.id} particle={particle} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 3,
  },
  particle: {
    position: 'absolute',
  },
});
