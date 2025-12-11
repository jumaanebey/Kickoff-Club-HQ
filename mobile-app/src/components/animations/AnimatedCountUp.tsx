import React, { useEffect } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCountUpProps {
  endValue: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<TextStyle>;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCountUp: React.FC<AnimatedCountUpProps> = ({
  endValue,
  duration = 1500,
  delay = 0,
  style,
  prefix = '',
  suffix = '',
}) => {
  const count = useSharedValue(0);

  useEffect(() => {
    // Delay then animate to end value
    setTimeout(() => {
      count.value = withTiming(endValue, {
        duration,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
  }, [endValue, duration, delay]);

  const animatedProps = useAnimatedProps(() => {
    // Round to nearest integer for display
    const displayValue = Math.round(count.value);
    return {
      text: `${prefix}${displayValue}${suffix}`,
    } as any;
  });

  return <AnimatedText style={style} animatedProps={animatedProps} />;
};
