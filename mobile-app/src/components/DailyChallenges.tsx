import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { supabase, addCoins } from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'lessons' | 'predictions' | 'streak' | 'login';
  target: number;
  progress: number;
  completed: boolean;
}

export default function DailyChallenges() {
  const { user, refreshProfile } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, [user]);

  const loadChallenges = async () => {
    if (!user) return;

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Check user's progress for today
    const { data: lessonsToday } = await supabase
      .from('course_progress')
      .select('completed_lessons')
      .eq('user_id', user.id)
      .gte('last_watched_at', today);

    const lessonsWatched = lessonsToday?.reduce(
      (acc, curr) => acc + (curr.completed_lessons?.length || 0),
      0
    ) || 0;

    const { data: predictionsToday } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', today);

    const predictionsMade = predictionsToday?.length || 0;

    // Define today's challenges
    const todaysChallenges: Challenge[] = [
      {
        id: 'daily-login',
        title: 'Daily Check-in',
        description: 'Log in today',
        reward: 5,
        type: 'login',
        target: 1,
        progress: 1, // Already logged in
        completed: true,
      },
      {
        id: 'watch-2-lessons',
        title: 'Eager Learner',
        description: 'Watch 2 lessons today',
        reward: 20,
        type: 'lessons',
        target: 2,
        progress: Math.min(lessonsWatched, 2),
        completed: lessonsWatched >= 2,
      },
      {
        id: 'make-prediction',
        title: 'Fortune Teller',
        description: 'Make 1 prediction',
        reward: 10,
        type: 'predictions',
        target: 1,
        progress: Math.min(predictionsMade, 1),
        completed: predictionsMade >= 1,
      },
      {
        id: 'streak-bonus',
        title: 'On Fire!',
        description: `${user.streak_days || 0} day streak`,
        reward: (user.streak_days || 0) >= 3 ? 25 : 0,
        type: 'streak',
        target: 3,
        progress: user.streak_days || 0,
        completed: (user.streak_days || 0) >= 3,
      },
    ];

    setChallenges(todaysChallenges);
    setLoading(false);
  };

  const claimReward = async (challenge: Challenge) => {
    if (!user || !challenge.completed || challenge.reward === 0) return;

    try {
      await addCoins(user.id, challenge.reward, `Challenge: ${challenge.title}`);
      await refreshProfile();

      // Mark as claimed (in real app, store this in DB)
      setChallenges(prev =>
        prev.map(c =>
          c.id === challenge.id ? { ...c, reward: 0 } : c
        )
      );
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  const totalRewards = challenges.reduce(
    (acc, c) => acc + (c.completed ? c.reward : 0),
    0
  );

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Challenges</Text>
        <View style={styles.totalReward}>
          <Ionicons name="logo-bitcoin" size={16} color={COLORS.accent} />
          <Text style={styles.totalRewardText}>{totalRewards}</Text>
        </View>
      </View>

      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeInfo}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              {challenge.completed && challenge.reward > 0 && (
                <TouchableOpacity
                  style={styles.claimButton}
                  onPress={() => claimReward(challenge)}
                >
                  <Text style={styles.claimButtonText}>Claim</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.challengeDescription}>{challenge.description}</Text>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(challenge.progress / challenge.target) * 100}%`,
                      backgroundColor: challenge.completed
                        ? COLORS.success
                        : COLORS.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {challenge.progress}/{challenge.target}
              </Text>
            </View>
          </View>

          <View style={styles.rewardContainer}>
            {challenge.completed ? (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            ) : (
              <>
                <Ionicons name="logo-bitcoin" size={16} color={COLORS.accent} />
                <Text style={styles.rewardText}>+{challenge.reward}</Text>
              </>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  totalRewardText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  claimButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  claimButtonText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  challengeDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  rewardText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 2,
  },
});
