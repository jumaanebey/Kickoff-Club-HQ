import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../context/AuthContext';
import {
  getUserSquadUnits,
  startTrainingSession,
  completeTrainingSession,
  getUserSeason,
  getUpcomingGames,
} from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { UserSquadUnit, UserSeason, UnitType } from '../../types';

const { width } = Dimensions.get('window');

interface UnitConfig {
  type: UnitType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const UNIT_CONFIGS: UnitConfig[] = [
  {
    type: 'offensive_line',
    name: 'Offensive Line',
    icon: 'shield-checkmark',
    color: '#FF6A00',
    description: 'Dominate the trenches',
  },
  {
    type: 'skill_positions',
    name: 'Skill Positions',
    icon: 'flash',
    color: '#1F6A3E',
    description: 'QB, RB, WR, TE',
  },
  {
    type: 'defensive_line',
    name: 'Defensive Line',
    icon: 'shield-half',
    color: '#C41E3A',
    description: 'Unstoppable pass rush',
  },
  {
    type: 'secondary',
    name: 'Secondary',
    icon: 'eye',
    color: '#13274F',
    description: 'Lock down receivers',
  },
  {
    type: 'special_teams',
    name: 'Special Teams',
    icon: 'football',
    color: '#FFB81C',
    description: 'Perfect execution',
  },
];

const TRAINING_DURATIONS = [
  { minutes: 30, label: '30 min', energy: 5, readiness: 10 },
  { minutes: 60, label: '1 hour', energy: 10, readiness: 20 },
  { minutes: 120, label: '2 hours', energy: 15, readiness: 35 },
];

export default function PracticeFieldScreen() {
  const { user, refreshProfile } = useAuth();
  const [units, setUnits] = useState<UserSquadUnit[]>([]);
  const [season, setSeason] = useState<UserSeason | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<UnitType | null>(null);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [squadData, seasonData] = await Promise.all([
        getUserSquadUnits(user.id),
        getUserSeason(user.id),
      ]);

      setUnits(squadData);
      setSeason(seasonData);
    } catch (error) {
      console.error('Error loading practice field:', error);
      Alert.alert('Error', 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = (unitType: UnitType) => {
    const unit = units.find((u) => u.unit_type === unitType);

    if (!unit) return;

    if (unit.is_training) {
      Alert.alert('Already Training', 'This unit is currently in a training session');
      return;
    }

    if (unit.readiness >= 100) {
      Alert.alert('Fully Ready', 'This unit is at maximum readiness. Complete a match to reset.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedUnit(unitType);
    setShowTrainingModal(true);
  };

  const startTraining = async (durationMinutes: number) => {
    if (!user || !selectedUnit) return;

    try {
      const result = await startTrainingSession(user.id, selectedUnit, durationMinutes);

      if (result.error) {
        if (result.error === 'insufficient_energy') {
          Alert.alert('Not Enough Energy', 'You need more energy to start this training session');
        } else {
          Alert.alert('Error', result.error);
        }
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Training Started!', `Your ${selectedUnit.replace('_', ' ')} unit is now training.`);

      setShowTrainingModal(false);
      setSelectedUnit(null);
      await refreshProfile();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to start training session');
    }
  };

  const handleCompleteTraining = async (sessionId: string, unitType: UnitType) => {
    if (!user) return;

    try {
      const result = await completeTrainingSession(sessionId);

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Training Complete!',
        `Readiness: ${result.new_readiness}%\nCoins: +${result.coins_earned}\nXP: +${result.xp_earned}`
      );

      await refreshProfile();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete training');
    }
  };

  const getTimeRemaining = (completesAt: string): string => {
    const target = new Date(completesAt);
    const diff = target.getTime() - currentTime.getTime();

    if (diff <= 0) return 'Ready!';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getAverageReadiness = (): number => {
    if (units.length === 0) return 0;
    const sum = units.reduce((acc, unit) => acc + unit.readiness, 0);
    return Math.floor(sum / units.length);
  };

  const canPlayMatches = (): boolean => {
    const avgReadiness = getAverageReadiness();
    return avgReadiness >= (season?.min_readiness_for_matches || 60);
  };

  const renderUnitCard = (config: UnitConfig) => {
    const unit = units.find((u) => u.unit_type === config.type);

    if (!unit) {
      return (
        <View key={config.type} style={[styles.unitCard, styles.unitCardLocked]}>
          <Ionicons name="lock-closed" size={32} color={COLORS.textMuted} />
          <Text style={styles.unitLockedText}>Locked</Text>
        </View>
      );
    }

    const isTraining = unit.is_training;
    const isComplete = isTraining && unit.training_completes_at
      ? new Date(unit.training_completes_at) <= currentTime
      : false;
    const timeRemaining = isTraining && unit.training_completes_at
      ? getTimeRemaining(unit.training_completes_at)
      : '';

    return (
      <TouchableOpacity
        key={config.type}
        style={[styles.unitCard, { borderColor: config.color }]}
        onPress={() => {
          if (isComplete && unit.training_session_id) {
            handleCompleteTraining(unit.training_session_id, config.type);
          } else if (!isTraining) {
            handleStartTraining(config.type);
          }
        }}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.unitHeader}>
          <View style={[styles.unitIconContainer, { backgroundColor: config.color + '20' }]}>
            <Ionicons name={config.icon as any} size={28} color={config.color} />
          </View>
          <View style={styles.unitInfo}>
            <Text style={styles.unitName}>{config.name}</Text>
            <Text style={styles.unitDescription}>{config.description}</Text>
          </View>
        </View>

        {/* Readiness Bar */}
        <View style={styles.readinessContainer}>
          <View style={styles.readinessHeader}>
            <Text style={styles.readinessLabel}>Team Readiness</Text>
            <Text style={[styles.readinessValue, { color: config.color }]}>
              {unit.readiness}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${unit.readiness}%`,
                  backgroundColor: config.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Status / Action */}
        {isComplete ? (
          <View style={[styles.statusContainer, styles.statusComplete]}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.statusCompleteText}>Tap to Collect!</Text>
          </View>
        ) : isTraining ? (
          <View style={[styles.statusContainer, styles.statusTraining]}>
            <Ionicons name="time" size={18} color={config.color} />
            <Text style={[styles.statusTrainingText, { color: config.color }]}>
              {timeRemaining}
            </Text>
          </View>
        ) : (
          <View style={[styles.actionButton, { backgroundColor: config.color }]}>
            <Ionicons name="barbell" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Start Training</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.unitStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{unit.level}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>{unit.total_training_sessions}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.seasonInfo}>
          <Text style={styles.seasonTitle}>Season {season?.season_number || 1}</Text>
          <Text style={styles.seasonPhase}>
            {season?.phase.replace('_', ' ').toUpperCase() || 'OFF SEASON'}
          </Text>
        </View>
        <View style={styles.recordContainer}>
          <Text style={styles.recordText}>
            {season?.games_won || 0}W - {season?.games_lost || 0}L
          </Text>
        </View>
      </View>

      {/* Team Readiness Overview */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
          <Text style={styles.overviewTitle}>Team Readiness</Text>
        </View>
        <Text style={styles.overviewValue}>{getAverageReadiness()}%</Text>
        <View style={styles.overviewProgressBar}>
          <View
            style={[
              styles.overviewProgressFill,
              { width: `${getAverageReadiness()}%` },
            ]}
          />
        </View>
        {canPlayMatches() ? (
          <TouchableOpacity
            style={styles.matchButton}
            onPress={() => Alert.alert('Matches', 'Match simulation coming soon!')}
          >
            <Ionicons name="play-circle" size={20} color={COLORS.white} />
            <Text style={styles.matchButtonText}>Play Match</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.matchRequirement}>
            Need {season?.min_readiness_for_matches || 60}% avg readiness to play matches
          </Text>
        )}
      </View>

      {/* Unit Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadData} tintColor={COLORS.primary} />
        }
      >
        {UNIT_CONFIGS.map(renderUnitCard)}
      </ScrollView>

      {/* Training Duration Modal */}
      <Modal
        visible={showTrainingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTrainingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Training Duration</Text>
              <TouchableOpacity onPress={() => setShowTrainingModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {TRAINING_DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration.minutes}
                style={styles.durationOption}
                onPress={() => startTraining(duration.minutes)}
              >
                <View style={styles.durationInfo}>
                  <Text style={styles.durationLabel}>{duration.label}</Text>
                  <Text style={styles.durationDetails}>
                    +{duration.readiness}% Readiness
                  </Text>
                </View>
                <View style={styles.durationCost}>
                  <Ionicons name="flash" size={16} color={COLORS.accent} />
                  <Text style={styles.durationCostText}>{duration.energy} Energy</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.modalFooter}>
              <View style={styles.energyDisplay}>
                <Ionicons name="flash" size={20} color={COLORS.accent} />
                <Text style={styles.energyText}>
                  {user?.energy || 0} / 100 Energy
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: COLORS.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  seasonInfo: {},
  seasonTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seasonPhase: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  recordContainer: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  recordText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  overviewCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.primary + '40',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  overviewTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  overviewValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: SPACING.sm,
  },
  overviewProgressBar: {
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  overviewProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  matchButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  matchRequirement: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  unitCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  unitCardLocked: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
    opacity: 0.5,
  },
  unitLockedText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  unitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  unitInfo: {
    flex: 1,
  },
  unitName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  unitDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  readinessContainer: {
    marginBottom: SPACING.md,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  readinessLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  readinessValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  statusComplete: {
    backgroundColor: COLORS.success + '20',
  },
  statusCompleteText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: SPACING.sm,
  },
  statusTraining: {
    backgroundColor: COLORS.border,
  },
  statusTrainingText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  unitStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  durationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  durationInfo: {},
  durationLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  durationDetails: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  durationCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationCostText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  modalFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  energyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});
