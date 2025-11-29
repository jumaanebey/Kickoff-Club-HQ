import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getBuildingAsset } from '../../constants/assets';

interface AnimatedBuildingUpgradeProps {
  buildingType: 'practice_field' | 'film_room' | 'weight_room' | 'stadium' | 'headquarters';
  fromLevel: number;
  toLevel: number;
  onComplete: () => void;
}

/**
 * FarmVille-style building upgrade animation
 * - Flash effect
 * - Scale bounce
 * - Crossfade between levels
 * - Haptic celebration
 */
export const AnimatedBuildingUpgrade: React.FC<AnimatedBuildingUpgradeProps> = ({
  buildingType,
  fromLevel,
  toLevel,
  onComplete,
}) => {
  const scale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const oldBuildingOpacity = useSharedValue(1);
  const newBuildingOpacity = useSharedValue(0);

  useEffect(() => {
    // Step 1: Flash effect (400ms)
    flashOpacity.value = withRepeat(
      withTiming(1, { duration: 100 }),
      4,
      true
    );

    // Step 2: Scale pulse with haptic (at 200ms)
    setTimeout(() => {
      runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      scale.value = withSequence(
        withTiming(1.2, { duration: 150, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
      );
    }, 200);

    // Step 3: Crossfade buildings (at 400ms)
    setTimeout(() => {
      oldBuildingOpacity.value = withTiming(0, { duration: 300 });
      newBuildingOpacity.value = withTiming(1, { duration: 300 });
    }, 400);

    // Step 4: Complete
    setTimeout(() => runOnJS(onComplete)(), 800);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const oldBuildingStyle = useAnimatedStyle(() => ({
    opacity: oldBuildingOpacity.value,
  }));

  const newBuildingStyle = useAnimatedStyle(() => ({
    opacity: newBuildingOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Old building */}
      <Animated.Image
        source={getBuildingAsset(buildingType, fromLevel)}
        style={[styles.building, oldBuildingStyle]}
      />

      {/* New building */}
      <Animated.Image
        source={getBuildingAsset(buildingType, toLevel)}
        style={[styles.building, styles.absolute, newBuildingStyle]}
      />

      {/* Flash overlay */}
      <Animated.View style={[styles.flash, flashStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  building: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
});
