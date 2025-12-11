import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { getUserBuildings, createBuilding, upgradeBuilding, collectBuildingProduction, startBuildingUpgrade, completeBuildingUpgrade } from '../../services/supabase';
import { haptics } from '../../utils/haptics';
import { soundManager } from '../../utils/SoundManager';
import { useScreenShake } from '../../utils/screenShake';
import FilmRoomModal from '../../components/FilmRoomModal';
import CompactDailyMissions from '../../components/CompactDailyMissions';
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
import BuildingProductionTimer from '../../components/BuildingProductionTimer';
import BuildingUpgradeTimer from '../../components/BuildingUpgradeTimer';
import { CoinFountain } from '../../components/CoinFountain';
import { BuildingCardSkeleton } from '../../components/BuildingCardSkeleton';
import { AnimatedResourceCounter } from '../../components/AnimatedResourceCounter';
import { EnergyRefillAnimation } from '../../components/EnergyRefillAnimation';
import { Toast } from '../../components/Toast';
import { AnimatedCoinCollect, AnimatedBuildingUpgrade, AnimatedProgressBar } from '../../components/animations';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getBuildingAsset } from '../../constants/assets';

const { width, height } = Dimensions.get('window');

// Football field dimensions - larger canvas for strategic placement
const FIELD_WIDTH = width * 1.8;
const FIELD_HEIGHT = height * 2;

