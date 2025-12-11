import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton, AnimatedCountUp, CelebrationBurst } from '../../components/animations';
import { playMatch, getMatchStats } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { Toast, showToast } from '../../components/Toast';

interface MatchResult {
  won: boolean;
  user_score: number;
  opponent_score: number;
  opponent_level: number;
  coins_earned: number;
  xp_earned: number;
  kp_earned: number;
}

export default function MatchScreen() {
  const { user, refreshProfile } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [celebrationAnimations, setCelebrationAnimations] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);

  React.useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const matchStats = await getMatchStats(user.id);
      setStats(matchStats);
    } catch (error) {
      console.error('Error loading match stats:', error);
    }
  };

  const handlePlayMatch = async () => {
    if (!user) return;

    if ((user.energy || 0) < 10) {
      showToast(setToasts, 'You need 10 energy to play a match', 'error');
      return;
    }

    try {
      setPlaying(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const result = await playMatch(user.id);

      if (result.error) {
        showToast(setToasts, result.error, 'error');
        setPlaying(false);
        return;
      }

      // Simulate 3-second match animation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setMatchResult(result);

      // Trigger celebration burst for victory
      if (result.won) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCelebrationAnimations([{
          id: Date.now().toString(),
          x: width / 2,
          y: height / 3,
        }]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      await refreshProfile();
      await loadStats();
    } catch (error) {
      showToast(setToasts, error instanceof Error ? error.message : 'Failed to play match', 'error');
    } finally {
      setPlaying(false);
    }
  };

  const handlePlayAgain = () => {
    setMatchResult(null);
  };

  if (playing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Simulating match...</Text>
          <Text style={styles.loadingSubtext}>Calculating plays and scores</Text>
        </View>

        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
          />
        ))}
      </SafeAreaView>
    );
  }

  if (matchResult) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          {/* Result Header */}
          <LinearGradient
            colors={matchResult.won ? [COLORS.success, COLORS.success + '80'] : [COLORS.error, COLORS.error + '80']}
            style={styles.resultHeader}
          >
            <Ionicons
              name={matchResult.won ? 'trophy' : 'close-circle'}
              size={64}
              color={COLORS.white}
            />
            <Text style={styles.resultTitle}>
              {matchResult.won ? 'VICTORY!' : 'DEFEAT'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {matchResult.won ? 'Great game!' : 'Better luck next time'}
            </Text>
          </LinearGradient>

          {/* Score Board */}
          <View style={styles.scoreboard}>
            <View style={styles.scoreColumn}>
              <Text style={styles.teamLabel}>YOU</Text>
              <AnimatedCountUp
                endValue={matchResult.user_score}
                duration={1500}
                delay={200}
                style={[styles.scoreText, matchResult.won && styles.winningScore]}
              />
            </View>

            <View style={styles.scoreDivider}>
              <Text style={styles.scoreVs}>VS</Text>
            </View>

            <View style={styles.scoreColumn}>
              <Text style={styles.teamLabel}>OPPONENT</Text>
              <AnimatedCountUp
                endValue={matchResult.opponent_score}
                duration={1500}
                delay={200}
                style={[styles.scoreText, !matchResult.won && styles.winningScore]}
              />
              <Text style={styles.opponentLevel}>Level {matchResult.opponent_level}</Text>
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>Rewards Earned</Text>
            <View style={styles.rewardsList}>
              <View style={styles.rewardItem}>
                <Ionicons name="logo-bitcoin" size={24} color={COLORS.accent} />
                <AnimatedCountUp
                  endValue={matchResult.coins_earned}
                  duration={1000}
                  delay={800}
                  prefix="+"
                  suffix=" Coins"
                  style={styles.rewardText}
                />
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="trending-up" size={24} color={COLORS.secondary} />
                <AnimatedCountUp
                  endValue={matchResult.xp_earned}
                  duration={1000}
                  delay={1000}
                  prefix="+"
                  suffix=" XP"
                  style={styles.rewardText}
                />
              </View>
              {matchResult.kp_earned > 0 && (
                <View style={styles.rewardItem}>
                  <Ionicons name="school" size={24} color={COLORS.primary} />
                  <AnimatedCountUp
                    endValue={matchResult.kp_earned}
                    duration={1000}
                    delay={1200}
                    prefix="+"
                    suffix=" KP"
                    style={styles.rewardText}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <AnimatedButton style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Ionicons name="refresh" size={20} color={COLORS.white} />
            <Text style={styles.playAgainText}>Play Again</Text>
          </AnimatedButton>
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

        {/* Toast Notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
          />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Match Simulation</Text>
          <Text style={styles.headerSubtitle}>Test your squad against AI opponents</Text>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, SHADOWS.sm]}>
              <Text style={styles.statValue}>{stats.totalMatches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={[styles.statCard, SHADOWS.sm]}>
              <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={[styles.statCard, SHADOWS.sm]}>
              <Text style={[styles.statValue, { color: COLORS.error }]}>{stats.losses}</Text>
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={[styles.statCard, SHADOWS.sm]}>
              <Text style={styles.statValue}>{stats.winRate.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        )}

        {/* Team Info */}
        <View style={styles.teamInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="trending-up" size={20} color={COLORS.secondary} />
            <Text style={styles.infoLabel}>Team Readiness</Text>
            <Text style={styles.infoValue}>{user?.team_readiness || 50}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="flash" size={20} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Energy Available</Text>
            <Text style={styles.infoValue}>{user?.energy || 0} / 100</Text>
          </View>
        </View>

        {/* Play Match Button */}
        <AnimatedButton
          style={[
            styles.playButton,
            (user?.energy || 0) < 20 && styles.playButtonDisabled,
          ]}
          onPress={handlePlayMatch}
          disabled={(user?.energy || 0) < 20}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.playButtonGradient}
          >
            <Ionicons name="football-ball" size={28} color={COLORS.white} />
            <Text style={styles.playButtonText}>Play Match (10 Energy)</Text>
          </LinearGradient>
        </AnimatedButton>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.helpText}>
            Each match costs 20 energy. Win probability is based on your team readiness vs opponent level.
            Win to earn 50 coins, 25 XP, and 10 KP!
          </Text>
        </View>
      </ScrollView>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
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
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  teamInfo: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  playButton: {
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  playButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  helpText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  loadingSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  resultContainer: {
    padding: SPACING.lg,
  },
  resultHeader: {
    alignItems: 'center',
    padding: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: FONTS.sizes.xxl * 1.5,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.md,
  },
  resultSubtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.white,
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  scoreboard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  scoreText: {
    fontSize: FONTS.sizes.xxl * 2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  winningScore: {
    color: COLORS.success,
  },
  opponentLevel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  scoreDivider: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  scoreVs: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  rewardsContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  rewardsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  rewardsList: {
    gap: SPACING.md,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
  },
  playAgainText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
});
