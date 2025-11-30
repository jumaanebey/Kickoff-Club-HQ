import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface BuildingProductionTimerProps {
  productionType: 'kp' | 'coins' | 'none';
  productionRate: number;
  productionCap: number;
  currentProduction: number;
  lastCollected: string;
  onUpdate: (newProduction: number) => void;
}

export default function BuildingProductionTimer({
  productionType,
  productionRate,
  productionCap,
  currentProduction,
  lastCollected,
  onUpdate,
}: BuildingProductionTimerProps) {
  const [production, setProduction] = useState(currentProduction);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (production >= productionCap) {
      // Pulsing animation when full
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = 1;
    }
  }, [production, productionCap]);

  useEffect(() => {
    // Calculate production every second
    const interval = setInterval(() => {
      const lastCollectedTime = new Date(lastCollected).getTime();
      const now = Date.now();
      const hoursElapsed = (now - lastCollectedTime) / (1000 * 60 * 60);

      const newProduction = Math.min(
        Math.floor(hoursElapsed * productionRate),
        productionCap
      );

      setProduction(newProduction);
      onUpdate(newProduction);
    }, 1000);

    return () => clearInterval(interval);
  }, [productionRate, productionCap, lastCollected, onUpdate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (productionType === 'none' || productionRate === 0) {
    return null;
  }

  const isFull = production >= productionCap;
  const fillPercent = (production / productionCap) * 100;
  const icon = productionType === 'kp' ? 'school' : 'logo-bitcoin';
  const color = productionType === 'kp' ? COLORS.secondary : COLORS.accent;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.badge, isFull && styles.badgeFull]}>
        <Ionicons name={icon} size={14} color={isFull ? COLORS.accent : color} />
        <Text style={[styles.text, isFull && styles.textFull]}>
          {production}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${fillPercent}%`,
              backgroundColor: isFull ? COLORS.accent : color,
            },
          ]}
        />
      </View>

      {isFull && (
        <View style={styles.readyBadge}>
          <Ionicons name="download" size={12} color={COLORS.white} />
          <Text style={styles.readyText}>READY!</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 4,
    right: 4,
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    gap: 3,
  },
  badgeFull: {
    backgroundColor: COLORS.accent + '30',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  textFull: {
    color: COLORS.accent,
  },
  progressBar: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 2,
    gap: 2,
  },
  readyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
