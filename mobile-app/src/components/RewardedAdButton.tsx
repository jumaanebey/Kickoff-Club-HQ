import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { addCoins } from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { APP_CONFIG } from '../constants/config';

interface RewardedAdButtonProps {
  coinsReward?: number;
  dailyLimit?: number;
}

export default function RewardedAdButton({
  coinsReward = 20,
  dailyLimit = 5,
}: RewardedAdButtonProps) {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);

  const handleWatchAd = async () => {
    if (!user) return;

    if (adsWatched >= dailyLimit) {
      Alert.alert(
        'Daily Limit Reached',
        `You've watched ${dailyLimit} ads today. Come back tomorrow!`
      );
      return;
    }

    setLoading(true);

    try {
      // In production, this would show an actual AdMob rewarded ad
      // For now, simulate watching an ad
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Award coins
      await addCoins(user.id, coinsReward, 'Watched rewarded ad');
      await refreshProfile();

      setAdsWatched(prev => prev + 1);

      Alert.alert(
        'Coins Earned!',
        `You earned ${coinsReward} coins!\n\nAds remaining today: ${dailyLimit - adsWatched - 1}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process reward. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const adsRemaining = dailyLimit - adsWatched;

  return (
    <TouchableOpacity
      style={[styles.container, loading && styles.containerDisabled]}
      onPress={handleWatchAd}
      disabled={loading || adsRemaining <= 0}
    >
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Ionicons name="play-circle" size={32} color={COLORS.primary} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {loading ? 'Watching Ad...' : 'Watch Ad for Coins'}
        </Text>
        <Text style={styles.subtitle}>
          {adsRemaining > 0
            ? `${adsRemaining} ads remaining today`
            : 'Come back tomorrow'}
        </Text>
      </View>

      <View style={styles.rewardBadge}>
        <Ionicons name="logo-bitcoin" size={16} color={COLORS.accent} />
        <Text style={styles.rewardText}>+{coinsReward}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  containerDisabled: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  rewardText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 4,
  },
});
