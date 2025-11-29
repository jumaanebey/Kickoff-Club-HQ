import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const GRID_COLS = 3;
const GRID_ROWS = 4;
const TOTAL_SLOTS = GRID_COLS * GRID_ROWS; // 12 slots
const SLOT_SIZE = (width - SPACING.lg * 4) / GRID_COLS;

interface DrillType {
  id: string;
  name: string;
  description: string;
  icon: string;
  coin_cost: number;
  growth_time_minutes: number;
  coin_reward: number;
  xp_reward: number;
  kp_reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlock_level: number;
}

interface UserDrill {
  id: string;
  user_id: string;
  drill_type: string;
  slot_number: number;
  planted_at: string;
  ready_at: string;
  collected_at: string | null;
  drill_types?: DrillType;
}

// Pulsing animation component for ready drills
function PulsingDrill({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function PracticeFieldScreen() {
  const { user, refreshProfile } = useAuth();
  const [plantedDrills, setPlantedDrills] = useState<UserDrill[]>([]);
  const [drillTypes, setDrillTypes] = useState<DrillType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadField();
    loadDrillTypes();

    // Update timer every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const loadField = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_drills')
      .select(`
        *,
        drill_types(*)
      `)
      .eq('user_id', user.id)
      .is('collected_at', null)
      .order('slot_number');

    if (!error && data) {
      setPlantedDrills(data);
    } else if (error) {
      console.error('Error loading drills:', error);
    }
  };

  const loadDrillTypes = async () => {
    const { data, error } = await supabase
      .from('drill_types')
      .select('*')
      .order('unlock_level, growth_time_minutes');

    if (!error && data) {
      setDrillTypes(data);
    }
  };

  const handleSlotPress = (slotIndex: number) => {
    const drill = plantedDrills.find((d) => d.slot_number === slotIndex);

    if (drill) {
      // Drill exists - check if ready to harvest
      const readyTime = new Date(drill.ready_at);
      const isReady = currentTime >= readyTime;

      if (isReady) {
        handleHarvest(drill);
      } else {
        // Show drill info
        const timeRemaining = getTimeRemaining(drill.ready_at);
        const drillInfo = drill.drill_types;
        Alert.alert(
          drillInfo?.name || 'Training Drill',
          `Time remaining: ${timeRemaining}\n\nRewards:\n💰 ${drillInfo?.coin_reward} coins\n⚡ ${drillInfo?.xp_reward} XP\n📚 ${drillInfo?.kp_reward} KP`
        );
      }
    } else {
      // Empty slot - plant new drill
      setSelectedSlot(slotIndex);
      setShowDrillPicker(true);
    }
  };

  const handlePlantDrill = async (drillType: DrillType) => {
    if (selectedSlot === null || !user) return;

    // Check coins
    if ((user.coins || 0) < drillType.coin_cost) {
      Alert.alert('Not Enough Coins', `This drill costs ${drillType.coin_cost} coins`);
      return;
    }

    // Check level
    if ((user.level || 1) < drillType.unlock_level) {
      Alert.alert('Level Too Low', `Unlock at level ${drillType.unlock_level}`);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Calculate ready time
      const plantedAt = new Date();
      const readyAt = new Date(plantedAt.getTime() + drillType.growth_time_minutes * 60 * 1000);

      // Insert drill
      const { error: insertError } = await supabase
        .from('user_drills')
        .insert({
          user_id: user.id,
          drill_type: drillType.id,
          slot_number: selectedSlot,
          planted_at: plantedAt.toISOString(),
          ready_at: readyAt.toISOString(),
        });

      if (insertError) {
        Alert.alert('Error', insertError.message);
        setLoading(false);
        return;
      }

      // Deduct coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ coins: (user.coins || 0) - drillType.coin_cost })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating coins:', updateError);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await loadField();
      await refreshProfile();

      setShowDrillPicker(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error planting drill:', error);
      Alert.alert('Error', 'Failed to plant drill');
    } finally {
      setLoading(false);
    }
  };

  const handleHarvest = async (drill: UserDrill) => {
    if (!user || !drill.drill_types) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);

    try {
      const drillInfo = drill.drill_types;

      // Mark as collected
      const { error: updateError } = await supabase
        .from('user_drills')
        .update({ collected_at: new Date().toISOString() })
        .eq('id', drill.id);

      if (updateError) {
        Alert.alert('Error', updateError.message);
        setLoading(false);
        return;
      }

      // Award rewards
      const { error: rewardError } = await supabase
        .from('profiles')
        .update({
          coins: (user.coins || 0) + drillInfo.coin_reward,
          xp: (user.xp || 0) + drillInfo.xp_reward,
          knowledge_points: (user.knowledge_points || 0) + drillInfo.kp_reward,
        })
        .eq('id', user.id);

      if (rewardError) {
        console.error('Error awarding rewards:', rewardError);
      }

      // Show rewards
      const rewardText = [
        `💰 +${drillInfo.coin_reward} coins`,
        `⚡ +${drillInfo.xp_reward} XP`,
        drillInfo.kp_reward > 0 ? `📚 +${drillInfo.kp_reward} KP` : null,
      ]
        .filter(Boolean)
        .join('\n');

      Alert.alert('Drill Completed!', rewardText);

      await loadField();
      await refreshProfile();
    } catch (error) {
      console.error('Error harvesting drill:', error);
      Alert.alert('Error', 'Failed to harvest drill');
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (targetTime: string): string => {
    const target = new Date(targetTime);
    const diff = target.getTime() - currentTime.getTime();

    if (diff <= 0) return 'Ready!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getProgressPercent = (plantedAt: string, readyAt: string): number => {
    const now = currentTime.getTime();
    const start = new Date(plantedAt).getTime();
    const end = new Date(readyAt).getTime();

    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getRarityColor = (rarity: string): string => {
    const colors: Record<string, string> = {
      common: COLORS.textSecondary,
      rare: '#3B82F6',
      epic: '#A855F7',
      legendary: '#FFB800',
    };
    return colors[rarity] || COLORS.primary;
  };

  const getDrillIcon = (icon: string): keyof typeof Ionicons.glyphMap => {
    return (icon as keyof typeof Ionicons.glyphMap) || 'american-football';
  };

  const isReady = (readyAt: string): boolean => {
    return currentTime >= new Date(readyAt);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Practice Field</Text>
          <Text style={styles.headerSubtitle}>Plant drills, earn rewards!</Text>
        </View>
        <View style={styles.currencyBadge}>
          <Ionicons name="logo-bitcoin" size={18} color={COLORS.accent} />
          <Text style={styles.currencyText}>{user?.coins || 0}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Field Grid */}
        <View style={styles.gridContainer}>
          {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
            const drill = plantedDrills.find((d) => d.slot_number === index);
            const row = Math.floor(index / GRID_COLS);
            const col = index % GRID_COLS;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.slot,
                  {
                    left: col * (SLOT_SIZE + SPACING.sm) + SPACING.lg,
                    top: row * (SLOT_SIZE + SPACING.sm),
                  },
                ]}
                onPress={() => handleSlotPress(index)}
                disabled={loading}
                activeOpacity={0.8}
              >
                {drill && drill.drill_types ? (
                  /* Planted Drill */
                  <View style={{ flex: 1 }}>
                    {isReady(drill.ready_at) ? (
                      <PulsingDrill>
                        <LinearGradient
                          colors={[COLORS.accent + '60', COLORS.accent + '30']}
                          style={[styles.drillCard, SHADOWS.lg]}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={36}
                            color={COLORS.accent}
                          />
                          <Text style={styles.drillName} numberOfLines={1}>
                            {drill.drill_types.name}
                          </Text>
                          <Text style={styles.readyText}>TAP TO HARVEST!</Text>
                        </LinearGradient>
                      </PulsingDrill>
                    ) : (
                      <LinearGradient
                        colors={[
                          getRarityColor(drill.drill_types.rarity) + '40',
                          '#1a1a1a',
                        ]}
                        style={[styles.drillCard, SHADOWS.md]}
                      >
                        <Ionicons
                          name={getDrillIcon(drill.drill_types.icon)}
                          size={32}
                          color={getRarityColor(drill.drill_types.rarity)}
                        />
                        <Text style={styles.drillName} numberOfLines={1}>
                          {drill.drill_types.name}
                        </Text>
                        <Text style={styles.timeText}>
                          {getTimeRemaining(drill.ready_at)}
                        </Text>

                        {/* Progress Bar */}
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${getProgressPercent(
                                  drill.planted_at,
                                  drill.ready_at
                                )}%`,
                                backgroundColor: getRarityColor(
                                  drill.drill_types.rarity
                                ),
                              },
                            ]}
                          />
                        </View>
                      </LinearGradient>
                    )}
                  </View>
                ) : (
                  /* Empty Slot */
                  <View style={styles.emptySlot}>
                    <Ionicons name="add-circle-outline" size={28} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>Plant Drill</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.secondary} />
          <Text style={styles.infoText}>
            Tap empty slots to plant drills. Harvest when ready to collect rewards!
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Drill Rarity</Text>
          <View style={styles.legendRow}>
            {[
              { label: 'Common', color: COLORS.textSecondary },
              { label: 'Rare', color: '#3B82F6' },
              { label: 'Epic', color: '#A855F7' },
              { label: 'Legendary', color: '#FFB800' },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Drill Picker Modal */}
      <Modal visible={showDrillPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Drill</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDrillPicker(false);
                  setSelectedSlot(null);
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drillList}>
              {drillTypes.map((drillType) => {
                const canAfford = (user?.coins || 0) >= drillType.coin_cost;
                const levelOk = (user?.level || 1) >= drillType.unlock_level;
                const locked = !canAfford || !levelOk;
                const rarityColor = getRarityColor(drillType.rarity);

                return (
                  <TouchableOpacity
                    key={drillType.id}
                    style={[styles.drillOption, locked && styles.drillOptionLocked]}
                    onPress={() => handlePlantDrill(drillType)}
                    disabled={locked || loading}
                  >
                    <LinearGradient
                      colors={[rarityColor + '20', '#1a1a1a']}
                      style={styles.drillOptionGradient}
                    >
                      {/* Left Side */}
                      <View style={styles.drillOptionLeft}>
                        <View
                          style={[
                            styles.drillIconContainer,
                            { backgroundColor: rarityColor + '30' },
                          ]}
                        >
                          <Ionicons
                            name={getDrillIcon(drillType.icon)}
                            size={36}
                            color={rarityColor}
                          />
                        </View>

                        <View style={styles.drillInfo}>
                          <View style={styles.drillNameRow}>
                            <Text style={styles.drillOptionName}>
                              {drillType.name}
                            </Text>
                            <View
                              style={[
                                styles.rarityBadge,
                                { backgroundColor: rarityColor },
                              ]}
                            >
                              <Text style={styles.rarityText}>
                                {drillType.rarity.toUpperCase()}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.drillDescription} numberOfLines={2}>
                            {drillType.description}
                          </Text>

                          {/* Rewards */}
                          <View style={styles.rewardRow}>
                            <View style={styles.rewardItem}>
                              <Ionicons name="logo-bitcoin" size={14} color={COLORS.accent} />
                              <Text style={styles.rewardText}>+{drillType.coin_reward}</Text>
                            </View>
                            <View style={styles.rewardItem}>
                              <Ionicons name="star" size={14} color={COLORS.primary} />
                              <Text style={styles.rewardText}>+{drillType.xp_reward} XP</Text>
                            </View>
                            {drillType.kp_reward > 0 && (
                              <View style={styles.rewardItem}>
                                <Ionicons name="school" size={14} color={COLORS.secondary} />
                                <Text style={styles.rewardText}>+{drillType.kp_reward} KP</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>

                      {/* Right Side */}
                      <View style={styles.drillOptionRight}>
                        <View style={styles.costBadge}>
                          <Ionicons name="logo-bitcoin" size={14} color={COLORS.accent} />
                          <Text style={styles.costText}>{drillType.coin_cost}</Text>
                        </View>

                        <View style={styles.timeBadge}>
                          <Ionicons name="time" size={14} color={COLORS.textMuted} />
                          <Text style={styles.timeValue}>
                            {drillType.growth_time_minutes < 60
                              ? `${drillType.growth_time_minutes}m`
                              : `${Math.floor(drillType.growth_time_minutes / 60)}h`}
                          </Text>
                        </View>

                        {!levelOk && (
                          <Text style={styles.levelRequired}>Lv.{drillType.unlock_level}</Text>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  currencyText: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: FONTS.sizes.md,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    position: 'relative',
    height: GRID_ROWS * (SLOT_SIZE + SPACING.sm) + SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  slot: {
    position: 'absolute',
    width: SLOT_SIZE,
    height: SLOT_SIZE,
  },
  emptySlot: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight + '40',
  },
  emptyText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  drillCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  drillName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
  },
  readyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 4,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 18,
  },
  legendContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
  },
  legendTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  drillList: {
    padding: SPACING.lg,
  },
  drillOption: {
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  drillOptionLocked: {
    opacity: 0.5,
  },
  drillOptionGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  drillOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drillIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  drillInfo: {
    flex: 1,
  },
  drillNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  drillOptionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  drillDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  rewardRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rewardText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  drillOptionRight: {
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: 4,
  },
  costText: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: FONTS.sizes.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeValue: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  levelRequired: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
