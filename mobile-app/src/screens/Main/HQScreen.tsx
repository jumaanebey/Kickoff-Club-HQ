import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { getUserBuildings, createBuilding, refillEnergy, upgradeBuilding, collectBuildingProduction } from '../../services/supabase';
import { haptics } from '../../utils/haptics';
import FilmRoomModal from '../../components/FilmRoomModal';
import DailyMissions from '../../components/DailyMissions';
import BuildingDetailsModal from '../../components/BuildingDetailsModal';
import FootballField from '../../components/FootballField';
import BuildingIdleAnimation from '../../components/BuildingIdleAnimation';
import PressableBuilding from '../../components/PressableBuilding';
import ParticleExplosion from '../../components/ParticleExplosion';
import FloatingNumber from '../../components/FloatingNumber';
import GrassShimmer from '../../components/GrassShimmer';
import MovingClouds from '../../components/MovingClouds';
import AmbientParticles from '../../components/AmbientParticles';
import FieldLinePulse from '../../components/FieldLinePulse';
import ConfettiBurst from '../../components/ConfettiBurst';
import AchievementToast from '../../components/AchievementToast';
import { AnimatedCoinCollect, AnimatedBuildingUpgrade, AnimatedProgressBar } from '../../components/animations';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getBuildingAsset } from '../../constants/assets';

const { width, height } = Dimensions.get('window');

// Football field dimensions - larger canvas for strategic placement
const FIELD_WIDTH = width * 1.8;
const FIELD_HEIGHT = height * 2;

// Strategic building positions (percentage of field)
const BUILDING_POSITIONS: Record<string, { x: number; y: number }> = {
  'stadium': { x: 0.50, y: 0.45 },        // Center field - main building
  'practice-field': { x: 0.20, y: 0.55 }, // Left sideline
  'film-room': { x: 0.70, y: 0.25 },      // Upper right - like a press box
  'weight-room': { x: 0.80, y: 0.65 },    // Right sideline
  'headquarters': { x: 0.50, y: 0.80 },   // Bottom center
};

interface Building {
  id: string;
  type: 'film-room' | 'practice-field' | 'stadium' | 'locker-room' | 'draft-room' | 'concession';
  level: number;
  position: { x: number; y: number };
  unlocked: boolean;
  production?: {
    type: 'kp' | 'coins';
    rate: number;
    max: number;
    current: number;
    lastCollected: string;
  };
}