// Strategic building positions (percentage of field) - 7 buildings like web version
const BUILDING_POSITIONS: Record<string, { x: number; y: number }> = {
  'stadium': { x: 0.50, y: 0.35 },         // Center top - main building
  'headquarters': { x: 0.50, y: 0.55 },    // Center - command center
  'practice-field': { x: 0.20, y: 0.45 },  // Left side
  'film-room': { x: 0.80, y: 0.45 },       // Right side
  'weight-room': { x: 0.20, y: 0.70 },     // Bottom left
  'medical-center': { x: 0.50, y: 0.75 },  // Bottom center
  'scouting-office': { x: 0.80, y: 0.70 }, // Bottom right
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
  const [buildingsLoading, setBuildingsLoading] = useState(true);
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
  const [coinFountains, setCoinFountains] = useState<Array<{ id: string; x: number; y: number; count: number }>>([]);
  const [showEnergyRefillAnimation, setShowEnergyRefillAnimation] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  // Screen shake hook
  const { shake, animatedStyle: shakeStyle } = useScreenShake();

  // Pan and zoom gesture values
  const translateX = useSharedValue(-(FIELD_WIDTH - width) / 2);
  const translateY = useSharedValue(-(FIELD_HEIGHT - height) / 2);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(-(FIELD_WIDTH - width) / 2);
  const savedTranslateY = useSharedValue(-(FIELD_HEIGHT - height) / 2);
  const savedScale = useSharedValue(1);

  useEffect(() => {
    loadHQ();
    // Energy is now calculated on-demand when used (in useEnergy function)
    // No need to auto-refill on screen load - this was causing game balance issues
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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
  };

  const loadHQ = async () => {
    if (!user) return;

    try {
      setBuildingsLoading(true);
      // Load user's buildings from database
      const dbBuildings = await getUserBuildings(user.id);

      // If no buildings exist, create all 7 starter buildings
      if (dbBuildings.length === 0) {
        const starterBuildings = [
          { type: 'stadium', level: 1 },
          { type: 'headquarters', level: 1 },
          { type: 'practice-field', level: 1 },
          { type: 'film-room', level: 1 },
          { type: 'weight-room', level: 1 },
          { type: 'medical-center', level: 1 },
          { type: 'scouting-office', level: 1 },
        ];

        for (const building of starterBuildings) {
          await createBuilding({
            user_id: user.id,
            building_type: building.type,
            position_x: 0,
            position_y: 0,
            level: building.level,
          });
        }

        // Reload after creating
        const newBuildings = await getUserBuildings(user.id);
        setBuildings(newBuildings);
      } else {
        // Check if user is missing any of the 7 buildings (for existing users)
        const existingTypes = dbBuildings.map((b: any) => b.building_type);
        const allTypes = ['stadium', 'headquarters', 'practice-field', 'film-room', 'weight-room', 'medical-center', 'scouting-office'];
        const missingTypes = allTypes.filter((t) => !existingTypes.includes(t));

        if (missingTypes.length > 0) {
          for (const type of missingTypes) {
            await createBuilding({
              user_id: user.id,
              building_type: type,
              position_x: 0,
              position_y: 0,
              level: 1,
            });
          }
          const updatedBuildings = await getUserBuildings(user.id);
          setBuildings(updatedBuildings);
        } else {
          setBuildings(dbBuildings);
        }
      }
    } catch (error) {
      console.error('Error loading HQ:', error);
    } finally {
      setBuildingsLoading(false);
    }
  };

  const getBuildingInfo = (type: string) => {
    const info = {
      'stadium': {
        name: 'Stadium',
        icon: 'trophy' as const,
        color: COLORS.accent,
        description: 'Home field advantage, boost match odds',
        upgradeBenefit: '+5% match win bonus',
      },
      'headquarters': {
        name: 'Headquarters',
        icon: 'business' as const,
        color: COLORS.primary,
        description: 'Command center for your club',
        upgradeBenefit: '+10% all production',
      },
      'practice-field': {
        name: 'Practice Field',
        icon: 'football' as const,
        color: COLORS.secondary,
        description: 'Complete drills for coins',
        upgradeBenefit: '+2 coins per drill',
      },
      'film-room': {
        name: 'Film Room',
        icon: 'film' as const,
        color: '#9B59B6',
        description: 'Watch lessons, produce KP',
        upgradeBenefit: '+1 KP per minute',
      },
      'weight-room': {
        name: 'Weight Room',
        icon: 'barbell' as const,
        color: '#E74C3C',
        description: 'Train squad strength',
        upgradeBenefit: '+5 team readiness cap',
      },
      'medical-center': {
        name: 'Medical Center',
        icon: 'medkit' as const,
        color: '#27AE60',
        description: 'Faster energy recovery',
        upgradeBenefit: '-30s energy regen',
      },
      'scouting-office': {
        name: 'Scouting Office',
        icon: 'search' as const,
        color: '#3498DB',
        description: 'Find better prediction odds',
        upgradeBenefit: '+5% prediction accuracy',
      },
    };
    return info[type as keyof typeof info] || {
      name: type,
      icon: 'help' as const,
      color: COLORS.textMuted,
      description: 'Unknown building',
      upgradeBenefit: '',
    };
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
      showToast('This building hasn\'t been built yet!', 'info');
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
      showToast(`You need ${upgradeCost} coins to upgrade this building`, 'error');
      return;
    }

    try {
      // Close modal
      setBuildingDetailsModalVisible(false);

      // Start upgrade with timer
      const result = await startBuildingUpgrade(user.id, buildingId, upgradeCost);

      if (!result.success) {
        showToast(result.error || 'Failed to start upgrade', 'error');
        return;
      }

      // Play upgrade sound
      soundManager.playSound('upgrade_start');
      haptics.medium();

      // Refresh data
      await refreshProfile();
      await loadHQ();

      // Show achievement toast
      const buildingInfo = getBuildingInfo(building.building_type);
      const toastId = `toast-${Date.now()}`;
      setAchievementToasts((prev) => [
        ...prev,
        {
          id: toastId,
          title: 'Upgrade Started!',
          message: `${buildingInfo.name} is being upgraded`,
          icon: 'hammer',
        },
      ]);
    } catch (error) {
      console.error('Error upgrading building:', error);
      showToast('Failed to upgrade building', 'error');
    }
  };

  const handleCompleteUpgrade = async (buildingId: string) => {
    if (!user) return;

    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    try {
      // Complete the upgrade
      const result = await completeBuildingUpgrade(buildingId);

      if (!result.success) {
        showToast(result.error || 'Failed to complete upgrade', 'error');
        return;
      }

      // Play completion sound and shake screen
      soundManager.playSound('upgrade_complete');
      haptics.upgradeComplete();
      shake('heavy'); // Heavy shake for upgrade completion

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

      // Refresh data
      await refreshProfile();
      await loadHQ();
    } catch (error) {
      console.error('Error completing upgrade:', error);
      showToast('Failed to complete upgrade', 'error');
    }
  };

  const handleCollectProduction = async (buildingId: string, amount?: number) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    const collectionAmount = amount || building.production_current || 0;
    if (collectionAmount === 0) return;

    try {
      // Close modal if open
      setBuildingDetailsModalVisible(false);

      // Get building position from strategic layout
      const position = BUILDING_POSITIONS[building.building_type] || { x: 0.5, y: 0.5 };
      const buildingX = position.x * FIELD_WIDTH;
      const buildingY = position.y * FIELD_HEIGHT;

      const animationId = `collect-${Date.now()}`;
      const type = building.production_type === 'kp' ? 'kp' : 'coin';

      // Trigger particle explosion
      setParticleEffects((prev) => [
        ...prev,
        {
          id: `particle-${animationId}`,
          x: buildingX,
          y: buildingY,
          amount: collectionAmount,
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
          amount: collectionAmount,
          type,
        },
      ]);

      // Trigger coin fountain animation
      const fountainId = `fountain-${Date.now()}`;
      setCoinFountains((prev) => [
        ...prev,
        {
          id: fountainId,
          x: buildingX,
          y: buildingY,
          count: Math.min(collectionAmount, 15), // Cap at 15 coins for performance
        },
      ]);

      // Play collection sound (using collect_coin for both types for now)
      soundManager.playSound('collect_coin');
      haptics.coinCollect();

      await collectBuildingProduction(buildingId, collectionAmount);
      await refreshProfile();
      await loadHQ();
    } catch (error) {
      console.error('Error collecting production:', error);
      showToast('Failed to collect production', 'error');
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
              <AnimatedResourceCounter
                value={user?.knowledge_points || 0}
                style={styles.currencyText}
                suffix=" KP"
              />
            </View>
            <View style={styles.currencyItem}>
              <Ionicons name="logo-bitcoin" size={18} color={COLORS.accent} />
              <AnimatedResourceCounter
                value={user?.coins || 0}
                style={styles.currencyText}
              />
            </View>
            <View style={styles.currencyItem}>
              <Ionicons name="flash" size={18} color={COLORS.primary} />
              <View>
                <AnimatedResourceCounter
                  value={user?.energy || 0}
                  style={styles.currencyText}
                  suffix=" / 100"
                />
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

              {/* Loading Skeletons */}
              {buildingsLoading && (
                <>
                  {/* Show 3 skeleton loaders in typical building positions */}
                  {[0, 1, 2].map((index) => {
                    const positions = [
                      { x: 0.25, y: 0.35 }, // Left position (Film Room)
                      { x: 0.5, y: 0.5 },   // Center position (Practice Field)
                      { x: 0.75, y: 0.35 }, // Right position (Stadium)
                    ];
                    const position = positions[index];

                    return (
                      <View
                        key={`skeleton-${index}`}
                        style={[
                          styles.building,
                          {
                            left: position.x * FIELD_WIDTH - 60,
                            top: position.y * FIELD_HEIGHT - 60,
                          },
                        ]}
                      >
                        <BuildingCardSkeleton width={120} height={120} />
                      </View>
                    );
                  })}
                </>
              )}

              {/* Buildings Positioned Strategically */}
              {!buildingsLoading && buildings.map((building, index) => {
                const info = getBuildingInfo(building.building_type);
                const isProducing = building.production_current > 0;
                const isUpgrading = building.is_upgrading === true;
                const position = BUILDING_POSITIONS[building.building_type] || { x: 0.5, y: 0.5 };
                const hasProduction = building.production_type && building.production_type !== 'none';

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

                          {/* Production Timer - Live countdown */}
                          {hasProduction && !isUpgrading && (
                            <BuildingProductionTimer
                              productionType={building.production_type || 'none'}
                              productionRate={building.production_rate || 0}
                              productionCap={building.production_cap || 0}
                              currentProduction={building.production_current || 0}
                              lastCollected={building.production_last_collected || new Date().toISOString()}
                              onUpdate={(newProduction) => {
                                // Update local state for real-time display
                                setBuildings((prev) =>
                                  prev.map((b) =>
                                    b.id === building.id
                                      ? { ...b, production_current: newProduction }
                                      : b
                                  )
                                );
                              }}
                            />
                          )}

                          {/* Upgrade Timer - Overlay when upgrading */}
                          {isUpgrading && building.upgrade_complete_at && (
                            <BuildingUpgradeTimer
                              upgradeCompleteAt={building.upgrade_complete_at}
                              onComplete={() => handleCompleteUpgrade(building.id)}
                            />
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

        {/* Club Statistics Panel */}
        <View style={styles.statsPanel}>
          <View style={styles.statsPanelRow}>
            <View style={styles.clubStat}>
              <Ionicons name="cash-outline" size={20} color={COLORS.accent} />
              <Text style={styles.clubStatValue}>${((user?.coins || 0) * 1000 + (user?.xp || 0) * 100).toLocaleString()}</Text>
              <Text style={styles.clubStatLabel}>Club Value</Text>
            </View>
            <View style={styles.clubStat}>
              <Ionicons name="people-outline" size={20} color={COLORS.primary} />
              <Text style={styles.clubStatValue}>{((user?.level || 1) * 2500 + (user?.streak_days || 0) * 100).toLocaleString()}</Text>
              <Text style={styles.clubStatLabel}>Fan Base</Text>
            </View>
            <View style={styles.clubStat}>
              <Ionicons name="trophy-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.clubStatValue}>#{Math.max(1, 100 - (user?.level || 1) * 5)}</Text>
              <Text style={styles.clubStatLabel}>League Rank</Text>
            </View>
          </View>
        </View>

        {/* Building Upgrades Panel */}
        <View style={styles.upgradesPanel}>
          <Text style={styles.upgradesPanelTitle}>Building Upgrades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.upgradesScrollContent}>
            {buildings.map((building) => {
              const info = getBuildingInfo(building.building_type);
              const upgradeCost = Math.floor(500 * Math.pow(1.5, building.level));
              const canAfford = (user?.coins || 0) >= upgradeCost;
              const isUpgrading = building.is_upgrading === true;

              return (
                <TouchableOpacity
                  key={building.id}
                  style={[styles.upgradeCard, !canAfford && !isUpgrading && styles.upgradeCardDisabled]}
                  onPress={() => {
                    if (!isUpgrading) {
                      setSelectedBuilding(building);
                      setBuildingDetailsModalVisible(true);
                    }
                  }}
                  disabled={isUpgrading}
                >
                  <View style={[styles.upgradeIconContainer, { backgroundColor: info.color + '30' }]}>
                    <Ionicons name={info.icon as any} size={24} color={info.color} />
                  </View>
                  <Text style={styles.upgradeBuildingName} numberOfLines={1}>{info.name}</Text>
                  <Text style={styles.upgradeBuildingLevel}>Level {building.level}</Text>
                  {isUpgrading ? (
                    <View style={styles.upgradingBadge}>
                      <Text style={styles.upgradingText}>Upgrading...</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.upgradeBenefit}>{info.upgradeBenefit}</Text>
                      <View style={[styles.upgradeCostBadge, !canAfford && styles.upgradeCostBadgeDisabled]}>
                        <Ionicons name="logo-bitcoin" size={12} color={canAfford ? COLORS.accent : COLORS.textMuted} />
                        <Text style={[styles.upgradeCostText, !canAfford && styles.upgradeCostTextDisabled]}>
                          {upgradeCost.toLocaleString()}
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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

      {/* Coin Fountains */}
      {coinFountains.map((fountain) => (
        <CoinFountain
          key={fountain.id}
          startPosition={{ x: fountain.x, y: fountain.y }}
          count={fountain.count}
          onComplete={() => {
            setCoinFountains((prev) => prev.filter((f) => f.id !== fountain.id));
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

      {/* Energy Refill Animation */}
      <EnergyRefillAnimation
        visible={showEnergyRefillAnimation}
        onComplete={() => setShowEnergyRefillAnimation(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast({ ...toast, visible: false })}
      />

      {/* Compact Daily Missions (Bottom Tab) */}
      <CompactDailyMissions />
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
    height: height * 0.45,
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
  // Club Statistics Panel
  statsPanel: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statsPanelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  clubStat: {
    alignItems: 'center',
    flex: 1,
  },
  clubStatValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  clubStatLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Building Upgrades Panel
  upgradesPanel: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  upgradesPanelTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  upgradesScrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  upgradeCard: {
    width: 110,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  upgradeCardDisabled: {
    opacity: 0.6,
  },
  upgradeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  upgradeBuildingName: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  upgradeBuildingLevel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  upgradeBenefit: {
    fontSize: 10,
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  upgradeCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  upgradeCostBadgeDisabled: {
    backgroundColor: COLORS.border,
  },
  upgradeCostText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 2,
  },
  upgradeCostTextDisabled: {
    color: COLORS.textMuted,
  },
  upgradingBadge: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  upgradingText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
