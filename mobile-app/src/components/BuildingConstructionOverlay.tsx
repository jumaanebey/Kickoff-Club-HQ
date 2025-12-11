import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BuildingConstructionOverlayProps {
    buildingType: string;
    constructionTimeSeconds?: number;
    constructionStartedAt?: string; // ISO timestamp
    upgradeCompleteAt?: string; // ISO timestamp
    onComplete: () => void;
    width?: number;
    height?: number;
}

export const BuildingConstructionOverlay: React.FC<BuildingConstructionOverlayProps> = ({
    buildingType,
    constructionTimeSeconds,
    constructionStartedAt,
    upgradeCompleteAt,
    onComplete,
    width = 100,
    height = 100,
}) => {
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Animations
    const craneRotate = useRef(new Animated.Value(0)).current;
    const dustAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Crane Animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(craneRotate, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(craneRotate, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Timer Logic
        const interval = setInterval(() => {
            const now = Date.now();
            let total = 0;
            let elapsed = 0;
            let remaining = 0;

            if (upgradeCompleteAt) {
                const end = new Date(upgradeCompleteAt).getTime();
                remaining = Math.max(0, end - now);
                // If we don't have start time, we can't calculate exact progress, so we might fake it or just show timer
                // Assuming a default or calculating from remaining if needed, but for progress bar we need total.
                // If constructionTimeSeconds is provided, use it.
                if (constructionTimeSeconds) {
                    total = constructionTimeSeconds * 1000;
                    elapsed = total - remaining;
                } else {
                    // Fallback: assume 100% - remaining/some_max
                    total = remaining + 10000; // Fake total?
                    elapsed = 10000;
                }
            } else if (constructionStartedAt && constructionTimeSeconds) {
                const start = new Date(constructionStartedAt).getTime();
                elapsed = now - start;
                total = constructionTimeSeconds * 1000;
                remaining = Math.max(0, total - elapsed);
            }

            if (remaining <= 0 && (upgradeCompleteAt || constructionStartedAt)) {
                clearInterval(interval);
                onComplete();
            } else {
                setProgress(total > 0 ? elapsed / total : 0);
                setTimeRemaining(formatTime(remaining));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [constructionStartedAt, constructionTimeSeconds, upgradeCompleteAt]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    };

    const craneRotation = craneRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '15deg'],
    });

    // Circle Progress Config
    const size = Math.min(width, height) * 0.6;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <View style={[styles.container, { width, height }]}>
            <View style={styles.overlay} />

            {/* Crane */}
            <Animated.View style={[styles.craneContainer, { transform: [{ rotate: craneRotation }] }]}>
                <FontAwesome5 name="hammer" size={24} color={COLORS.warning} />
            </Animated.View>

            {/* Progress Ring */}
            <View style={styles.progressContainer}>
                <Svg width={size} height={size}>
                    <Circle
                        stroke="rgba(255,255,255,0.2)"
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke={COLORS.warning}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
                <Text style={styles.statusText}>BUILDING</Text>
                <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    craneContainer: {
        marginBottom: SPACING.sm,
    },
    progressContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        marginTop: SPACING.md,
        alignItems: 'center',
    },
    statusText: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.textMuted,
        letterSpacing: 1,
    },
    timerText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
        color: COLORS.white,
        fontVariant: ['tabular-nums'],
    },
});
