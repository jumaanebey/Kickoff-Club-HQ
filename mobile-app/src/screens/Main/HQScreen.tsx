import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GameIcon } from '../../components/GameIcon';
import { useAuth } from '../../context/AuthContext';
import { getUserBuildings, createBuilding, refillEnergy, upgradeBuilding, collectBuildingProduction, startBuildingUpgrade, completeBuildingUpgrade } from '../../services/supabase';
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
import { CoinFountain } from '../../components/CoinFountain';
import { BuildingCardSkeleton } from '../../components/BuildingCardSkeleton';
import { AnimatedResourceCounter } from '../../components/AnimatedResourceCounter';
import { EnergyRefillAnimation } from '../../components/EnergyRefillAnimation';
import { Toast } from '../../components/Toast';
import { BuildingConstructionOverlay } from '../../components/BuildingConstructionOverlay';
import { AchievementCelebration } from '../../components/AchievementCelebration';
import { LevelUpCelebration } from '../../components/LevelUpCelebration';
import { InteractiveBuildingCard } from '../../components/InteractiveBuildingCard';
import { PremiumShopModal } from '../../components/PremiumShopModal';
import { TutorialOverlay } from '../../components/TutorialOverlay';
import { TUTORIAL_STEPS } from '../../data/tutorialSteps';
import { AnimatedCoinCollect, AnimatedBuildingUpgrade, AnimatedProgressBar } from '../../components/animations';
import { LEVEL_UNLOCKS } from '../../constants/gameData';
import { getPackages, purchasePackage, IAPPackage } from '../../services/iap';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getBuildingAsset } from '../../constants/assets';

const { width, height } = Dimensions.get('window');

// Football field dimensions - larger canvas for strategic placement
const FIELD_WIDTH = width * 1.8;
const FIELD_HEIGHT = height * 2;

