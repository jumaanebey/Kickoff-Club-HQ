import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface BuildingSkeletonProps {
  delay?: number;
}

export default function BuildingSkeleton({ delay = 0 }: BuildingSkeletonProps) {
  const shimmerTranslate = useSharedValue(-200);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(200, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.skeleton}>
        {/* Shimmer effect */}
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Skeleton shape */}
        <View style={styles.buildingShape} />
        <View style={styles.buildingTop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeleton: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  buildingShape: {
    width: '70%',
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    position: 'absolute',
    bottom: 10,
    left: '15%',
  },
  buildingTop: {
    width: '50%',
    height: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    position: 'absolute',
    top: 10,
    left: '25%',
  },
});
