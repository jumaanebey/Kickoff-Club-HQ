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

interface FieldLinePulseProps {
  width: number;
  height: number;
}

// Pulsing glow effect for field lines
const PulseLine = ({
  orientation,
  position,
  delay,
  width,
  height,
}: {
  orientation: 'horizontal' | 'vertical';
  position: number;
  delay: number;
  width: number;
  height: number;
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Pulse opacity
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0, { duration: 5000, easing: Easing.linear }),
          withTiming(0.3, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, { duration: 3000, easing: Easing.linear })
        ),
        -1,
        false
      )
    );

    // Subtle scale pulse
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 5000, easing: Easing.linear }),
          withTiming(1.05, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 3000, easing: Easing.linear })
        ),
        -1,
        false
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const lineStyle =
    orientation === 'horizontal'
      ? {
          top: position * height,
          left: 0,
          width: width,
          height: 2,
        }
      : {
          left: position * width,
          top: 0,
          width: 2,
          height: height,
        };

  return (
    <Animated.View
      style={[styles.line, lineStyle, animatedStyle]}
      pointerEvents="none"
    />
  );
};

export default function FieldLinePulse({ width, height }: FieldLinePulseProps) {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {/* Horizontal lines */}
      <PulseLine
        orientation="horizontal"
        position={0.25}
        delay={0}
        width={width}
        height={height}
      />
      <PulseLine
        orientation="horizontal"
        position={0.5}
        delay={3000}
        width={width}
        height={height}
      />
      <PulseLine
        orientation="horizontal"
        position={0.75}
        delay={6000}
        width={width}
        height={height}
      />

      {/* Vertical lines */}
      <PulseLine
        orientation="vertical"
        position={0.33}
        delay={1500}
        width={width}
        height={height}
      />
      <PulseLine
        orientation="vertical"
        position={0.67}
        delay={4500}
        width={width}
        height={height}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 4,
  },
  line: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
});