export default function HQScreen() {
  const { user, refreshProfile } = useAuth();
  const navigation = useNavigation<any>();
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
  const [filmRoomModalVisible, setFilmRoomModalVisible] = useState(false);
  const [buildingDetailsModalVisible, setBuildingDetailsModalVisible] = useState(false);
  const [energyTimer, setEnergyTimer] = useState<string>('');

  // Animation states
  const [coinAnimations, setCoinAnimations] = useState<Array<{ id: string; amount: number; x: number; y: number }>>([]);
  const [upgradingBuilding, setUpgradingBuilding] = useState<{ id: string; type: string; fromLevel: number; toLevel: number } | null>(null);
  const [pressedBuilding, setPressedBuilding] = useState<string | null>(null);
  const [particleEffects, setParticleEffects] = useState<Array<{ id: string; x: number; y: number; amount: number; type: 'coin' | 'kp' }>>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{ id: string; x: number; y: number; amount: number; type: 'coin' | 'kp' }>>([]);
  const [confettiBursts, setConfettiBursts] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [achievementToasts, setAchievementToasts] = useState<Array<{ id: string; title: string; message: string; icon?: string }>>([]);

  // Pan and zoom gesture values
  const translateX = useSharedValue(-(FIELD_WIDTH - width) / 2);
  const translateY = useSharedValue(-(FIELD_HEIGHT - height) / 2);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(-(FIELD_WIDTH - width) / 2);
  const savedTranslateY = useSharedValue(-(FIELD_HEIGHT - height) / 2);
  const savedScale = useSharedValue(1);

  useEffect(() => {
    loadHQ();
    // Refill energy when screen loads
    if (user) {
      refillEnergy(user.id);
    }
  }, [user]);

  useEffect(() => {
    // Update energy timer every second
    const interval = setInterval(() => {
      if (!user || !user.last_energy_update) return;

      const lastUpdate = new Date(user.last_energy_update);
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const minutesPassed = Math.floor(diff / (1000 * 60));
      const secondsToNext = 300 - (Math.floor(diff / 1000) % 300); // 5 minutes = 300 seconds

      const minutes = Math.floor(secondsToNext / 60);
      const seconds = secondsToNext % 60;

      if ((user.energy || 0) >= 100) {
        setEnergyTimer('Full');
      } else {
        setEnergyTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const loadHQ = async () => {
    if (!user) return;

    try {
      // Load user's buildings from database
      const dbBuildings = await getUserBuildings(user.id);

      // If no buildings exist, create starter buildings
      if (dbBuildings.length === 0) {
        // Create Film Room
        await createBuilding({
          user_id: user.id,
          building_type: 'film-room',
          position_x: 0,
          position_y: 0,
          level: 1,
        });
        // Create Practice Field
        await createBuilding({
          user_id: user.id,
          building_type: 'practice-field',
          position_x: 1,
          position_y: 0,
          level: 1,
        });
        // Create Stadium
        await createBuilding({
          user_id: user.id,
          building_type: 'stadium',
          position_x: 2,
          position_y: 0,
          level: 1,
        });
        // Reload after creating
        const newBuildings = await getUserBuildings(user.id);
        setBuildings(newBuildings);
      } else {
        setBuildings(dbBuildings);
      }
    } catch (error) {
      console.error('Error loading HQ:', error);
    }
  };

  const getBuildingInfo = (type: string) => {
    const info = {
      'film-room': {
        name: 'Film Room',
        icon: 'film' as const,
        color: COLORS.primary,
        description: 'Watch lessons, produce KP',
      },
      'practice-field': {
        name: 'Practice Field',
        icon: 'football' as const,
        color: COLORS.secondary,
        description: 'Complete drills for coins',
      },
      'stadium': {
        name: 'Stadium',
        icon: 'trophy' as const,
        color: COLORS.accent,
        description: 'Boost predictions',
      },
      'locker-room': {
        name: 'Locker Room',
        icon: 'shirt' as const,
        color: COLORS.primary,
        description: 'Store achievements',
      },
      'draft-room': {
        name: 'Draft Room',
        icon: 'people' as const,
        color: COLORS.secondary,
        description: 'Collect player cards',
      },
      'concession': {
        name: 'Concession Stand',
        icon: 'cart' as const,
        color: COLORS.accent,
        description: 'Buy exclusive merch',
      },
    };
    return info[type as keyof typeof info];
  };

  const handleBuildingPress = (building: any) => {
    if (building.building_type === 'film-room' && building.level > 0) {
      setSelectedBuilding(building);
      setFilmRoomModalVisible(true);
    } else if (building.building_type === 'practice-field' && building.level > 0) {
      // Navigate to Practice Field screen (Farmville-style drill planting)
      navigation.navigate('PracticeField');
    } else if (building.building_type === 'stadium' && building.level > 0) {
      setSelectedBuilding(building);
      setBuildingDetailsModalVisible(true);
    } else if (building.level === 0) {
      Alert.alert('Coming Soon', 'This building hasn\'t been built yet!');
    } else {
      // Show details for any other built building
      setSelectedBuilding(building);
      setBuildingDetailsModalVisible(true);
    }
  };

  const handleUpgradeBuilding = async (buildingId: string) => {
    if (!user) return;

    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    const upgradeCost = Math.floor(500 * Math.pow(1.5, building.level));

    if ((user.coins || 0) < upgradeCost) {
      Alert.alert('Not Enough Coins', `You need ${upgradeCost} coins to upgrade this building.`);
      return;
    }

    try {
      // Close modal and start animation
      setBuildingDetailsModalVisible(false);

      // Map building_type to animation type
      const buildingTypeMap: Record<string, any> = {
        'film-room': 'film_room',
        'practice-field': 'practice_field',
        'weight-room': 'weight_room',
        'stadium': 'stadium',
        'headquarters': 'headquarters',
      };

      setUpgradingBuilding({
        id: buildingId,
        type: buildingTypeMap[building.building_type] || 'practice_field',
        fromLevel: building.level,
        toLevel: building.level + 1,
      });

      await upgradeBuilding(buildingId, building.level + 1);
      await refreshProfile();

      // Trigger confetti burst
      const confettiId = `confetti-${Date.now()}`;
      setConfettiBursts((prev) => [
        ...prev,
        {
          id: confettiId,
          x: width / 2,
          y: height / 2,
        },
      ]);

      // Trigger achievement toast
      const buildingInfo = getBuildingInfo(building.building_type);
      const toastId = `toast-${Date.now()}`;
      setAchievementToasts((prev) => [
        ...prev,
        {
          id: toastId,
          title: `${buildingInfo.name} Upgraded!`,
          message: `Now Level ${building.level + 1}`,
          icon: 'rocket',
        },
      ]);

      // Wait for animation to complete before reloading
      setTimeout(async () => {
        await loadHQ();
        haptics.upgradeComplete();
      }, 800);
    } catch (error) {
      console.error('Error upgrading building:', error);
      Alert.alert('Error', 'Failed to upgrade building');
      setUpgradingBuilding(null);
    }
  };

  const handleCollectProduction = async (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building || building.production_current === 0) return;

    try {
      // Close modal
      setBuildingDetailsModalVisible(false);

      // Get building position from strategic layout
      const position = BUILDING_POSITIONS[building.building_type] || { x: 0.5, y: 0.5 };
      const buildingX = position.x * FIELD_WIDTH;
      const buildingY = position.y * FIELD_HEIGHT;

      const animationId = `collect-${Date.now()}`;
      const type = 'coin'; // For now, assume coins. Later can be based on production type

      // Trigger particle explosion
      setParticleEffects((prev) => [
        ...prev,
        {
          id: `particle-${animationId}`,
          x: buildingX,
          y: buildingY,
          amount: building.production_current,
          type,
        },
      ]);

      // Trigger floating number
      setFloatingNumbers((prev) => [
        ...prev,
        {
          id: `number-${animationId}`,
          x: buildingX,
          y: buildingY - 40,
          amount: building.production_current,
          type,
        },
      ]);

      haptics.coinCollect();

      await collectBuildingProduction(buildingId, building.production_current);
      await refreshProfile();
      await loadHQ();
    } catch (error) {
      console.error('Error collecting production:', error);
      Alert.alert('Error', 'Failed to collect production');
    }
  };

  // Pan gesture for moving around the field
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      // Clamp values to keep field bounds visible
      const maxTranslateX = 0;
      const minTranslateX = -(FIELD_WIDTH * scale.value - width);
      const maxTranslateY = 0;
      const minTranslateY = -(FIELD_HEIGHT * scale.value - height);

      translateX.value = withSpring(
        Math.max(minTranslateX, Math.min(maxTranslateX, translateX.value))
      );
      translateY.value = withSpring(
        Math.max(minTranslateY, Math.min(maxTranslateY, translateY.value))
      );

      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.8, Math.min(2, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Double tap to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      // Toggle between normal and zoomed
      const newScale = savedScale.value > 1.2 ? 1 : 1.5;
      scale.value = withSpring(newScale, {
        damping: 15,
        stiffness: 150,
      });
      savedScale.value = newScale;
    });

  const composedGesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(panGesture, pinchGesture));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Football HQ</Text>
            <Text style={styles.headerSubtitle}>Level {user?.level || 1}</Text>
          </View>
          <View style={styles.currencies}>
            <View style={styles.currencyItem}>
              <Ionicons name="school" size={18} color={COLORS.secondary} />
              <Text style={styles.currencyText}>{user?.knowledge_points || 0} KP</Text>
            </View>
            <View style={styles.currencyItem}>
              <Ionicons name="logo-bitcoin" size={18} color={COLORS.accent} />
              <Text style={styles.currencyText}>{user?.coins || 0}</Text>
            </View>
            <View style={styles.currencyItem}>
              <Ionicons name="flash" size={18} color={COLORS.primary} />
              <View>
                <Text style={styles.currencyText}>{user?.energy || 0} / 100</Text>
                {energyTimer && energyTimer !== 'Full' && (
                  <Text style={styles.energyTimer}>+1 in {energyTimer}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpContainer}>
          <AnimatedProgressBar
            progress={((user?.xp || 0) / ((user?.level || 1) * 100)) * 100}
            height={8}
            backgroundColor={COLORS.border}
            gradientColors={[COLORS.primary, COLORS.secondary]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 0 }}
            borderRadius={4}
            animationType="spring"
          />
          <Text style={styles.xpText}>
            {user?.xp || 0} / {(user?.level || 1) * 100} XP
          </Text>
        </View>

        {/* Daily Missions */}
        <DailyMissions />

        {/* Football Field - Pannable/Zoomable */}
        <View style={styles.fieldContainer}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.fieldCanvas, animatedStyle]}>
              {/* Football Field Background */}
              <FootballField width={FIELD_WIDTH} height={FIELD_HEIGHT} />

              {/* Atmospheric Effects */}
              <GrassShimmer width={FIELD_WIDTH} height={FIELD_HEIGHT} />
              <MovingClouds width={FIELD_WIDTH} height={FIELD_HEIGHT} />
              <AmbientParticles width={FIELD_WIDTH} height={FIELD_HEIGHT} count={15} />
              <FieldLinePulse width={FIELD_WIDTH} height={FIELD_HEIGHT} />

              {/* Buildings Positioned Strategically */}
              {buildings.map((building, index) => {
                const info = getBuildingInfo(building.building_type);
                const isProducing = building.production_current > 0;
                const position = BUILDING_POSITIONS[building.building_type] || { x: 0.5, y: 0.5 };

                return (
                  <View
                    key={building.id}
                    style={[
                      styles.building,
                      {
                        left: position.x * FIELD_WIDTH - 60,
                        top: position.y * FIELD_HEIGHT - 60,
                      },
                    ]}
                  >
                    <PressableBuilding onPress={() => handleBuildingPress(building)}>
                      <BuildingIdleAnimation
                        delay={index * 200}
                        isProducing={isProducing}
                      >
                      {building.level > 0 ? (
                        /* Built Building */
                        <LinearGradient
                          colors={[info.color + '40', info.color + '20']}
                          style={[styles.buildingCard, SHADOWS.lg]}
                        >
                          <Image
                            source={getBuildingAsset(building.building_type, building.level)}
                            style={styles.buildingImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.buildingName}>{info.name}</Text>
                          <Text style={styles.buildingLevel}>Lv. {building.level}</Text>

                          {/* Production Indicator */}
                          {isProducing && (
                            <View style={styles.collectButton}>
                              <Ionicons name="download" size={16} color={COLORS.white} />
                              <Text style={styles.collectText}>{building.production_current}</Text>
                            </View>
                          )}
                        </LinearGradient>
                      ) : (
                        /* Empty Slot (level 0 means not built yet) */
                        <View style={[styles.emptySlot, { borderColor: info.color }]}>
                          <Ionicons name="add-circle" size={32} color={info.color} />
                          <Text style={styles.emptySlotText}>Build</Text>
                          <Text style={styles.emptySlotName}>{info.name}</Text>
                        </View>
                      )}
                      </BuildingIdleAnimation>
                    </PressableBuilding>
                  </View>
                );
              })}
            </Animated.View>
          </GestureDetector>

          {/* Zoom Instructions Overlay */}
          <View style={styles.instructionsOverlay}>
            <Text style={styles.instructionsText}>Double tap to zoom • Pinch • Drag to pan</Text>
          </View>
        </View>

      {/* Film Room Modal */}
      <FilmRoomModal
        visible={filmRoomModalVisible}
        building={selectedBuilding}
        onClose={() => {
          setFilmRoomModalVisible(false);
          setSelectedBuilding(null);
        }}
        onUpdate={() => {
          loadHQ();
          refreshProfile();
        }}
      />

      {/* Building Details Modal */}
      <BuildingDetailsModal
        visible={buildingDetailsModalVisible}
        building={selectedBuilding}
        onClose={() => {
          setBuildingDetailsModalVisible(false);
          setSelectedBuilding(null);
        }}
        onUpgrade={handleUpgradeBuilding}
        onCollect={handleCollectProduction}
      />

      {/* Coin Collection Animations */}
      {coinAnimations.map((anim) => (
        <AnimatedCoinCollect
          key={anim.id}
          amount={anim.amount}
          startX={anim.x}
          startY={anim.y}
          onComplete={() => {
            setCoinAnimations((prev) => prev.filter((a) => a.id !== anim.id));
          }}
        />
      ))}

      {/* Building Upgrade Animation */}
      {upgradingBuilding && (
        <View style={styles.upgradeOverlay}>
          <AnimatedBuildingUpgrade
            buildingType={upgradingBuilding.type as any}
            fromLevel={upgradingBuilding.fromLevel}
            toLevel={upgradingBuilding.toLevel}
            onComplete={() => setUpgradingBuilding(null)}
          />
        </View>
      )}

      {/* Particle Explosions */}
      {particleEffects.map((effect) => (
        <ParticleExplosion
          key={effect.id}
          x={effect.x}
          y={effect.y}
          amount={effect.amount}
          type={effect.type}
          onComplete={() => {
            setParticleEffects((prev) => prev.filter((e) => e.id !== effect.id));
          }}
        />
      ))}

      {/* Floating Numbers */}
      {floatingNumbers.map((number) => (
        <FloatingNumber
          key={number.id}
          x={number.x}
          y={number.y}
          amount={number.amount}
          type={number.type}
          onComplete={() => {
            setFloatingNumbers((prev) => prev.filter((n) => n.id !== number.id));
          }}
        />
      ))}

      {/* Confetti Bursts */}
      {confettiBursts.map((burst) => (
        <ConfettiBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          count={30}
          onComplete={() => {
            setConfettiBursts((prev) => prev.filter((b) => b.id !== burst.id));
          }}
        />
      ))}

      {/* Achievement Toasts */}
      {achievementToasts.map((toast) => (
        <AchievementToast
          key={toast.id}
          title={toast.title}
          message={toast.message}
          icon={toast.icon as any}
          type="success"
          duration={3000}
          onDismiss={() => {
            setAchievementToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
        />
      ))}
    </SafeAreaView>
    </GestureHandlerRootView>
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
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  currencies: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  currencyText: {
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: FONTS.sizes.sm,
  },
  energyTimer: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  xpContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  xpText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  fieldContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  fieldCanvas: {
    width: FIELD_WIDTH,
    height: FIELD_HEIGHT,
    position: 'relative',
  },
  building: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  buildingCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  buildingImage: {
    width: 70,
    height: 70,
  },
  buildingName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  buildingLevel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  collectButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  collectText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  emptySlot: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight + '80',
  },
  emptySlotText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  emptySlotName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  instructionsOverlay: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  instructionsText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  upgradeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
