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
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const GRID_COLS = 3;
const GRID_ROWS = 4;
const TOTAL_SLOTS = GRID_COLS * GRID_ROWS; // 12 slots
const SLOT_SIZE = (width - SPACING.lg * 4) / GRID_COLS;

interface DrillTemplate {
  id: string;
  name: string;
  drill_type: string;
  duration_minutes: number;
  energy_cost: number;
  skill_points: number;
  coins: number;
  xp: number;
  level_required: number;
  icon: string;
  description: string;
}

interface PlantedDrill {
  id: string;
  field_slot: number;
  planted_at: string;
  ready_at: string;
  wither_at: string;
  state: 'training' | 'ready' | 'withered';
  drill_template_id: string;
  template?: DrillTemplate;
}

export default function PracticeFieldScreen() {
  const { user, refreshProfile } = useAuth();
  const [plantedDrills, setPlantedDrills] = useState<PlantedDrill[]>([]);
  const [drillTemplates, setDrillTemplates] = useState<DrillTemplate[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadField();
    loadDrillTemplates();

    // Refresh field every 10 seconds to update timers
    const interval = setInterval(loadField, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const loadField = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('training_drills')
      .select(`
        *,
        template:drill_templates(*)
      `)
      .eq('user_id', user.id)
      .is('harvested_at', null);

    if (!error && data) {
      setPlantedDrills(
        data.map((d) => ({
          ...d,
          template: Array.isArray(d.template) ? d.template[0] : d.template,
        }))
      );
    }
  };

  const loadDrillTemplates = async () => {
    const { data, error } = await supabase
      .from('drill_templates')
      .select('*')
      .order('duration_minutes');

    if (!error && data) {
      setDrillTemplates(data);
    }
  };

  const handleSlotPress = (slotIndex: number) => {
    const drill = plantedDrills.find((d) => d.field_slot === slotIndex);

    if (drill) {
      // Drill exists - try to harvest
      if (drill.state === 'ready') {
        handleHarvest(drill);
      } else if (drill.state === 'withered') {
        handleRemoveWithered(drill);
      } else {
        // Show drill info
        Alert.alert(
          drill.template?.name || 'Training',
          `Time remaining: ${getTimeRemaining(drill.ready_at)}`
        );
      }
    } else {
      // Empty slot - plant new drill
      setSelectedSlot(slotIndex);
      setShowDrillPicker(true);
    }
  };

  const handlePlantDrill = async (template: DrillTemplate) => {
    if (selectedSlot === null || !user) return;

    // Check energy
    if ((user.energy || 0) < template.energy_cost) {
      Alert.alert('Not Enough Energy', `This drill requires ${template.energy_cost} energy`);
      return;
    }

    // Check level
    if ((user.level || 1) < template.level_required) {
      Alert.alert('Level Too Low', `Unlock at level ${template.level_required}`);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { data, error } = await supabase.rpc('plant_drill', {
      p_user_id: user.id,
      p_drill_template_id: template.id,
      p_field_slot: selectedSlot,
    });

    if (error || data?.error) {
      Alert.alert('Error', error?.message || data?.error);
    } else {
      await loadField();
      await refreshProfile();
    }

    setLoading(false);
    setShowDrillPicker(false);
    setSelectedSlot(null);
  };

  const handleHarvest = async (drill: PlantedDrill) => {
    if (!user) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);

    const { data, error } = await supabase.rpc('harvest_drill', {
      p_drill_id: drill.id,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data?.error) {
      Alert.alert('Error', data.error);
    } else if (data?.withered) {
      Alert.alert('Drill Withered', 'This drill expired. No rewards earned.');
    } else {
      // Show rewards
      const rewardText = [
        `+${data.coins} coins`,
        `+${data.skill_points} KP`,
        `+${data.xp} XP`,
      ].join('\n');

      Alert.alert('Drill Completed!', rewardText);

      await loadField();
      await refreshProfile();
    }

    setLoading(false);
  };

  const handleRemoveWithered = async (drill: PlantedDrill) => {
    await supabase.rpc('harvest_drill', { p_drill_id: drill.id });
    await loadField();
  };

  const getTimeRemaining = (targetTime: string): string => {
    const now = new Date();
    const target = new Date(targetTime);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return 'Ready!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercent = (plantedAt: string, readyAt: string): number => {
    const now = Date.now();
    const start = new Date(plantedAt).getTime();
    const end = new Date(readyAt).getTime();

    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDrillIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      passing: 'football',
      shooting: 'flame',
      defense: 'shield',
      fitness: 'flash',
      tactics: 'map',
    };
    return icons[type] || 'football';
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      passing: COLORS.primary,
      shooting: '#FF4444',
      defense: COLORS.secondary,
      fitness: '#FFB800',
      tactics: '#9B59B6',
    };
    return colors[type] || COLORS.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Practice Field</Text>
          <Text style={styles.headerSubtitle}>Plant drills and train your skills</Text>
        </View>
        <View style={styles.energyBadge}>
          <Ionicons name="flash" size={18} color={COLORS.primary} />
          <Text style={styles.energyText}>{user?.energy || 0}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Field Grid */}
        <View style={styles.gridContainer}>
          {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
            const drill = plantedDrills.find((d) => d.field_slot === index);
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
              >
                {drill ? (
                  /* Planted Drill */
                  <LinearGradient
                    colors={
                      drill.state === 'withered'
                        ? ['#444', '#222']
                        : drill.state === 'ready'
                        ? [COLORS.accent + '40', COLORS.accent + '20']
                        : [getTypeColor(drill.template?.drill_type || '') + '40', '#1a1a1a']
                    }
                    style={[styles.drillCard, SHADOWS.md]}
                  >
                    <Ionicons
                      name={
                        drill.state === 'withered'
                          ? 'close-circle'
                          : drill.state === 'ready'
                          ? 'checkmark-circle'
                          : getDrillIcon(drill.template?.drill_type || '')
                      }
                      size={32}
                      color={
                        drill.state === 'withered'
                          ? COLORS.textMuted
                          : drill.state === 'ready'
                          ? COLORS.accent
                          : getTypeColor(drill.template?.drill_type || '')
                      }
                    />

                    <Text style={styles.drillName} numberOfLines={1}>
                      {drill.template?.name}
                    </Text>

                    {drill.state === 'training' && (
                      <>
                        <Text style={styles.timeText}>
                          {getTimeRemaining(drill.ready_at)}
                        </Text>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${getProgressPercent(
                                  drill.planted_at,
                                  drill.ready_at
                                )}%`,
                              },
                            ]}
                          />
                        </View>
                      </>
                    )}

                    {drill.state === 'ready' && (
                      <Text style={styles.readyText}>TAP TO HARVEST!</Text>
                    )}

                    {drill.state === 'withered' && (
                      <Text style={styles.witheredText}>Expired</Text>
                    )}
                  </LinearGradient>
                ) : (
                  /* Empty Slot */
                  <View style={styles.emptySlot}>
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.textMuted} />
                    <Text style={styles.emptyText}>Plant</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            Tap empty slots to plant drills. Harvest when ready or they'll wither!
          </Text>
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
              {drillTemplates.map((template) => {
                const canAfford = (user?.energy || 0) >= template.energy_cost;
                const levelOk = (user?.level || 1) >= template.level_required;
                const locked = !canAfford || !levelOk;

                return (
                  <TouchableOpacity
                    key={template.id}
                    style={[styles.drillOption, locked && styles.drillOptionLocked]}
                    onPress={() => handlePlantDrill(template)}
                    disabled={locked || loading}
                  >
                    <LinearGradient
                      colors={[getTypeColor(template.drill_type) + '20', '#1a1a1a']}
                      style={styles.drillOptionGradient}
                    >
                      <View style={styles.drillOptionLeft}>
                        <Ionicons
                          name={getDrillIcon(template.drill_type)}
                          size={40}
                          color={getTypeColor(template.drill_type)}
                        />
                        <View style={styles.drillInfo}>
                          <Text style={styles.drillOptionName}>{template.name}</Text>
                          <Text style={styles.drillDescription}>{template.description}</Text>

                          <View style={styles.rewardRow}>
                            <Text style={styles.rewardText}>+{template.coins}💰</Text>
                            <Text style={styles.rewardText}>+{template.skill_points} KP</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.drillOptionRight}>
                        <View style={styles.energyCost}>
                          <Ionicons name="flash" size={16} color={COLORS.primary} />
                          <Text style={styles.energyCostText}>{template.energy_cost}</Text>
                        </View>
                        {!levelOk && (
                          <Text style={styles.levelRequired}>Lv.{template.level_required}</Text>
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
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  energyText: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    position: 'relative',
    height: GRID_ROWS * (SLOT_SIZE + SPACING.sm) + SPACING.lg,
    marginTop: SPACING.md,
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
    backgroundColor: COLORS.backgroundLight,
  },
  emptyText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
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
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  readyText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 4,
  },
  witheredText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
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
    maxHeight: '80%',
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
  drillInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  drillOptionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  drillDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rewardRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: SPACING.sm,
  },
  rewardText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
  },
  drillOptionRight: {
    alignItems: 'flex-end',
  },
  energyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  energyCostText: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  levelRequired: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
