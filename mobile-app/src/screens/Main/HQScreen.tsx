import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { getUserBuildings, createBuilding, refillEnergy } from '../../services/supabase';
import FilmRoomModal from '../../components/FilmRoomModal';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - SPACING.lg * 2) / 3;

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
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<any | null>(null);
  const [filmRoomModalVisible, setFilmRoomModalVisible] = useState(false);

  useEffect(() => {
    loadHQ();
    // Refill energy when screen loads
    if (user) {
      refillEnergy(user.id);
    }
  }, [user]);

  const loadHQ = async () => {
    if (!user) return;

    try {
      // Load user's buildings from database
      const dbBuildings = await getUserBuildings(user.id);

      // If no buildings exist, create starter building (Film Room)
      if (dbBuildings.length === 0) {
        await createBuilding({
          user_id: user.id,
          building_type: 'film-room',
          position_x: 0,
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
      // Open Practice Field modal (to be implemented)
    }
    // Add other building types as they're implemented
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
            <Text style={styles.currencyText}>{user?.energy || 0}</Text>
          </View>
        </View>
      </View>

      {/* XP Progress Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.xpFill,
              { width: `${((user?.xp || 0) / ((user?.level || 1) * 100)) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.xpText}>
          {user?.xp || 0} / {(user?.level || 1) * 100} XP
        </Text>
      </View>

      {/* HQ Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {buildings.map((building) => {
            const info = getBuildingInfo(building.building_type);
            const isProducing = building.production_current > 0;

            return (
              <TouchableOpacity
                key={building.id}
                style={[
                  styles.buildingSlot,
                  {
                    left: building.position_x * GRID_SIZE,
                    top: building.position_y * GRID_SIZE,
                  },
                ]}
                onPress={() => handleBuildingPress(building)}
              >
                {building.level > 0 ? (
                  /* Built Building */
                  <LinearGradient
                    colors={[info.color + '40', info.color + '20']}
                    style={[styles.building, SHADOWS.md]}
                  >
                    <Ionicons name={info.icon} size={40} color={info.color} />
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
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.helpText}>
            Build and upgrade buildings to earn Knowledge Points and coins!
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

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
  xpContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  xpBar: {
    height: 8,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
  },
  xpText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    height: GRID_SIZE * 2 + SPACING.md,
    position: 'relative',
  },
  buildingSlot: {
    position: 'absolute',
    width: GRID_SIZE - SPACING.sm,
    height: GRID_SIZE - SPACING.sm,
  },
  building: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  buildingName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  buildingLevel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
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
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight,
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
  lockedSlot: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  lockedText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.lg,
    marginTop: GRID_SIZE * 2 + SPACING.xl,
  },
  helpText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
