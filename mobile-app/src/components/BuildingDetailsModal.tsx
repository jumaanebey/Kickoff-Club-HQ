import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getBuildingAsset } from '../constants/assets';
import { AnimatedButton } from './AnimatedButton';

interface BuildingDetailsModalProps {
  visible: boolean;
  building: any;
  onClose: () => void;
  onUpgrade: (buildingId: string) => void;
  onCollect?: (buildingId: string) => void;
}

export default function BuildingDetailsModal({
  visible,
  building,
  onClose,
  onUpgrade,
  onCollect,
}: BuildingDetailsModalProps) {
  if (!building) return null;

  const getBuildingInfo = (type: string) => {
    const info: Record<string, any> = {
      'stadium': {
        name: 'Stadium',
        description: 'Host matches and boost team readiness',
        color: COLORS.accent,
        benefits: [
          { icon: 'people', label: 'Capacity', value: `${5000 * building.level}` },
          { icon: 'trophy', label: 'Win Bonus', value: `+${building.level * 10}%` },
          { icon: 'stats-chart', label: 'Readiness', value: `+${building.level * 5}%` },
        ],
      },
      'practice-field': {
        name: 'Practice Field',
        description: 'Train your units to increase readiness',
        color: COLORS.secondary,
        benefits: [
          { icon: 'flash', label: 'Training Speed', value: `+${building.level * 15}%` },
          { icon: 'trophy', label: 'Max Readiness', value: `${80 + building.level * 4}%` },
          { icon: 'people', label: 'Unit Slots', value: `${building.level + 2}` },
        ],
      },
      'film-room': {
        name: 'Film Room',
        description: 'Study game film to earn Knowledge Points',
        color: COLORS.primary,
        benefits: [
          { icon: 'school', label: 'KP/hour', value: `${building.level * 5}` },
          { icon: 'time', label: 'Max Storage', value: `${building.level * 50}` },
          { icon: 'videocam', label: 'Lessons', value: `+${building.level * 2}` },
        ],
      },
      'weight-room': {
        name: 'Weight Room',
        description: 'Build strength and increase unit power',
        color: '#C41E3A',
        benefits: [
          { icon: 'fitness', label: 'Strength', value: `+${building.level * 10}%` },
          { icon: 'trending-up', label: 'XP Gain', value: `+${building.level * 5}%` },
          { icon: 'timer', label: 'Recovery', value: `-${building.level * 10}%` },
        ],
      },
      'headquarters': {
        name: 'Headquarters',
        description: 'Command center for your football empire',
        color: '#13274F',
        benefits: [
          { icon: 'business', label: 'Coin Cap', value: `${building.level * 1000}` },
          { icon: 'flash', label: 'Energy Cap', value: `${100 + building.level * 10}` },
          { icon: 'construct', label: 'Build Slots', value: `${building.level + 4}` },
        ],
      },
    };
    return info[type] || info['stadium'];
  };

  const info = getBuildingInfo(building.building_type);
  const upgradeCost = Math.floor(500 * Math.pow(1.5, building.level));
  const canUpgrade = building.level < 5;
  const hasRealAsset = building.building_type === 'stadium' && (building.level === 1 || building.level === 5);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: info.color }]}>
            <View>
              <Text style={styles.headerTitle}>{info.name}</Text>
              <Text style={styles.headerSubtitle}>Level {building.level}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Building Image */}
            <View style={styles.imageContainer}>
              {hasRealAsset ? (
                <Image
                  source={getBuildingAsset(
                    building.building_type as 'stadium',
                    building.level
                  )}
                  style={styles.buildingImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: info.color + '20' }]}>
                  <Ionicons name="business" size={80} color={info.color} />
                </View>
              )}
            </View>

            {/* Description */}
            <Text style={styles.description}>{info.description}</Text>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.sectionTitle}>Current Benefits</Text>
              {info.benefits.map((benefit: any, index: number) => (
                <View key={index} style={styles.benefitRow}>
                  <Ionicons name={benefit.icon} size={20} color={info.color} />
                  <Text style={styles.benefitLabel}>{benefit.label}:</Text>
                  <Text style={styles.benefitValue}>{benefit.value}</Text>
                </View>
              ))}
            </View>

            {/* Production (if applicable) */}
            {building.production_current > 0 && onCollect && (
              <View style={styles.collectButtonContainer}>
                <AnimatedButton
                  variant="success"
                  size="lg"
                  onPress={() => onCollect(building.id)}
                >
                  Collect {building.production_current} {building.production_type === 'kp' ? 'KP' : 'Coins'}
                </AnimatedButton>
              </View>
            )}

            {/* Upgrade Section */}
            {building.is_upgrading ? (
              <View style={styles.upgradingContainer}>
                <Ionicons name="hammer" size={48} color={info.color} />
                <Text style={styles.upgradingText}>Upgrade in Progress</Text>
                <Text style={styles.upgradingSubtext}>Check back soon to complete!</Text>
              </View>
            ) : canUpgrade ? (
              <View style={styles.upgradeContainer}>
                <View style={styles.upgradeDivider} />
                <Text style={styles.sectionTitle}>Upgrade to Level {building.level + 1}</Text>

                <View style={styles.upgradePreview}>
                  <Text style={styles.upgradePreviewLabel}>Next Level Benefits:</Text>
                  {info.benefits.map((benefit: any, index: number) => {
                    const nextValue = benefit.value.replace(/\d+/, (match: string) => {
                      const num = parseInt(match);
                      const increase = Math.floor(num * 0.2); // 20% increase
                      return (num + increase).toString();
                    });
                    return (
                      <View key={index} style={styles.upgradePreviewRow}>
                        <Ionicons name={benefit.icon} size={16} color={COLORS.textMuted} />
                        <Text style={styles.upgradePreviewText}>
                          {benefit.label}: {benefit.value} → {nextValue}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.upgradeButtonContainer}>
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onPress={() => onUpgrade(building.id)}
                  >
                    Upgrade for {upgradeCost} Coins
                  </AnimatedButton>
                </View>
              </View>
            ) : (
              <View style={styles.maxLevelContainer}>
                <Ionicons name="star" size={48} color={COLORS.accent} />
                <Text style={styles.maxLevelText}>Maximum Level Reached!</Text>
                <Text style={styles.maxLevelSubtext}>This building is fully upgraded</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.white + 'CC',
    marginTop: 2,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.backgroundLight,
  },
  buildingImage: {
    width: 200,
    height: 200,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  benefitsContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  benefitLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  benefitValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  collectButtonContainer: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  upgradeContainer: {
    padding: SPACING.lg,
  },
  upgradingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  upgradingText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  upgradingSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  upgradeDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  upgradePreview: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  upgradePreviewLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  upgradePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  upgradePreviewText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  upgradeButtonContainer: {
    marginTop: SPACING.md,
  },
  maxLevelContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  maxLevelText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  maxLevelSubtext: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
