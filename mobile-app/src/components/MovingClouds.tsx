import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Cloud {
  id: number;
  startY: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

interface MovingCloudsProps {
  width: number;
  height: number;
}

const createClouds = (): Cloud[] => {
  return [
    { id: 1, startY: 50, duration: 45000, delay: 0, size: 80, opacity: 0.15 },
    { id: 2, startY: 120, duration: 60000, delay: 5000, size: 100, opacity: 0.12 },
    { id: 3, startY: 200, duration: 50000, delay: 15000, size: 70, opacity: 0.18 },
    { id: 4, startY: 90, duration: 55000, delay: 25000, size: 90, opacity: 0.14 },
  ];
};

const AnimatedCloud = ({
  cloud,
  width,
}: {
  cloud: Cloud;
  width: number;
}) => {
  const translateX = useSharedValue(-cloud.size);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Move cloud across screen
    translateX.value = withDelay(
      cloud.delay,
      withRepeat(
        withTiming(width + cloud.size, {
          duration: cloud.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Fade in and maintain opacity
    opacity.value = withDelay(
      cloud.delay,
      withTiming(cloud.opacity, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      })
    );
  }, [cloud.delay, cloud.duration, cloud.opacity, cloud.size, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          top: cloud.startY,
          width: cloud.size,
          height: cloud.size * 0.6,
        },
        animatedStyle,
      ]}
    >
      {/* Cloud shape using overlapping circles */}
      <View style={[styles.cloudCircle, { width: cloud.size * 0.5, height: cloud.size * 0.5, left: 0, top: cloud.size * 0.1 }]} />
      <View style={[styles.cloudCircle, { width: cloud.size * 0.6, height: cloud.size * 0.6, left: cloud.size * 0.3, top: 0 }]} />
      <View style={[styles.cloudCircle, { width: cloud.size * 0.5, height: cloud.size * 0.5, left: cloud.size * 0.5, top: cloud.size * 0.1 }]} />
    </Animated.View>
  );
};

export default function MovingClouds({ width, height }: MovingCloudsProps) {
  const clouds = createClouds();

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {clouds.map((cloud) => (
        <AnimatedCloud key={cloud.id} cloud={cloud} width={width} />
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
    zIndex: 2,
  },
  cloud: {
    position: 'absolute',
  },
  cloudCircle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 1000,
  },
});
