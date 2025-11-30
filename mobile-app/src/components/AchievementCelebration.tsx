import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ParticleSystem } from './ParticleSystem';
import { soundManager } from '../utils/SoundManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AchievementCelebrationProps {
    achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
    };
    visible: boolean;
    onDismiss: () => void;
}

const rarityColors = {
    common: COLORS.primary,
    rare: '#9333EA', // Purple
    epic: '#EAB308', // Gold
    legendary: '#FF0080', // Pink/Rainbow
};

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
    achievement,
    visible,
    onDismiss,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const descAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Play sound
            soundManager.playSound('upgrade_complete'); // Using upgrade_complete as placeholder for achievement

            // Reset animations
            fadeAnim.setValue(0);
            scaleAnim.setValue(0);
            titleAnim.setValue(0);
            descAnim.setValue(0);
            glowAnim.setValue(0);

            // Animation Sequence
            Animated.sequence([
                // 1. Overlay Fade In
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // 2. Trophy Pop
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                // 3. Text Fade In
                Animated.stagger(200, [
                    Animated.timing(titleAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(descAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();

            // Continuous Glow Pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible]);

    if (!visible) return null;

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const glowScale = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });

    const color = rarityColors[achievement.rarity] || COLORS.primary;

    return (
        <Modal transparent visible={visible} animationType="none">
            <TouchableOpacity activeOpacity={1} onPress={onDismiss} style={styles.container}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

                {/* Confetti */}
                <ParticleSystem
                    active={visible}
                    count={100}
                    origin={{ x: SCREEN_WIDTH / 2, y: -50 }}
                    colors={[color, COLORS.white, COLORS.accent]}
                />

                <View style={styles.content}>
                    {/* Trophy Container */}
                    <View style={styles.trophyContainer}>
                        {/* Glow Effect */}
                        <Animated.View
                            style={[
                                styles.glow,
                                {
                                    backgroundColor: color,
                                    opacity: glowOpacity,
                                    transform: [{ scale: glowScale }],
                                },
                            ]}
                        />

                        {/* Trophy Icon */}
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <FontAwesome5 name={achievement.icon} size={80} color={color} />
                        </Animated.View>
                    </View>

                    {/* Text Content */}
                    <Animated.View
                        style={[
                            styles.textContainer,
                            {
                                opacity: titleAnim,
                                transform: [
                                    {
                                        translateY: titleAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={[styles.rarityText, { color }]}>
                            {achievement.rarity.toUpperCase()} UNLOCKED!
                        </Text>
                        <Text style={styles.title}>{achievement.title}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            {
                                opacity: descAnim,
                                transform: [
                                    {
                                        translateY: descAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text style={styles.description}>{achievement.description}</Text>
                        <Text style={styles.dismissText}>Tap to continue</Text>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    content: {
        alignItems: 'center',
        width: '80%',
    },
    trophyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
        width: 150,
        height: 150,
    },
    glow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        zIndex: -1,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    rarityText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
        letterSpacing: 2,
        marginBottom: SPACING.xs,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.xxl,
        color: COLORS.white,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    description: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    dismissText: {
        fontFamily: FONTS.regular,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
});
