import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  delay: number;
}

interface ParticleExplosionProps {
  x: number;
  y: number;
  amount: number;
  type: 'coin' | 'kp';
  onComplete: () => void;
}

const createParticles = (count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      angle: (360 / count) * i + Math.random() * 30 - 15, // Spread evenly in a circle
      distance: 60 + Math.random() * 40, // Random distance 60-100px
      delay: i * 30, // Stagger the particles
    });
  }
  return particles;
};

function AnimatedParticle({
  particle,
  type,
}: {
  particle: Particle;
  type: 'coin' | 'kp';
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Calculate destination based on angle
    const radians = (particle.angle * Math.PI) / 180;
    const destX = Math.cos(radians) * particle.distance;
    const destY = Math.sin(radians) * particle.distance;

    // Pop out animation
    scale.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 100 })
      )
    );

    // Explode outward
    translateX.value = withDelay(
      particle.delay,
      withTiming(destX, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      })
    );

    translateY.value = withDelay(
      particle.delay,
      withTiming(destY - 100, { // Extra upward movement
        duration: 600,
        easing: Easing.out(Easing.quad),
      })
    );

    // Rotate while flying
    rotate.value = withDelay(
      particle.delay,
      withTiming(360 + Math.random() * 360, {
        duration: 600,
        easing: Easing.linear,
      })
    );

    // Fade out
    opacity.value = withDelay(
      particle.delay + 300,
      withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.quad),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      <Ionicons
        name={type === 'coin' ? 'logo-bitcoin' : 'school'}
        size={20}
        color={type === 'coin' ? '#FFD700' : '#4ECDC4'}
      />
    </Animated.View>
  );
}

export default function ParticleExplosion({
  x,
  y,
  amount,
  type,
  onComplete,
}: ParticleExplosionProps) {
  const particleCount = Math.min(Math.max(8, Math.floor(amount / 10)), 20); // 8-20 particles
  const particles = createParticles(particleCount);

  useEffect(() => {
    // Clean up after animation completes
    const timeout = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {particles.map((particle) => (
        <AnimatedParticle key={particle.id} particle={particle} type={type} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    left: -10,
    top: -10,
  },
});
