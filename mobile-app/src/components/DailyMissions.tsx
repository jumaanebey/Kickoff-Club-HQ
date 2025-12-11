import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameIcon } from './GameIcon';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { AnimatedButton, CelebrationBurst, AnimatedProgressBar } from './animations';
import {
  getUserMissions,
  assignDailyMissions,
  claimMissionReward,
} from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { UserMission, MissionRarity } from '../types';

interface RewardAnimation {
  id: string;
  x: number;
  y: number;
  coins: number;
  xp: number;
  kp?: number;
}

export default function DailyMissions() {
  const { user, refreshProfile } = useAuth();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [rewardAnimations, setRewardAnimations] = useState<RewardAnimation[]>([]);

  useEffect(() => {
    loadMissions();
  }, [user]);

  const loadMissions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Try to assign daily missions (only works if not already assigned today)
      await assignDailyMissions(user.id);

      // Load current missions
      const userMissions = await getUserMissions(user.id);
      setMissions(userMissions);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (missionId: string, event: any) => {
    if (!user) return;

    try {
      // Get button position for animation
      const target = event?.nativeEvent?.target;
      const x = event?.nativeEvent?.pageX || 200;
      const y = event?.nativeEvent?.pageY || 300;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await claimMissionReward(missionId);

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      // Trigger reward burst animation
      setRewardAnimations(prev => [...prev, {
        id: missionId,
        x,
        y,
        coins: result.coins_earned,
        xp: result.xp_earned,
        kp: result.kp_earned,
      }]);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await refreshProfile();
      await loadMissions();
    } catch (error) {
      Alert.alert('Error', 'Failed to claim mission reward');
    }
  };

  const getRarityColor = (rarity: MissionRarity): string => {
    switch (rarity) {
      case 'common':
        return COLORS.textSecondary;
      case 'rare':
        return '#3B82F6'; // Blue
      case 'epic':
        return '#A855F7'; // Purple
      default:
        return COLORS.textSecondary;
    }
  };

  const getRarityIcon = (rarity: MissionRarity): any => {
    switch (rarity) {
      case 'common':
        return 'radio-button-on';
      case 'rare':
        return 'diamond';
      case 'epic':
        return 'star';
      default:
        return 'radio-button-on';
    }
  };

  const getMissionIcon = (missionType: string): any => {
    switch (missionType) {
      case 'training':
        return 'train';
      case 'match':
        return 'play';
      case 'login':
        return 'hq';
      case 'collect':
        return 'collect';
      case 'upgrade':
        return 'upgrade';
      default:
        return 'ready';
    }
  };

  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading missions...</Text>
      </View>
    );
  }

  if (missions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="trophy-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No active missions</Text>
          <Text style={styles.emptySubtext}>Check back tomorrow!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flash" size={24} color={COLORS.accent} />
        <Text style={styles.headerTitle}>Daily Missions</Text>
        <AnimatedButton onPress={loadMissions} hapticFeedback={false}>
          <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
        </AnimatedButton>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.missionsContainer}
      >
        {missions.map((mission) => {
          const template = mission.mission_templates;
          if (!template) return null;

          const progress = (mission.current_count / template.requirement_count) * 100;
          const rarityColor = getRarityColor(template.rarity);

          return (
            <View
              key={mission.id}
              style={[styles.missionCard, { borderColor: rarityColor }]}
            >
              {/* Rarity Badge */}
              <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
                <Ionicons
                  name={getRarityIcon(template.rarity)}
                  size={12}
                  color={COLORS.white}
                />
                <Text style={styles.rarityText}>
                  {template.rarity.toUpperCase()}
                </Text>
              </View>

              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: rarityColor + '20' }]}>
                <GameIcon
                  name={getMissionIcon(template.mission_type)}
                  size={32}
                />
              </View>

              {/* Info */}
              <Text style={styles.missionName}>{template.name}</Text>
              <Text style={styles.missionDescription}>{template.description}</Text>

              {/* Progress */}
              <View style={styles.progressContainer}>
                <AnimatedProgressBar
                  progress={progress}
                  height={6}
                  backgroundColor={COLORS.border}
                  fillColor={rarityColor}
                  borderRadius={3}
                  animationType="spring"
                />
                <Text style={styles.progressText}>
                  {mission.current_count} / {template.requirement_count}
                </Text>
              </View>

              {/* Rewards */}
              <View style={styles.rewards}>
                {template.coins_reward > 0 && (
                  <View style={styles.rewardItem}>
                    <GameIcon name="coins" size={14} />
                    <Text style={styles.rewardText}>{template.coins_reward}</Text>
                  </View>
                )}
                {template.xp_reward > 0 && (
                  <View style={styles.rewardItem}>
                    <GameIcon name="xp" size={14} />
                    <Text style={styles.rewardText}>{template.xp_reward}</Text>
                  </View>
                )}
                {template.knowledge_points_reward > 0 && (
                  <View style={styles.rewardItem}>
                    <GameIcon name="kp" size={14} />
                    <Text style={styles.rewardText}>{template.knowledge_points_reward}</Text>
                  </View>
                )}
              </View>

              {/* Action Button */}
              {mission.completed && !mission.claimed ? (
                <AnimatedButton
                  style={[styles.claimButton, { backgroundColor: rarityColor }]}
                  onPress={(event) => handleClaimReward(mission.id, event)}
                >
                  <GameIcon name="collect" size={16} />
                  <Text style={styles.claimButtonText}>Claim</Text>
                </AnimatedButton>
              ) : mission.claimed ? (
                <View style={styles.completedBadge}>
                  <GameIcon name="ready" size={16} />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              ) : (
                <Text style={styles.timerText}>{getTimeRemaining(mission.expires_at)}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Reward Animations */}
      {rewardAnimations.map(anim => (
        <CelebrationBurst
          key={anim.id}
          x={anim.x}
          y={anim.y}
          onComplete={() => {
            setRewardAnimations(prev => prev.filter(a => a.id !== anim.id));
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  missionsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  missionCard: {
    width: 200,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    gap: 4,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  missionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  progressContainer: {
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  rewards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: 4,
  },
  claimButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 4,
  },
  completedText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  timerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
