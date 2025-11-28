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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  getUpcomingGames,
  getUserPredictions,
  makePrediction,
  spendCoins,
} from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { Game, Prediction } from '../../types';

export default function PredictScreen() {
  const { user, refreshProfile } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedWinner, setSelectedWinner] = useState<'home' | 'away' | null>(null);
  const [wagerAmount, setWagerAmount] = useState('10');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gamesData, predictionsData] = await Promise.all([
        getUpcomingGames(),
        user ? getUserPredictions(user.id) : [],
      ]);
      setGames(gamesData || []);
      setPredictions(predictionsData || []);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGamePress = (game: Game) => {
    // Check if already predicted
    const existingPrediction = predictions.find((p) => p.game_id === game.id);
    if (existingPrediction) {
      Alert.alert('Already Predicted', 'You have already made a prediction for this game');
      return;
    }
    setSelectedGame(game);
    setShowModal(true);
  };

  const handlePrediction = async () => {
    if (!selectedGame || !selectedWinner || !user) return;

    const amount = parseInt(wagerAmount, 10);
    if (isNaN(amount) || amount < 1) {
      Alert.alert('Invalid Amount', 'Please enter a valid wager amount');
      return;
    }

    if (amount > (user.coins || 0)) {
      Alert.alert('Insufficient Coins', 'You don\'t have enough coins for this wager');
      return;
    }

    try {
      // Spend coins
      await spendCoins(user.id, amount, `Prediction: ${selectedGame.away_team} @ ${selectedGame.home_team}`);

      // Make prediction
      await makePrediction({
        user_id: user.id,
        game_id: selectedGame.id,
        predicted_winner: selectedWinner,
        coins_wagered: amount,
      });

      await Promise.all([loadData(), refreshProfile()]);
      setShowModal(false);
      setSelectedGame(null);
      setSelectedWinner(null);
      setWagerAmount('10');

      Alert.alert('Prediction Made!', `You wagered ${amount} coins on ${selectedWinner === 'home' ? selectedGame.home_team : selectedGame.away_team}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to make prediction');
    }
  };

  const hasPredicted = (gameId: string) => {
    return predictions.some((p) => p.game_id === gameId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Predictions</Text>
          <View style={styles.coinBalance}>
            <Ionicons name="logo-bitcoin" size={20} color={COLORS.accent} />
            <Text style={styles.coinText}>{user?.coins || 0}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {predictions.filter((p) => p.is_correct).length}
            </Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{predictions.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {predictions.length > 0
                ? Math.round(
                    (predictions.filter((p) => p.is_correct).length /
                      predictions.length) *
                      100
                  )
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        {/* Upcoming Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Games</Text>
          {games.length > 0 ? (
            games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.gameCard,
                  hasPredicted(game.id) && styles.gameCardPredicted,
                ]}
                onPress={() => handleGamePress(game)}
                disabled={hasPredicted(game.id)}
              >
                <View style={styles.gameHeader}>
                  <Text style={styles.gameWeek}>Week {game.week}</Text>
                  {hasPredicted(game.id) && (
                    <View style={styles.predictedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                      <Text style={styles.predictedText}>Predicted</Text>
                    </View>
                  )}
                </View>

                <View style={styles.teams}>
                  <View style={styles.team}>
                    <Text style={styles.teamName}>{game.away_team}</Text>
                  </View>
                  <Text style={styles.at}>@</Text>
                  <View style={styles.team}>
                    <Text style={styles.teamName}>{game.home_team}</Text>
                  </View>
                </View>

                <Text style={styles.gameTime}>
                  {new Date(game.game_time).toLocaleString()}
                </Text>

                {!hasPredicted(game.id) && (
                  <View style={styles.predictButton}>
                    <Text style={styles.predictButtonText}>Make Prediction</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No upcoming games</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Prediction Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make Prediction</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedGame && (
              <>
                <Text style={styles.modalSubtitle}>
                  {selectedGame.away_team} @ {selectedGame.home_team}
                </Text>

                <Text style={styles.pickLabel}>Pick the Winner</Text>
                <View style={styles.pickOptions}>
                  <TouchableOpacity
                    style={[
                      styles.pickOption,
                      selectedWinner === 'away' && styles.pickOptionSelected,
                    ]}
                    onPress={() => setSelectedWinner('away')}
                  >
                    <Text
                      style={[
                        styles.pickOptionText,
                        selectedWinner === 'away' && styles.pickOptionTextSelected,
                      ]}
                    >
                      {selectedGame.away_team}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pickOption,
                      selectedWinner === 'home' && styles.pickOptionSelected,
                    ]}
                    onPress={() => setSelectedWinner('home')}
                  >
                    <Text
                      style={[
                        styles.pickOptionText,
                        selectedWinner === 'home' && styles.pickOptionTextSelected,
                      ]}
                    >
                      {selectedGame.home_team}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.wagerLabel}>Wager Amount</Text>
                <View style={styles.wagerInput}>
                  <Ionicons name="logo-bitcoin" size={20} color={COLORS.accent} />
                  <TextInput
                    style={styles.wagerTextInput}
                    value={wagerAmount}
                    onChangeText={setWagerAmount}
                    keyboardType="number-pad"
                    placeholder="10"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
                <Text style={styles.wagerHint}>
                  Win 2x your wager if correct!
                </Text>

                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    (!selectedWinner || !wagerAmount) && styles.confirmButtonDisabled,
                  ]}
                  onPress={handlePrediction}
                  disabled={!selectedWinner || !wagerAmount}
                >
                  <Text style={styles.confirmButtonText}>Confirm Prediction</Text>
                </TouchableOpacity>
              </>
            )}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  coinBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  coinText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: FONTS.sizes.lg,
    marginLeft: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  gameCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  gameCardPredicted: {
    borderWidth: 1,
    borderColor: COLORS.success,
    opacity: 0.8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gameWeek: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  predictedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictedText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  at: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  gameTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  predictButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalSubtitle: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  pickLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickOptions: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  pickOption: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  pickOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  pickOptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  pickOptionTextSelected: {
    color: COLORS.primary,
  },
  wagerLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  wagerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  wagerTextInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
  },
  wagerHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    marginBottom: SPACING.lg,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
});
