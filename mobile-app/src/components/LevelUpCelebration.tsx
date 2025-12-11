import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, Easing } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ParticleSystem } from './ParticleSystem';
import { soundManager } from '../utils/SoundManager';
import { GameIcon } from './GameIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Unlock {
    type: 'building' | 'feature' | 'reward';
    name: string;
    icon: string;
    description: string;
}

interface LevelUpCelebrationProps {
    visible: boolean;
    oldLevel: number;
    newLevel: number;
    unlocksEarned: Unlock[];
    onDismiss: () => void;
}

const COLORS_THEME = {
    starburst: ['#FFD700', '#FFA500', '#FF8C00'],
    particle1: '#FFFF00',
    particle2: '#FFA500',
    particle3: '#FFFFFF',
    levelText: '#FFD700',
    levelGlow: 'rgba(255, 215, 0, 0.5)',
};

const UnlockCard: React.FC<{ unlock: Unlock; delay: number }> = ({ unlock, delay }) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -5, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.unlockCard,
                {
                    opacity: opacityAnim,
                    transform: [{ translateY: slideAnim }, { translateY: floatAnim }],
                },
            ]}
        >
            <View style={styles.iconContainer}>
                <GameIcon name={unlock.icon} size={24} />
            </View>
            <View style={styles.unlockContent}>
                <Text style={styles.unlockType}>{unlock.type.toUpperCase()} UNLOCKED</Text>
                <Text style={styles.unlockName}>{unlock.name}</Text>
                <Text style={styles.unlockDesc}>{unlock.description}</Text>
            </View>
        </Animated.View>
    );
};

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
    visible,
    oldLevel,
    newLevel,
    unlocksEarned,
    onDismiss,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const levelScaleAnim = useRef(new Animated.Value(0)).current;
    const dismissAnim = useRef(new Animated.Value(0)).current;

    const [showUnlocks, setShowUnlocks] = useState(false);

    useEffect(() => {
        if (visible) {
            // Reset
            fadeAnim.setValue(0);
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            levelScaleAnim.setValue(0);
            dismissAnim.setValue(0);
            setShowUnlocks(false);

            // Play Sound
            // soundManager.playSound('level_up'); // Placeholder

            // 1. Opening
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.loop(
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 10000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ),
            ]).start();

            // 2. Level Number
            Animated.sequence([
                Animated.delay(800),
                Animated.spring(levelScaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShowUnlocks(true);
            });

            // 3. Dismiss Prompt
            Animated.sequence([
                Animated.delay(4500),
                Animated.timing(dismissAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(dismissAnim, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
                        Animated.timing(dismissAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    ])
                ),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal transparent visible={visible} animationType="none">
            <TouchableOpacity activeOpacity={1} onPress={onDismiss} style={styles.container}>
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />

                {/* Starburst Rays */}
                <Animated.View
                    style={[
                        styles.starburstContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }, { rotate: spin }],
                        },
                    ]}
                >
                    {[...Array(8)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.ray,
                                { transform: [{ rotate: `${i * 45}deg` }] },
                            ]}
                        />
                    ))}
                </Animated.View>

                {/* Particles */}
                <ParticleSystem
                    active={visible}
                    count={80}
                    origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 3 }}
                    colors={[COLORS_THEME.particle1, COLORS_THEME.particle2, COLORS_THEME.particle3]}
                />

                {/* Level Number */}
                <View style={styles.levelContainer}>
                    <Animated.Text style={[styles.levelLabel, { opacity: fadeAnim }]}>
                        LEVEL UP!
                    </Animated.Text>
                    <Animated.View
                        style={[
                            styles.levelNumberContainer,
                            { transform: [{ scale: levelScaleAnim }] },
                        ]}
                    >
                        <Text style={styles.levelNumber}>{newLevel}</Text>
                    </Animated.View>
                </View>

                {/* Unlocks */}
                {showUnlocks && (
                    <View style={styles.unlocksContainer}>
                        {unlocksEarned.slice(0, 3).map((unlock, index) => (
                            <UnlockCard key={index} unlock={unlock} delay={index * 200} />
                        ))}
                        {unlocksEarned.length > 3 && (
                            <Animated.Text style={[styles.moreText, { opacity: dismissAnim }]}>
                                + {unlocksEarned.length - 3} more unlocks
                            </Animated.Text>
                        )}
                    </View>
                )}

                {/* Dismiss Prompt */}
                <Animated.View style={[styles.dismissContainer, { opacity: dismissAnim }]}>
                    <Text style={styles.dismissText}>Tap to continue</Text>
                </Animated.View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    starburstContainer: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 3 - 200,
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ray: {
        position: 'absolute',
        width: 4,
        height: 400,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderRadius: 2,
    },
    levelContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
        marginTop: -100,
    },
    levelLabel: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.xl,
        color: COLORS.white,
        letterSpacing: 4,
        marginBottom: SPACING.md,
        textShadowColor: COLORS.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    levelNumberContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: COLORS_THEME.levelText,
        shadowColor: COLORS_THEME.levelText,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 20,
    },
    levelNumber: {
        fontFamily: FONTS.bold,
        fontSize: 64,
        color: COLORS_THEME.levelText,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    unlocksContainer: {
        width: '100%',
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.xl,
    },
    unlockCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    unlockContent: {
        flex: 1,
    },
    unlockType: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.accent,
        marginBottom: 2,
    },
    unlockName: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.md,
        color: COLORS.white,
        marginBottom: 2,
    },
    unlockDesc: {
        fontFamily: FONTS.regular,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textSecondary,
    },
    moreText: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    dismissContainer: {
        position: 'absolute',
        bottom: SPACING.xxl,
    },
    dismissText: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.md,
        color: COLORS.white,
        opacity: 0.8,
    },
});
