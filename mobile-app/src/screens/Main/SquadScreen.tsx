import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../context/AuthContext';
import { startTraining, collectTraining, getActiveTrainingSessions } from '../../services/supabase';
import { CelebrationBurst, AnimatedProgressBar } from '../../components/animations';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface TrainingSession {
  id: string;
  unit_type: string;
  started_at: string;
  completes_at: string;
  completed: boolean;
  collected: boolean;
}

const UNIT_TYPES = [
  { id: 'offensive-line', name: 'Offensive Line', icon: 'shield' },
  { id: 'running-back', name: 'Running Back', icon: 'flash' },
  { id: 'wide-receiver', name: 'Wide Receiver', icon: 'navigate' },
  { id: 'linebacker', name: 'Linebacker', icon: 'fitness' },
  { id: 'defensive-back', name: 'Defensive Back', icon: 'eye' },
];

export default function SquadScreen() {
  const { user, refreshProfile } = useAuth();
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainingUnit, setTrainingUnit] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});
  const [celebrationAnimations, setCelebrationAnimations] = useState<Array<{ id: string; x: number; y: number }>>([]);

  useEffect(() => {
    loadTrainingSessions();
  }, [user]);

  useEffect(() => {
    // Update countdown timers every second
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: string } = {};

      trainingSessions.forEach((session) => {
        if (!session.completed) {
          const now = new Date();
          const completes = new Date(session.completes_at);
          const diff = completes.getTime() - now.getTime();

          if (diff > 0) {
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            newTimeRemaining[session.id] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          } else {
            newTimeRemaining[session.id] = 'Ready!';
          }
        }
      });

      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [trainingSessions]);

  const loadTrainingSessions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const sessions = await getActiveTrainingSessions(user.id);
      setTrainingSessions(sessions);
    } catch (error) {
      console.error('Error loading training sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async (unitType: string) => {
    if (!user) return;

    if ((user.energy || 0) < 5) {
      Alert.alert('Not Enough Energy', 'You need 5 energy to start training.');
      return;
    }

    try {
      setTrainingUnit(unitType);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await startTraining(user.id, unitType);

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      Alert.alert('Training Started!', `Training will complete in 5 minutes.`);
      await refreshProfile();
      await loadTrainingSessions();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to start training');
    } finally {
      setTrainingUnit(null);
    }
  };

  const handleCollectTraining = async (sessionId: string, unitType: string) => {
    try {
      // Trigger celebration animation at center of screen
      const newCelebration = {
        id: sessionId,
        x: width / 2,
        y: height / 2 - 100,
      };

      setCelebrationAnimations((prev) => [...prev, newCelebration]);

      const result = await collectTraining(sessionId);

      if (result.error) {
        Alert.alert('Error', result.error);
        setCelebrationAnimations((prev) => prev.filter((c) => c.id !== sessionId));
        return;
      }

      await refreshProfile();
      await loadTrainingSessions();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to collect training');
      setCelebrationAnimations((prev) => prev.filter((c) => c.id !== sessionId));
    }
  };

  const getUnitState = (unitType: string) => {
    const session = trainingSessions.find((s) => s.unit_type === unitType && !s.collected);

    if (!session) return 'idle';
    if (session.completed || new Date(session.completes_at) <= new Date()) return 'ready';
    return 'training';
  };

  const getUnitSession = (unitType: string) => {
    return trainingSessions.find((s) => s.unit_type === unitType && !s.collected);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Squad</Text>
          <Text style={styles.headerSubtitle}>Train your units to boost team readiness</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={18} color={COLORS.primary} />
            <Text style={styles.statText}>{user?.energy || 0} / 100</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={18} color={COLORS.secondary} />
            <Text style={styles.statText}>{user?.team_readiness || 50}</Text>
          </View>
        </View>
      </View>

      {/* Team Readiness Bar */}
      <View style={styles.readinessContainer}>
        <Text style={styles.readinessLabel}>Team Readiness</Text>
        <AnimatedProgressBar
          progress={Math.min(((user?.team_readiness || 50) / 200) * 100, 100)}
          height={8}
          backgroundColor={COLORS.border}
          fillColor={COLORS.success}
          borderRadius={4}
          animationType="spring"
        />
        <Text style={styles.readinessText}>{user?.team_readiness || 50} / 200</Text>
      </View>

      {/* Unit Cards */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {UNIT_TYPES.map((unit) => {
          const state = getUnitState(unit.id);
          const session = getUnitSession(unit.id);
          const isTraining = trainingUnit === unit.id;

          return (
            <View key={unit.id} style={[styles.unitCard, SHADOWS.md]}>
              {/* Unit Icon Placeholder */}
              <View style={styles.unitImageContainer}>
                <View style={[styles.iconPlaceholder, state === 'ready' && styles.iconPlaceholderReady]}>
                  <Ionicons
                    name={unit.icon as any}
                    size={48}
                    color={state === 'ready' ? COLORS.success : state === 'training' ? COLORS.secondary : COLORS.textSecondary}
                  />
                </View>
                {state === 'ready' && (
                  <View style={styles.readyBadge}>
                    <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
                  </View>
                )}
              </View>

              {/* Unit Info */}
              <View style={styles.unitInfo}>
                <Text style={styles.unitName}>{unit.name}</Text>
                <Text style={styles.unitType}>
                  {state === 'idle' && 'Ready to train'}
                  {state === 'training' && `Training: ${timeRemaining[session?.id || ''] || '...'}`}
                  {state === 'ready' && 'Training complete!'}
                </Text>

                {/* Action Button */}
                {state === 'idle' && (
                  <TouchableOpacity
                    style={[styles.trainButton, isTraining && styles.trainButtonDisabled]}
                    onPress={() => handleStartTraining(unit.id)}
                    disabled={isTraining}
                  >
                    {isTraining ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <>
                        <Ionicons name="fitness" size={18} color={COLORS.white} />
                        <Text style={styles.trainButtonText}>Train (5 Energy)</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}

                {state === 'training' && (
                  <View style={styles.trainingIndicator}>
                    <ActivityIndicator size="small" color={COLORS.secondary} />
                    <Text style={styles.trainingText}>In Progress...</Text>
                  </View>
                )}

                {state === 'ready' && session && (
                  <TouchableOpacity
                    style={styles.collectButton}
                    onPress={() => handleCollectTraining(session.id, unit.id)}
                  >
                    <Ionicons name="star" size={18} color={COLORS.white} />
                    <Text style={styles.collectButtonText}>Collect (+5 Readiness)</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.helpText}>
            Training takes 5 minutes and costs 5 energy. Collect completed training to increase your team readiness!
          </Text>
        </View>
      </ScrollView>

      {/* Celebration Animations */}
      {celebrationAnimations.map((celebration) => (
        <CelebrationBurst
          key={celebration.id}
          x={celebration.x}
          y={celebration.y}
          onComplete={() => {
            setCelebrationAnimations((prev) => prev.filter((c) => c.id !== celebration.id));
          }}
        />
      ))}
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
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  statText: {
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: FONTS.sizes.sm,
  },
  readinessContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  readinessLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  readinessBar: {
    height: 12,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  readinessFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  readinessText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  unitCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  unitImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
    marginRight: SPACING.md,
  },
  unitImage: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  iconPlaceholderReady: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.background,
  },
  readyBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  unitInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  unitName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  unitType: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  trainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  trainButtonDisabled: {
    opacity: 0.6,
  },
  trainButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 6,
    fontSize: FONTS.sizes.sm,
  },
  trainingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  trainingText: {
    color: COLORS.textSecondary,
    marginLeft: 8,
    fontSize: FONTS.sizes.sm,
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  collectButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 6,
    fontSize: FONTS.sizes.sm,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.md,
  },
  helpText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});
