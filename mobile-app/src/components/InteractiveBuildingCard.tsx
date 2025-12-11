import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ViewStyle, GestureResponderEvent, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { BuildingConstructionOverlay } from './BuildingConstructionOverlay';
import { GameIcon } from './GameIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2; // 2 columns
const CARD_HEIGHT = CARD_WIDTH * 1.2;

interface InteractiveBuildingCardProps {
    buildingType: string;
    name: string;
    level: number;
    icon: string;
    isProducing: boolean;
    isUpgrading: boolean;
    canCollect: boolean;
    canUpgrade: boolean;
    productionProgress: number; // 0-100
    constructionTimeSeconds?: number;
    constructionStartedAt?: string;
    upgradeCompleteAt?: string;
    onPress: () => void;
    onLongPress?: () => void;
    onCollect?: () => void;
    onConstructionComplete?: () => void;
    style?: ViewStyle;
}

export const InteractiveBuildingCard: React.FC<InteractiveBuildingCardProps> = ({
    buildingType,
    name,
    level,
    icon,
    isProducing,
    isUpgrading,
    canCollect,
    canUpgrade,
    productionProgress,
    constructionTimeSeconds,
    constructionStartedAt,
    upgradeCompleteAt,
    onPress,
    onLongPress,
    onCollect,
    onConstructionComplete,
    style,
}) => {
    // Animations
    const scale = useRef(new Animated.Value(1)).current;
    const rotateX = useRef(new Animated.Value(0)).current;
    const rotateY = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    // Idle Animation (Float)
    useEffect(() => {
        if (!isUpgrading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, { toValue: -5, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                    Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                ])
            ).start();
        } else {
            floatAnim.setValue(0);
        }
    }, [isUpgrading]);

    // Glow Animation (Pulse)
    useEffect(() => {
        if (canCollect || canUpgrade) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
                    Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
                ])
            ).start();
        } else {
            glowAnim.setValue(0);
        }
    }, [canCollect, canUpgrade]);

    const handlePressIn = (event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        const centerX = CARD_WIDTH / 2;
        const centerY = CARD_HEIGHT / 2;

        // Calculate tilt (max 10 degrees)
        const tiltX = ((locationY - centerY) / centerY) * 10;
        const tiltY = ((locationX - centerX) / centerX) * -10;

        Animated.parallel([
            Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
            Animated.spring(rotateX, { toValue: tiltX, useNativeDriver: true }),
            Animated.spring(rotateY, { toValue: tiltY, useNativeDriver: true }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
            Animated.spring(rotateX, { toValue: 0, useNativeDriver: true }),
            Animated.spring(rotateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
    };

    const handlePress = () => {
        if (canCollect && onCollect) {
            onCollect();
        } else {
            onPress();
        }
    };

    // Interpolations
    const borderColor = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, canCollect ? COLORS.success : canUpgrade ? COLORS.primary : COLORS.border],
    });

    const borderWidth = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
    });

    const shadowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.3],
    });

    // Radial Progress
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (productionProgress / 100) * circumference;

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                {
                    transform: [
                        { scale },
                        { perspective: 1000 },
                        { rotateX: rotateX.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) },
                        { rotateY: rotateY.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) },
                        { translateY: floatAnim },
                    ],
                },
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={handlePress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchable}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            borderColor,
                            borderWidth,
                            shadowColor: canCollect ? COLORS.success : canUpgrade ? COLORS.primary : COLORS.black,
                            shadowOpacity,
                        },
                    ]}
                >
                    {/* Background Icon (Faded) */}
                    <View style={styles.bgIconContainer}>
                        <GameIcon name={icon} size={80} style={{ opacity: 0.1 }} />
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>{level}</Text>
                            </View>
                            {canUpgrade && !isUpgrading && (
                                <View style={styles.upgradeBadge}>
                                    <GameIcon name="upgrade" size={12} />
                                </View>
                            )}
                        </View>

                        {/* Main Icon */}
                        <View style={styles.mainIconContainer}>
                            {isProducing && !canCollect && !isUpgrading && (
                                <View style={styles.progressRing}>
                                    <Svg width={52} height={52}>
                                        <Circle
                                            cx={26}
                                            cy={26}
                                            r={radius}
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth={3}
                                            fill="none"
                                        />
                                        <Circle
                                            cx={26}
                                            cy={26}
                                            r={radius}
                                            stroke={COLORS.primary}
                                            strokeWidth={3}
                                            fill="none"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 26 26)"
                                        />
                                    </Svg>
                                </View>
                            )}

                            <GameIcon
                                name={icon}
                                size={40}
                                style={isUpgrading ? { opacity: 0.5 } : {}}
                            />

                            {canCollect && (
                                <View style={styles.collectIcon}>
                                    <GameIcon name="check" size={14} />
                                </View>
                            )}
                        </View>

                        {/* Name */}
                        <Text style={styles.name} numberOfLines={1}>{name}</Text>

                        {/* Status Text */}
                        <Text style={[styles.status, { color: canCollect ? COLORS.success : COLORS.textMuted }]}>
                            {isUpgrading ? 'Upgrading...' : canCollect ? 'COLLECT' : canUpgrade ? 'Upgrade' : 'Active'}
                        </Text>
                    </View>

                    {/* Construction Overlay */}
                    {isUpgrading && constructionTimeSeconds && constructionStartedAt && (
                        <View style={styles.constructionOverlay}>
                            <BuildingConstructionOverlay
                                buildingType={buildingType}
                                constructionTimeSeconds={constructionTimeSeconds}
                                constructionStartedAt={constructionStartedAt}
                                onComplete={onConstructionComplete || (() => { })}
                                width={CARD_WIDTH - 4} // Account for border
                                height={CARD_HEIGHT - 4}
                            />
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        margin: SPACING.xs,
    },
    touchable: {
        flex: 1,
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.md,
    },
    bgIconContainer: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        transform: [{ rotate: '-15deg' }],
    },
    content: {
        flex: 1,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    levelBadge: {
        backgroundColor: COLORS.backgroundLight,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    levelText: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.text,
    },
    upgradeBadge: {
        backgroundColor: COLORS.primary,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    mainIconContainer: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
    },
    progressRing: {
        position: 'absolute',
    },
    collectIcon: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.success,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.backgroundCard,
    },
    name: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
        color: COLORS.white,
        textAlign: 'center',
    },
    status: {
        fontFamily: FONTS.medium,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    constructionOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
});
