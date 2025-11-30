import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface BuildingUpgradeTimerProps {
    startTime: string; // ISO string
    endTime: string; // ISO string
    onComplete?: () => void;
    onFinishTap?: () => void;
    isActive: boolean;
}

export const BuildingUpgradeTimer: React.FC<BuildingUpgradeTimerProps> = ({
    startTime,
    endTime,
    onComplete,
    onFinishTap,
    isActive
}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Animation values
    const hammerRotate = useRef(new Animated.Value(0)).current;
    const pulseScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isActive) return;

        const calculateTime = () => {
            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();
            const now = new Date().getTime();

            const total = end - start;
            const remaining = Math.max(0, end - now);

            setTimeLeft(remaining);
            setProgress(Math.min(1, Math.max(0, 1 - remaining / total)));

            if (remaining <= 0 && !isFinished) {
                setIsFinished(true);
                if (onComplete) onComplete();
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime, endTime, onComplete, isFinished]);

    useEffect(() => {
        if (isActive && !isFinished) {
            // Hammer animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(hammerRotate, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(hammerRotate, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else if (isFinished) {
            // Pulse animation for finish button
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseScale, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseScale, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        }
    }, [isActive, isFinished]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const hammerRotation = hammerRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-20deg', '20deg']
    });

    if (!isActive) return null;

    if (isFinished) {
        return (
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
                    <TouchableOpacity
                        style={styles.finishButton}
                        onPress={onFinishTap}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.success, COLORS.secondaryLight]}
                            style={styles.finishGradient}
                        >
                            <FontAwesome5 name="check" size={16} color={COLORS.white} />
                            <Text style={styles.finishText}>FINISH</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                {/* Circular Progress Background */}
                <View style={styles.progressBg}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>

                <View style={styles.contentRow}>
                    <Animated.View style={{ transform: [{ rotate: hammerRotation }] }}>
                        <FontAwesome5 name="hammer" size={12} color={COLORS.accent} />
                    </Animated.View>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    timerContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: BORDER_RADIUS.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
        minWidth: 80,
    },
    progressBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'rgba(255, 106, 0, 0.3)', // Primary color transparent
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    timerText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.xs,
        fontVariant: ['tabular-nums'],
    },
    finishButton: {
        ...SHADOWS.md,
    },
    finishGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    finishText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
    },
});
