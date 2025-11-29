import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherEffectsProps {
  width: number;
  height: number;
  weather?: 'sunny' | 'rainy' | 'clear';
}

// Rain drop component
const RainDrop = ({
  delay,
  x,
  height,
}: {
  delay: number;
  x: number;
  height: number;
}) => {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 20, {
          duration: 600,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, {
          duration: 600,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [delay, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        { left: x },
        animatedStyle,
      ]}
    />
  );
};

// Sun ray component
const SunRay = ({
  angle,
  delay,
  width,
}: {
  angle: number;
  delay: number;
  width: number;
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.15, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1.1, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${angle}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.sunRay, { width }, animatedStyle]}>
      <LinearGradient
        colors={['rgba(255, 223, 0, 0)', 'rgba(255, 223, 0, 0.3)', 'rgba(255, 223, 0, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.rayGradient}
      />
    </Animated.View>
  );
};

export default function WeatherEffects({
  width,
  height,
  weather = 'clear',
}: WeatherEffectsProps) {
  const [rainDrops, setRainDrops] = useState<Array<{ id: number; x: number; delay: number }>>([]);
  const [sunRays, setSunRays] = useState<Array<{ id: number; angle: number; delay: number }>>([]);

  useEffect(() => {
    if (weather === 'rainy') {
      // Generate rain drops
      const drops = [];
      for (let i = 0; i < 50; i++) {
        drops.push({
          id: i,
          x: Math.random() * width,
          delay: Math.random() * 600,
        });
      }
      setRainDrops(drops);
      setSunRays([]);
    } else if (weather === 'sunny') {
      // Generate sun rays
      const rays = [];
      for (let i = 0; i < 8; i++) {
        rays.push({
          id: i,
          angle: (360 / 8) * i,
          delay: i * 200,
        });
      }
      setSunRays(rays);
      setRainDrops([]);
    } else {
      setRainDrops([]);
      setSunRays([]);
    }
  }, [weather, width]);

  if (weather === 'clear') {
    return null;
  }

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {/* Rain */}
      {weather === 'rainy' &&
        rainDrops.map((drop) => (
          <RainDrop key={drop.id} delay={drop.delay} x={drop.x} height={height} />
        ))}

      {/* Sun rays */}
      {weather === 'sunny' && (
        <View style={styles.sunRaysContainer}>
          {sunRays.map((ray) => (
            <SunRay key={ray.id} angle={ray.angle} delay={ray.delay} width={width * 2} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 1,
    top: -20,
  },
  sunRaysContainer: {
    position: 'absolute',
    top: 100,
    left: '50%',
    width: 0,
    height: 0,
  },
  sunRay: {
    position: 'absolute',
    height: 200,
    left: 0,
    transformOrigin: 'left center',
  },
  rayGradient: {
    width: '100%',
    height: '100%',
  },
});
