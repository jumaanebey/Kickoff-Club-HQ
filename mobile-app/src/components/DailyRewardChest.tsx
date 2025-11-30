import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { soundManager } from '../utils/SoundManager';
import { ParticleSystem } from './ParticleSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DailyRewardChestProps {
    rewards: Array<{
        type: 'coin' | 'kp' | 'energy';
        amount: number;
    }>;
    visible: boolean;
    onClaim: () => void;
}

export const DailyRewardChest: React.FC<DailyRewardChestProps> = ({
    rewards,
    visible,
    onClaim,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const lidRotate = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && !isOpen) {
            // Pulse animation for closed chest
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [visible, isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        soundManager.playSound('upgrade_start'); // Placeholder sound

        Animated.parallel([
            // Stop pulse (handled by state change)
            // Open Lid
            Animated.spring(lidRotate, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            // Show Content
            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(contentOpacity, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.spring(contentScale, {
                        toValue: 1,
                        friction: 6,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();
    };

    const handleClaim = () => {
        soundManager.playSound('collect_coin');
        onClaim();
    };

    if (!visible) return null;

    const lidRotation = lidRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-60deg'],
    });

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <View style={styles.backdrop} />

                {/* Confetti on Open */}
                <ParticleSystem
                    active={isOpen}
                    count={50}
                    origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_WIDTH / 2 }}
                    colors={[COLORS.accent, COLORS.warning, COLORS.white]}
                />

                <View style={styles.content}>
                    <Text style={styles.title}>DAILY REWARD</Text>

                    {/* Chest Container */}
                    <View style={styles.chestContainer}>
                        {!isOpen ? (
                            <TouchableOpacity onPress={handleOpen} activeOpacity={0.9}>
                                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                                    <FontAwesome5 name="gift" size={100} color={COLORS.warning} />
                                    <Text style={styles.tapText}>Tap to Open!</Text>
                                </Animated.View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.openChestContainer}>
                                {/* Chest Base */}
                                <FontAwesome5 name="box-open" size={100} color={COLORS.warning} />

                                {/* Rewards Bursting Out */}
                                <Animated.View
                                    style={[
                                        styles.rewardsContainer,
                                        {
                                            opacity: contentOpacity,
                                            transform: [{ scale: contentScale }]
                                        }
                                    ]}
                                >
                                    {rewards.map((reward, index) => (
                                        <View key={index} style={styles.rewardItem}>
                                            <View style={styles.iconCircle}>
                                                <FontAwesome5
                                                    name={reward.type === 'coin' ? 'coins' : reward.type === 'kp' ? 'star' : 'bolt'}
                                                    size={24}
                                                    color={COLORS.white}
                                                />
                                            </View>
                                            <Text style={styles.rewardAmount}>+{reward.amount}</Text>
                                            <Text style={styles.rewardType}>{reward.type.toUpperCase()}</Text>
                                        </View>
                                    ))}
                                </Animated.View>
                            </View>
                        )}
                    </View>

                    {/* Claim Button */}
                    {isOpen && (
                        <Animated.View style={{ opacity: contentOpacity, width: '100%', marginTop: SPACING.xl }}>
                            <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
                                <Text style={styles.claimText}>CLAIM REWARDS</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    content: {
        width: '85%',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.lg,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.xl,
        color: COLORS.white,
        marginBottom: SPACING.xl,
        letterSpacing: 1,
    },
    chestContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.md,
        color: COLORS.accent,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    openChestContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        gap: SPACING.md,
        bottom: 80, // Float above chest
    },
    rewardItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
    },
    rewardAmount: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.lg,
        color: COLORS.white,
    },
    rewardType: {
        fontFamily: FONTS.medium,
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    claimButton: {
        backgroundColor: COLORS.success,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        width: '100%',
        ...SHADOWS.md,
    },
    claimText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.md,
        color: COLORS.white,
        letterSpacing: 1,
    },
});
