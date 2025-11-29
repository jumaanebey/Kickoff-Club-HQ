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

interface GrassShimmerProps {
  width: number;
  height: number;
}

// Create shimmer strips that wave across the grass
const ShimmerStrip = ({ delay, width }: { delay: number; width: number }) => {
  const translateX = useSharedValue(-width);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(width * 2, {
            duration: 8000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-width, { duration: 0 })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.15, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.05, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );
  }, [delay, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: '45deg' }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.shimmerStrip, animatedStyle]} />;
};

export default function GrassShimmer({ width, height }: GrassShimmerProps) {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <ShimmerStrip delay={0} width={width} />
      <ShimmerStrip delay={2000} width={width} />
      <ShimmerStrip delay={4000} width={width} />
      <ShimmerStrip delay={6000} width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  shimmerStrip: {
    position: 'absolute',
    width: 200,
    height: '200%',
    backgroundColor: '#fff',
    top: '-50%',
  },
});
