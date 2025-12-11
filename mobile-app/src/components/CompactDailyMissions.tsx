import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
import { AnimatedButton, CelebrationBurst, AnimatedProgressBar } from './animations';
import {
  getUserMissions,
  assignDailyMissions,
  claimMissionReward,
} from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { UserMission, MissionRarity } from '../types';

const { width, height } = Dimensions.get('window');

interface RewardAnimation {
  id: string;
  x: number;
  y: number;
  coins: number;
  xp: number;
  kp?: number;
}

export default function CompactDailyMissions() {
  const { user, refreshProfile } = useAuth();
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [rewardAnimations, setRewardAnimations] = useState<RewardAnimation[]>([]);

  const translateY = useSharedValue(0);

  useEffect(() => {
    loadMissions();
  }, [user]);

  const loadMissions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await assignDailyMissions(user.id);
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
      const x = event?.nativeEvent?.pageX || width / 2;
      const y = event?.nativeEvent?.pageY || height / 2;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await claimMissionReward(missionId);

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

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
        return '#3B82F6';
      case 'epic':
        return '#A855F7';
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
        return 'barbell';
      case 'match':
        return 'trophy';
      case 'login':
        return 'log-in';
      case 'collect':
        return 'cash';
      case 'upgrade':
        return 'arrow-up-circle';
      default:
        return 'checkmark-circle';
    }
  };

  const handleToggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };

  // Calculate summary
  const completedCount = missions.filter(m => m.completed && !m.claimed).length;
  const totalCount = missions.length;

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        // Swipe down to close
        setExpanded(false);
        translateY.value = withSpring(0);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Collapsed Tab (Clash of Clans style)
  if (!expanded) {
    return (
      <>
        <TouchableOpacity
          style={styles.collapsedTab}
          onPress={handleToggleExpand}
          activeOpacity={0.8}
        >
          <View style={styles.collapsedContent}>
            <View style={styles.collapsedLeft}>
              <Ionicons name="flash" size={20} color={COLORS.accent} />
              <Text style={styles.collapsedTitle}>Daily Missions</Text>
            </View>
            <View style={styles.collapsedRight}>
              {completedCount > 0 && (
                <View style={styles.readyBadge}>
                  <Text style={styles.readyBadgeText}>{completedCount}</Text>
                </View>
              )}
              <Text style={styles.collapsedCount}>
                {totalCount} {totalCount === 1 ? 'Mission' : 'Missions'}
              </Text>
              <Ionicons name="chevron-up" size={20} color={COLORS.textSecondary} />
            </View>
          </View>
        </TouchableOpacity>

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
      </>
    );
  }

  // Expanded Bottom Sheet
  return (
    <Modal
      visible={expanded}
      transparent
      animationType="fade"
      onRequestClose={handleToggleExpand}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleToggleExpand}
        />

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <Ionicons name="flash" size={24} color={COLORS.accent} />
                <Text style={styles.sheetTitle}>Daily Missions</Text>
              </View>
              <View style={styles.sheetHeaderRight}>
                <AnimatedButton onPress={loadMissions} hapticFeedback={false}>
                  <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
                </AnimatedButton>
                <AnimatedButton onPress={handleToggleExpand} hapticFeedback={false}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </AnimatedButton>
              </View>
            </View>

            {/* Missions */}
            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <Text style={styles.loadingText}>Loading missions...</Text>
              ) : missions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="trophy-outline" size={48} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>No active missions</Text>
                  <Text style={styles.emptySubtext}>Check back tomorrow!</Text>
                </View>
              ) : (
                <View style={styles.missionsGrid}>
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
                            size={10}
                            color={COLORS.white}
                          />
                          <Text style={styles.rarityText}>
                            {template.rarity.toUpperCase()}
                          </Text>
                        </View>

                        {/* Icon */}
                        <View style={[styles.iconContainer, { backgroundColor: rarityColor + '20' }]}>
                          <Ionicons
                            name={getMissionIcon(template.mission_type)}
                            size={24}
                            color={rarityColor}
                          />
                        </View>

                        {/* Info */}
                        <Text style={styles.missionName} numberOfLines={1}>{template.name}</Text>
                        <Text style={styles.missionDescription} numberOfLines={2}>
                          {template.description}
                        </Text>

                        {/* Progress */}
                        <View style={styles.progressContainer}>
                          <AnimatedProgressBar
                            progress={progress}
                            height={4}
                            backgroundColor={COLORS.border}
                            fillColor={rarityColor}
                            borderRadius={2}
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
                              <Ionicons name="cash" size={12} color={COLORS.accent} />
                              <Text style={styles.rewardText}>{template.coins_reward}</Text>
                            </View>
                          )}
                          {template.xp_reward > 0 && (
                            <View style={styles.rewardItem}>
                              <Ionicons name="star" size={12} color={COLORS.primary} />
                              <Text style={styles.rewardText}>{template.xp_reward}</Text>
                            </View>
                          )}
                          {template.knowledge_points_reward > 0 && (
                            <View style={styles.rewardItem}>
                              <Ionicons name="school" size={12} color={COLORS.success} />
                              <Text style={styles.rewardText}>{template.knowledge_points_reward}</Text>
                            </View>
                          )}
                        </View>

                        {/* Action */}
                        {mission.completed && !mission.claimed ? (
                          <AnimatedButton
                            style={[styles.claimButton, { backgroundColor: rarityColor }]}
                            onPress={(event) => handleClaimReward(mission.id, event)}
                          >
                            <Ionicons name="gift" size={14} color={COLORS.white} />
                            <Text style={styles.claimButtonText}>Claim</Text>
                          </AnimatedButton>
                        ) : mission.claimed ? (
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                            <Text style={styles.completedText}>Done</Text>
                          </View>
                        ) : (
                          <View style={styles.inProgressBadge}>
                            <Text style={styles.inProgressText}>{Math.floor(progress)}%</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </GestureDetector>

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
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Collapsed Tab (CoC Style)
  collapsedTab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.lg,
    zIndex: 100,
  },
  collapsedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  collapsedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  collapsedTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  collapsedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  collapsedCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  readyBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Expanded Bottom Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: height * 0.75,
    ...SHADOWS.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sheetTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sheetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  sheetContent: {
    flex: 1,
  },

  // Missions Grid
  missionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  missionCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 2,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
    gap: 3,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xs,
  },
  missionName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  missionDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 14,
  },
  progressContainer: {
    marginBottom: SPACING.xs,
  },
  progressText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  rewards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.text,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  claimButtonText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.success,
  },
  inProgressBadge: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  inProgressText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: SPACING.xl,
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