// Card dimensions for positioning
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

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
  const [achievementCelebration, setAchievementCelebration] = useState<{
    visible: boolean;
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
      reward: { type: 'kp' | 'coins'; amount: number };
    } | null;
  }>({ visible: false, achievement: null });
  const [levelUpCelebration, setLevelUpCelebration] = useState<{
    visible: boolean;
    oldLevel: number;
    newLevel: number;
    unlocksEarned: any[];
  }>({ visible: false, oldLevel: 0, newLevel: 0, unlocksEarned: [] });

  // Premium Shop State
  const [premiumShopVisible, setPremiumShopVisible] = useState(false);
  const [shopPackages, setShopPackages] = useState<IAPPackage[]>([]);

  // Tutorial State
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if new user (level 1, no buildings or just starter) to start tutorial
    // For now, simpler check: if level 1 and we haven't shown it this session
    if (user?.level === 1 && !showTutorial && tutorialStepIndex === 0) {
      // Small delay to let things load
      setTimeout(() => setShowTutorial(true), 1500);
    }
  }, [user]);

  const handleTutorialNext = () => {
    if (tutorialStepIndex < TUTORIAL_STEPS.length - 1) {
      setTutorialStepIndex(prev => prev + 1);
      soundManager.playSound('button_tap');
    } else {
      // Init finished
      setShowTutorial(false);
      soundManager.playSound('achievement_unlock');
      // TODO: Save 'tutorial_completed' to user profile if we had that field
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };


  const prevLevelRef = React.useRef(user?.level || 1);

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
    if (user?.level && user.level > prevLevelRef.current) {
      // Level Up!
      soundManager.playSound('level_up');
      const unlocks = LEVEL_UNLOCKS[user.level] || [];
      setLevelUpCelebration({
        visible: true,
        oldLevel: prevLevelRef.current,
        newLevel: user.level,
        unlocksEarned: unlocks,
      });
      prevLevelRef.current = user.level;
    } else if (user?.level) {
      prevLevelRef.current = user.level;
    }
  }, [user?.level]);

  useEffect(() => {
    loadBuildings();
    loadIAPPackages();
    // Refill energy when screen loads
    // TODO: Replace with manual refill button trigger in future
    if (user) {
      refillEnergy(user.id).then(() => {
        // Trigger energy refill animation
        setShowEnergyRefillAnimation(true);
        soundManager.playSound('energy_refill');
        refreshProfile();
      });
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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
  };

  const loadBuildings = async () => {
    if (!user) return;

    try {
      setBuildingsLoading(true);
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
    } finally {
      setBuildingsLoading(false);
    }
  };

  const getBuildingInfo = (type: string, level: number = 1) => {
    // Helper to determine icon based on level
    const getIcon = (baseType: string, lvl: number) => {
      // List of buildings that have Level 2 assets
      const hasLevel2 = ['stadium', 'practice-field', 'film-room', 'headquarters', 'weight-room'];

      if (lvl >= 2 && hasLevel2.includes(baseType)) {
        return `${baseType}-2` as any;
      }
      return baseType as any; // Cast to satisfy TS, GameIcon handles the string
    };

    const info = {
      'film-room': {
        name: 'Film Room',
        icon: getIcon('film-room', level),
        color: COLORS.primary,
        description: 'Watch lessons, produce KP',
      },
      'practice-field': {
        name: 'Practice Field',
        icon: getIcon('practice-field', level),
        color: COLORS.secondary,
        description: 'Complete drills for coins',
      },
      'stadium': {
        name: 'Stadium',
        icon: getIcon('stadium', level),
        color: COLORS.accent,
        description: 'Boost predictions',
      },
      'headquarters': {
        name: 'Headquarters',
        icon: getIcon('headquarters', level),
        color: COLORS.primary,
        description: 'Main Hub',
      },
      'weight-room': {
        name: 'Weight Room',
        icon: getIcon('weight-room', level),
        color: COLORS.secondary,
        description: 'Train players',
      },
      'locker-room': {
        name: 'Locker Room',
        icon: 'locker-room',
        color: COLORS.primary,
        description: 'Store achievements',
      },
      'draft-room': {
        name: 'Draft Room',
        icon: 'draft-room',
        color: COLORS.secondary,
        description: 'Collect player cards',
      },
      'concession': {
        name: 'Concession Stand',
        icon: 'concession',
        color: COLORS.accent,
        description: 'Buy exclusive merch',
      },
    };
    return info[type as keyof typeof info] || info['headquarters'];
  };

  const loadIAPPackages = async () => {
    try {
      const packages = await getPackages();
      setShopPackages(packages);
    } catch (error) {
      console.error('Failed to load IAP packages', error);
    }
  };

  const handlePurchasePackage = async (packageId: string) => {
    if (!user) return;
    try {
      await purchasePackage(user.id, packageId);
      await refreshProfile(); // Update coin balance
      // Success toast is handled in PremiumShopModal
    } catch (error) {
      console.error('Purchase failed', error);
      showToast('Purchase failed. Please try again.', 'error');
    }
  };

  const handleBuildingPress = (building: any) => {
    soundManager.playSound('button_tap');

    // Tutorial Logic: Advance if step is "tap_building"
    if (showTutorial && TUTORIAL_STEPS[tutorialStepIndex]?.action === 'tap') {
      handleTutorialNext();
    }

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

      // Tutorial Logic: Advance if step is "upgrade_building"
      if (showTutorial && TUTORIAL_STEPS[tutorialStepIndex]?.action === 'upgrade') {
        handleTutorialNext();
      }

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
      await loadBuildings();

      // Show achievement toast
      const buildingInfo = getBuildingInfo(building.building_type, building.level);
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

      // Trigger achievement celebration
      const buildingInfo = getBuildingInfo(building.building_type, building.level + 1);
      soundManager.playSound('achievement_unlock');
      setAchievementCelebration({
        visible: true,
        achievement: {
          id: `upgrade-${building.id}-${building.level + 1}`,
          title: `${buildingInfo.name} Upgraded!`,
          description: `Successfully upgraded to Level ${building.level + 1}. Production increased!`,
          icon: buildingInfo.icon,
          rarity: building.level + 1 >= 5 ? 'epic' : building.level + 1 >= 3 ? 'rare' : 'common',
          reward: { type: 'kp', amount: 10 * (building.level + 1) },
        },
      });

      // Trigger achievement toast (fallback/additional)
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
      await loadBuildings();
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

      // Tutorial Logic: Advance if step is "collect_resources"
      if (showTutorial && TUTORIAL_STEPS[tutorialStepIndex]?.action === 'collect') {
        handleTutorialNext();
      }

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
      await loadBuildings();
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
            <TouchableOpacity onPress={() => setPremiumShopVisible(true)} activeOpacity={0.8}>
              <View style={styles.currencyItem}>
                <GameIcon name="kp" size={20} style={{ marginRight: 4 }} />
                <AnimatedResourceCounter
                  value={user?.knowledge_points || 0}
                  style={styles.currencyText}
                  suffix=" KP"
                />
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={10} color={COLORS.white} />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.resourceItem}>
              <GameIcon name="coins" size={22} style={{ marginRight: 4 }} />
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 12,
                  width: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 4,
                }}
                onPress={() => setPremiumShopVisible(true)}
              >
                <Ionicons name="add" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.currencyItem}>
              <GameIcon name="energy" size={20} style={{ marginRight: 4 }} />
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
                const info = getBuildingInfo(building.building_type, building.level);
                const isProducing = building.production_current > 0;
                const isUpgrading = building.is_upgrading === true;
                const position = BUILDING_POSITIONS[building.building_type] || { x: 0.5, y: 0.5 };
                const hasProduction = building.production_type && building.production_type !== 'none';

                // Calculate canCollect and productionProgress
                const canCollect = hasProduction && building.production_current > 0 && !isUpgrading;
                const productionProgress = hasProduction && building.production_cap > 0
                  ? building.production_current / building.production_cap
                  : 0;

                return (
                  <InteractiveBuildingCard
                    key={building.id}
                    buildingType={building.building_type}
                    name={info.name}
                    level={building.level}
                    icon={info.icon}
                    isProducing={isProducing}
                    isUpgrading={isUpgrading}
                    canCollect={canCollect}
                    canUpgrade={!isUpgrading} // Simplified for now, should check cost
                    productionProgress={productionProgress * 100}
                    constructionTimeSeconds={building.upgrade_duration_seconds || 60}
                    constructionStartedAt={building.upgrade_started_at}
                    upgradeCompleteAt={building.upgrade_complete_at}
                    onPress={() => handleBuildingPress(building)}
                    onCollect={() => handleCollectProduction(building.id)}
                    onConstructionComplete={() => handleCompleteUpgrade(building.id)}
                    style={{
                      position: 'absolute',
                      left: position.x * FIELD_WIDTH - CARD_WIDTH / 2,
                      top: position.y * FIELD_HEIGHT - CARD_HEIGHT / 2,
                      zIndex: Math.floor(position.y * 100), // Depth sorting
                    }}
                  />
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
            loadBuildings();
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

        {/* Tutorial Overlay */}
        {showTutorial && TUTORIAL_STEPS[tutorialStepIndex] && (
          <TutorialOverlay
            isVisible={showTutorial}
            text={TUTORIAL_STEPS[tutorialStepIndex].message}
            target={
              TUTORIAL_STEPS[tutorialStepIndex].position
                ? {
                  x: (TUTORIAL_STEPS[tutorialStepIndex].position?.x || 0) - 50, // Center abstractly
                  y: (TUTORIAL_STEPS[tutorialStepIndex].position?.y || 0) - 50,
                  width: 100,
                  height: 100
                }
                : undefined
            }
            onNext={handleTutorialNext}
            onSkip={handleTutorialSkip}
            isLastStep={tutorialStepIndex === TUTORIAL_STEPS.length - 1}
          />
        )}

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

        {/* Achievement Celebration */}
        {achievementCelebration.visible && achievementCelebration.achievement && (
          <AchievementCelebration
            visible={achievementCelebration.visible}
            achievement={achievementCelebration.achievement}
            onDismiss={() => setAchievementCelebration(prev => ({ ...prev, visible: false }))}
          />
        )}

        {/* Level Up Celebration */}
        {levelUpCelebration && (
          <LevelUpCelebration
            visible={levelUpCelebration.visible}
            oldLevel={levelUpCelebration.oldLevel}
            newLevel={levelUpCelebration.newLevel}
            unlocksEarned={levelUpCelebration.unlocksEarned}
            onDismiss={() => setLevelUpCelebration(prev => ({ ...prev, visible: false }))}
          />
        )}

        {/* Premium Shop Modal */}
        <PremiumShopModal
          visible={premiumShopVisible}
          packages={shopPackages}
          onClose={() => setPremiumShopVisible(false)}
          onPurchase={async (id) => {
            if (!user) return;
            await purchasePackage(user.id, id);
            await refreshProfile();
          }}
        />

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
      <PremiumShopModal
        visible={premiumShopVisible}
        packages={shopPackages}
        onClose={() => setPremiumShopVisible(false)}
        onPurchase={async (id) => {
          if (!user) return;
          await purchasePackage(user.id, id);
          await refreshProfile();
        }}
      />
    </GestureHandlerRootView >
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
  plusBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  resourceText: {
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
    backgroundColor: COLORS.background,
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
    backgroundColor: 'rgba(62, 39, 35, 0.8)', // Deep Brown semi-transparent
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
    backgroundColor: 'rgba(62, 39, 35, 0.8)', // Deep Brown semi-transparent
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
