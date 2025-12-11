import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconPNGAssets } from '../../constants/assets';

interface AnimatedCoinCollectProps {
  amount: number;
  onComplete: () => void;
  startX: number;
  startY: number;
}

/**
 * FarmVille-style coin collection animation
 * - Coin flies from building to coin counter
 * - Bounces and scales for juice
 * - Haptic feedback on collection
 */
export const AnimatedCoinCollect: React.FC<AnimatedCoinCollectProps> = ({
  amount,
  onComplete,
  startX,
  startY,
}) => {
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Start: scale in with bounce
    scale.value = withSpring(1, { damping: 8, stiffness: 100 });

    // Arc animation (parabolic path to top-right)
    translateY.value = withSequence(
      withTiming(-50, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(-200, { duration: 400, easing: Easing.in(Easing.quad) })
    );

    translateX.value = withTiming(200, {
      duration: 800,
      easing: Easing.inOut(Easing.quad),
    });

    // Fade out near the end
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => runOnJS(onComplete)(), 200);
    }, 700);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={IconPNGAssets.coins} style={styles.coin} />
      <Animated.Text style={styles.amount}>+{amount}</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  coin: {
    width: 32,
    height: 32,
  },
  amount: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
