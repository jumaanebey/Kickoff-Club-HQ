import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { Game } from '../types';

interface MatchSimulationModalProps {
  visible: boolean;
  game: Game | null;
  onClose: () => void;
  onSimulate: (gameId: string) => Promise<any>;
}

interface PlayByPlay {
  quarter: number;
  type: string;
  team: 'user' | 'opponent';
  description: string;
}

export default function MatchSimulationModal({
  visible,
  game,
  onClose,
  onSimulate,
}: MatchSimulationModalProps) {
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [plays, setPlays] = useState<PlayByPlay[]>([]);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible && game) {
      startSimulation();
    } else {
      resetSimulation();
    }
  }, [visible, game]);

  const resetSimulation = () => {
    setSimulating(false);
    setResult(null);
    setPlays([]);
    setCurrentPlayIndex(0);
    setUserScore(0);
    setOpponentScore(0);
    fadeAnim.setValue(0);
  };

  const startSimulation = async () => {
    if (!game) return;

    setSimulating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate the match
      const matchResult = await onSimulate(game.id);

      if (matchResult.error) {
        alert(`Error: ${matchResult.error}`);
        setSimulating(false);
        return;
      }

      setResult(matchResult);

      // Generate play-by-play
      const generatedPlays = generatePlays(
        matchResult.user_score,
        matchResult.opponent_score
      );
      setPlays(generatedPlays);

      // Animate plays one by one
      animatePlays(generatedPlays, matchResult.user_score, matchResult.opponent_score);
    } catch (error) {
      console.error('Match simulation error:', error);
      alert('Failed to simulate match');
      setSimulating(false);
    }
  };

  const generatePlays = (userScoreFinal: number, opponentScoreFinal: number): PlayByPlay[] => {
    const plays: PlayByPlay[] = [];

    // Calculate TDs and FGs
    const userTDs = Math.floor(userScoreFinal / 7);
    const userFGs = Math.floor((userScoreFinal % 7) / 3);
    const opponentTDs = Math.floor(opponentScoreFinal / 7);
    const opponentFGs = Math.floor((opponentScoreFinal % 7) / 3);

    const userPlays = [
      { type: 'touchdown', description: 'Touchdown! Amazing pass to the end zone!', points: 7 },
      { type: 'touchdown', description: 'Touchdown! Powerful rushing attack scores!', points: 7 },
      { type: 'touchdown', description: 'Touchdown! Beautiful play execution!', points: 7 },
    ];

    const opponentPlays = [
      { type: 'touchdown', description: 'Opponent scores a touchdown.', points: 7 },
    ];

    // Add user TDs
    for (let i = 0; i < userTDs; i++) {
      const play = userPlays[i % userPlays.length];
      plays.push({
        quarter: Math.min(Math.floor(i / 2) + 1, 4),
        type: play.type,
        team: 'user',
        description: play.description,
      });
    }

    // Add opponent TDs
    for (let i = 0; i < opponentTDs; i++) {
      plays.push({
        quarter: Math.min(Math.floor(i / 2) + 1, 4),
        type: 'touchdown',
        team: 'opponent',
        description: 'Opponent scores a touchdown.',
      });
    }

    // Add user FGs
    for (let i = 0; i < userFGs; i++) {
      plays.push({
        quarter: Math.min(3 + i, 4),
        type: 'field_goal',
        team: 'user',
        description: 'Field goal is good! 3 points!',
      });
    }

    // Add opponent FGs
    for (let i = 0; i < opponentFGs; i++) {
      plays.push({
        quarter: Math.min(3 + i, 4),
        type: 'field_goal',
        team: 'opponent',
        description: 'Opponent kicks a field goal.',
      });
    }

    // Shuffle plays
    return plays.sort(() => Math.random() - 0.5);
  };

  const animatePlays = (allPlays: PlayByPlay[], finalUserScore: number, finalOpponentScore: number) => {
    let currentUser = 0;
    let currentOpponent = 0;
    let playIndex = 0;

    const interval = setInterval(() => {
      if (playIndex >= allPlays.length) {
        clearInterval(interval);
        setSimulating(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Fade in final result
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
        return;
      }

      const play = allPlays[playIndex];
      const points = play.type === 'touchdown' ? 7 : 3;

      if (play.team === 'user') {
        currentUser = Math.min(currentUser + points, finalUserScore);
        setUserScore(currentUser);
      } else {
        currentOpponent = Math.min(currentOpponent + points, finalOpponentScore);
        setOpponentScore(currentOpponent);
      }

      setCurrentPlayIndex(playIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playIndex++;
    }, 1200); // 1.2 seconds per play
  };

  if (!game) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Match Simulation</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Scoreboard */}
          <View style={styles.scoreboard}>
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>Your Team</Text>
              <Text style={styles.score}>{userScore}</Text>
            </View>
            <View style={styles.vsSection}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{game.away_team}</Text>
              <Text style={styles.score}>{opponentScore}</Text>
            </View>
          </View>

          {/* Play-by-Play */}
          <ScrollView style={styles.playsContainer} contentContainerStyle={styles.playsContent}>
            {plays.slice(0, currentPlayIndex + 1).map((play, index) => (
              <View
                key={index}
                style={[
                  styles.playItem,
                  play.team === 'user' ? styles.playUser : styles.playOpponent,
                ]}
              >
                <View style={styles.playHeader}>
                  <Text style={styles.playQuarter}>Q{play.quarter}</Text>
                  <Ionicons
                    name={play.type === 'touchdown' ? 'trophy' : 'football'}
                    size={16}
                    color={play.team === 'user' ? COLORS.success : COLORS.error}
                  />
                </View>
                <Text style={styles.playDescription}>{play.description}</Text>
              </View>
            ))}

            {simulating && currentPlayIndex < plays.length && (
              <View style={styles.simulatingIndicator}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.simulatingText}>Simulating...</Text>
              </View>
            )}
          </ScrollView>

          {/* Final Result */}
          {!simulating && result && (
            <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
              <View
                style={[
                  styles.resultBanner,
                  result.won ? styles.resultWin : styles.resultLoss,
                ]}
              >
                <Text style={styles.resultTitle}>
                  {result.won ? '🏆 VICTORY!' : '😔 DEFEAT'}
                </Text>
                <Text style={styles.resultSubtitle}>
                  Final Score: {result.user_score} - {result.opponent_score}
                </Text>
              </View>

              <View style={styles.rewards}>
                <Text style={styles.rewardsTitle}>Rewards</Text>
                <View style={styles.rewardsList}>
                  <View style={styles.rewardItem}>
                    <Ionicons name="cash" size={20} color={COLORS.accent} />
                    <Text style={styles.rewardText}>+{result.coins_earned} Coins</Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Ionicons name="star" size={20} color={COLORS.primary} />
                    <Text style={styles.rewardText}>+{result.xp_earned} XP</Text>
                  </View>
                  <View style={styles.rewardItem}>
                    <Ionicons name="school" size={20} color={COLORS.success} />
                    <Text style={styles.rewardText}>+{result.kp_earned} Knowledge Points</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreboard: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundLight,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vsSection: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  vsText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  playsContainer: {
    maxHeight: 300,
  },
  playsContent: {
    padding: SPACING.lg,
  },
  playItem: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
  },
  playUser: {
    backgroundColor: COLORS.success + '20',
    borderLeftColor: COLORS.success,
  },
  playOpponent: {
    backgroundColor: COLORS.error + '20',
    borderLeftColor: COLORS.error,
  },
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  playQuarter: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  playDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  simulatingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  simulatingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  resultContainer: {
    padding: SPACING.lg,
  },
  resultBanner: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  resultWin: {
    backgroundColor: COLORS.success + '30',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  resultLoss: {
    backgroundColor: COLORS.error + '20',
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  resultTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  resultSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  rewards: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  rewardsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  rewardsList: {
    gap: SPACING.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
