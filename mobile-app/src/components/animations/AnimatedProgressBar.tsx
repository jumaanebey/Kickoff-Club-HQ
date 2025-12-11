import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  gradientColors?: string[]; // Optional gradient colors (overrides fillColor)
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
  animationType?: 'timing' | 'spring';
  duration?: number;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor = '#E5E7EB',
  fillColor = '#3B82F6',
  gradientColors,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 0 },
  borderRadius = 3,
  style,
  animated = true,
  animationType = 'spring',
  duration = 500,
}) => {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      if (animationType === 'spring') {
        progressValue.value = withSpring(Math.min(Math.max(progress, 0), 100), {
          damping: 15,
          stiffness: 100,
        });
      } else {
        progressValue.value = withTiming(Math.min(Math.max(progress, 0), 100), {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    } else {
      progressValue.value = Math.min(Math.max(progress, 0), 100);
    }
  }, [progress, animated, animationType, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      {gradientColors ? (
        <Animated.View style={[styles.fill, animatedStyle]}>
          <LinearGradient
            colors={gradientColors as any}
            start={gradientStart}
            end={gradientEnd}
            style={[styles.gradient, { borderRadius }]}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fillColor,
              borderRadius,
            },
            animatedStyle,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});
