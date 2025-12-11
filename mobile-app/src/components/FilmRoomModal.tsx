import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import {
  addKnowledgePoints,
  collectBuildingProduction,
  upgradeBuilding,
  subtractKnowledgePoints,
} from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';
import { VideoPlayer } from './media/VideoPlayer';
import { VideoThumbnail } from './media/VideoThumbnail';
import { ScrollView } from 'react-native-gesture-handler';

interface Building {
  id: string;
  building_type: string;
  level: number;
  production_current: number;
  last_collected: string;
}

interface FilmRoomModalProps {
  visible: boolean;
  building: Building | null;
  onClose: () => void;
  onUpdate: () => void;
}

// Production rates by level (KP per hour)
const PRODUCTION_RATES = {
  1: 10,
  2: 20,
  3: 35,
  4: 55,
  5: 80,
};

// Max storage by level
const MAX_STORAGE = {
  1: 100,
  2: 250,
  3: 500,
  4: 1000,
  5: 2000,
};

// Upgrade costs (in KP)
const UPGRADE_COSTS = {
  2: 50,
  3: 150,
  4: 400,
  5: 1000,
};

export default function FilmRoomModal({
  visible,
  building,
  onClose,
  onUpdate,
}: FilmRoomModalProps) {
  const { user, refreshProfile } = useAuth();
  const [currentProduction, setCurrentProduction] = useState(0);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Video State
  const [activeLesson, setActiveLesson] = useState<any | null>(null);

  useEffect(() => {
    if (building && visible) {
      calculateProduction();
      const interval = setInterval(calculateProduction, 1000);
      return () => clearInterval(interval);
    }
  }, [building, visible]);

  const calculateProduction = () => {
    if (!building) return;

    const level = building.level as keyof typeof PRODUCTION_RATES;
    const rate = PRODUCTION_RATES[level] || PRODUCTION_RATES[1];
    const maxStorage = MAX_STORAGE[level] || MAX_STORAGE[1];

    // Calculate time elapsed since last collection
    const lastCollected = new Date(building.last_collected);
    const now = new Date();
    const hoursElapsed = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);

    // Calculate production (capped at max storage)
    const produced = Math.min(Math.floor(hoursElapsed * rate), maxStorage);
    setCurrentProduction(produced);
  };

  const handleCollect = async () => {
    if (!building || !user || currentProduction === 0) return;

    setCollecting(true);
    try {
      // Award KP to user
      await addKnowledgePoints(user.id, currentProduction, 'Film Room Production');

      // Reset building production
      await collectBuildingProduction(building.id, currentProduction);

      // Refresh profile to update KP display
      await refreshProfile();

      Alert.alert(
        'Knowledge Collected!',
        `You gained ${currentProduction} Knowledge Points from studying film!`
      );

      setCurrentProduction(0);
      onUpdate();
    } catch (error) {
      Alert.alert('Error', 'Failed to collect production');
    } finally {
      setCollecting(false);
    }
  };

  const handleUpgrade = async () => {
    if (!building || !user) return;

    const nextLevel = (building.level + 1) as keyof typeof UPGRADE_COSTS;
    const cost = UPGRADE_COSTS[nextLevel];

    if (!cost) {
      Alert.alert('Max Level', 'Your Film Room is already at maximum level!');
      return;
    }

    if ((user.knowledge_points || 0) < cost) {
      Alert.alert(
        'Insufficient Knowledge Points',
        `You need ${cost} KP to upgrade to level ${nextLevel}`
      );
      return;
    }

    Alert.alert(
      'Upgrade Film Room?',
      `Level ${building.level} → ${nextLevel}\n\nCost: ${cost} KP\nNew production: ${PRODUCTION_RATES[nextLevel]} KP/hour\nNew storage: ${MAX_STORAGE[nextLevel]} KP`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            setUpgrading(true);
            try {
              // Deduct KP
              await subtractKnowledgePoints(user.id, cost, `Film Room Upgrade to Level ${nextLevel}`);

              // Upgrade building
              await upgradeBuilding(building.id, nextLevel);

              // Refresh
              await refreshProfile();
              onUpdate();

              Alert.alert('Upgraded!', `Film Room is now level ${nextLevel}!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to upgrade building');
            } finally {
              setUpgrading(false);
            }
          },
        },
      ]
    );
  };

  // Mock Lessons Data
  const LESSONS = [
    {
      id: '1',
      title: 'Zone Defense Basics',
      thumbnailUri: 'https://img.youtube.com/vi/1_gK_3tA3-U/maxresdefault.jpg', // Placeholder
      videoUri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Sample Playable video
      duration: 180,
      minLevel: 1
    },
    {
      id: '2',
      title: 'The Perfect Spiral',
      thumbnailUri: 'https://img.youtube.com/vi/tVoqA-LKGb4/maxresdefault.jpg',
      videoUri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      duration: 245,
      minLevel: 2
    },
    {
      id: '3',
      title: 'Advanced Playcalling',
      thumbnailUri: 'https://img.youtube.com/vi/q5j2iS2L1qM/maxresdefault.jpg',
      videoUri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      duration: 420,
      minLevel: 3
    }
  ];

  if (!building) return null;

  if (!building) return null;

  const level = building.level as keyof typeof PRODUCTION_RATES;
  const rate = PRODUCTION_RATES[level] || PRODUCTION_RATES[1];
  const maxStorage = MAX_STORAGE[level] || MAX_STORAGE[1];
  const nextLevel = (building.level + 1) as keyof typeof UPGRADE_COSTS;
  const upgradeCost = UPGRADE_COSTS[nextLevel];
  const canUpgrade = building.level < 5;
  const productionPercent = (currentProduction / maxStorage) * 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="film" size={32} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.title}>Film Room</Text>
                <Text style={styles.subtitle}>Level {building.level}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>


          {/* Content ScrollView */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >

            {/* Video Player Section */}
            {activeLesson ? (
              <View style={styles.videoSection}>
                <VideoPlayer
                  videoUri={activeLesson.videoUri}
                  title={activeLesson.title}
                  autoPlay={true}
                  onComplete={() => {
                    // Could add reward logic here
                    Alert.alert('Lesson Complete!', 'You learned something new!');
                  }}
                />
                <TouchableOpacity
                  style={styles.backToLessonsButton}
                  onPress={() => setActiveLesson(null)}
                >
                  <Ionicons name="list" size={16} color={COLORS.primary} />
                  <Text style={styles.backToLessonsText}>Back to Lessons</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lessonsContainer}>
                <Text style={styles.sectionTitle}>Daily Lessons</Text>
                <Text style={styles.sectionSubtitle}>Watch to earn extra KP!</Text>

                {LESSONS.map((lesson) => {
                  const isLocked = (building?.level || 0) < lesson.minLevel;

                  return (
                    <View key={lesson.id} style={styles.lessonItem}>
                      <VideoThumbnail
                        thumbnailUri={lesson.thumbnailUri}
                        duration={lesson.duration}
                        isLocked={isLocked}
                        onPress={() => {
                          if (isLocked) {
                            Alert.alert('Locked', `Upgrade Film Room to Level ${lesson.minLevel} to watch this.`);
                          } else {
                            setActiveLesson(lesson);
                          }
                        }}
                      />
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      {isLocked && (
                        <Text style={styles.lockText}>Requires Level {lesson.minLevel}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Production Display */}
            <View style={styles.productionContainer}>
              <Text style={styles.sectionTitle}>Passive Production</Text>

              <View style={styles.productionCard}>
                <View style={styles.productionHeader}>
                  <Ionicons name="bulb" size={48} color={COLORS.accent} />
                  <Text style={styles.productionAmount}>{currentProduction}</Text>
                  <Text style={styles.productionLabel}>/ {maxStorage} KP</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(productionPercent, 100)}%` },
                    ]}
                  />
                </View>

                <View style={styles.productionStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Production Rate</Text>
                    <Text style={styles.statValue}>{rate} KP/hour</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Storage</Text>
                    <Text style={styles.statValue}>{maxStorage} KP</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.collectButton,
                    (currentProduction === 0 || collecting) && styles.collectButtonDisabled,
                  ]}
                  onPress={handleCollect}
                  disabled={currentProduction === 0 || collecting}
                >
                  <Ionicons
                    name="download"
                    size={20}
                    color={currentProduction > 0 ? COLORS.white : COLORS.textMuted}
                  />
                  <Text
                    style={[
                      styles.collectButtonText,
                      (currentProduction === 0 || collecting) && styles.collectButtonTextDisabled,
                    ]}
                  >
                    {collecting ? 'Collecting...' : 'Collect Knowledge'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {/* Upgrade Section */}
            {canUpgrade && (
              <View style={styles.upgradeContainer}>
                <Text style={styles.sectionTitle}>Upgrade</Text>

                <View style={styles.upgradeCard}>
                  <View style={styles.upgradeComparison}>
                    <View style={styles.upgradeColumn}>
                      <Text style={styles.upgradeColumnTitle}>Current</Text>
                      <Text style={styles.upgradeValue}>Level {building.level}</Text>
                      <Text style={styles.upgradeStat}>{rate} KP/hour</Text>
                      <Text style={styles.upgradeStat}>{maxStorage} KP max</Text>
                    </View>

                    <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />

                    <View style={styles.upgradeColumn}>
                      <Text style={styles.upgradeColumnTitle}>Next</Text>
                      <Text style={styles.upgradeValue}>Level {nextLevel}</Text>
                      <Text style={styles.upgradeStat}>
                        {PRODUCTION_RATES[nextLevel]} KP/hour
                      </Text>
                      <Text style={styles.upgradeStat}>
                        {MAX_STORAGE[nextLevel]} KP max
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.upgradeButton, upgrading && styles.upgradeButtonDisabled]}
                    onPress={handleUpgrade}
                    disabled={upgrading}
                  >
                    <Ionicons name="arrow-up-circle" size={20} color={COLORS.white} />
                    <Text style={styles.upgradeButtonText}>
                      {upgrading ? 'Upgrading...' : `Upgrade for ${upgradeCost} KP`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!canUpgrade && (
              <View style={styles.maxLevelContainer}>
                <Ionicons name="trophy" size={32} color={COLORS.accent} />
                <Text style={styles.maxLevelText}>Maximum Level Reached!</Text>
              </View>
            )}

          </ScrollView>
        </View>
      </View>
    </Modal >
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    // Provide a fixed max height but let flex handle content
    height: '90%',
    paddingBottom: 20,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  videoSection: {
    marginBottom: SPACING.lg,
  },
  backToLessonsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
  },
  backToLessonsText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  lessonsContainer: {
    marginBottom: SPACING.lg,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: -4,
    marginBottom: SPACING.md,
  },
  lessonItem: {
    marginBottom: SPACING.md,
  },
  lessonTitle: {
    marginTop: SPACING.xs,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  lockText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.error,
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  productionContainer: {
    marginBottom: SPACING.lg,
  },
  productionCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  productionHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  productionAmount: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },
  productionLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
  },
  productionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  collectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  collectButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  collectButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  collectButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  upgradeContainer: {
    marginBottom: SPACING.lg,
  },
  upgradeCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  upgradeComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  upgradeColumn: {
    alignItems: 'center',
  },
  upgradeColumnTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  upgradeValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  upgradeStat: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  upgradeButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  upgradeButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  maxLevelContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.accent + '20',
    borderRadius: BORDER_RADIUS.lg,
  },
  maxLevelText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },
});
