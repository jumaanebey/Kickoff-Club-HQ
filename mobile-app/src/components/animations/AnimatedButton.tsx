import React from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  hapticFeedback?: boolean;
}

/**
 * FarmVille-style button with juice
 * - Scale down on press
 * - Spring back on release
 * - Optional haptic feedback
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  hapticFeedback = true,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);
  const brightness = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: brightness.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
    brightness.value = withTiming(0.8, { duration: 100 });
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 8, stiffness: 300 });
    brightness.value = withTiming(1, { duration: 100 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={[styles.container, style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base styles can be overridden by parent
  },
});
