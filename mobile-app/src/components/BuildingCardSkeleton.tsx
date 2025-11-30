import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface BuildingCardSkeletonProps {
    width?: number;
    height?: number;
}

export const BuildingCardSkeleton: React.FC<BuildingCardSkeletonProps> = ({
    width = 100,
    height = 100,
}) => {
    const opacityAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={[styles.container, { width, height }]}>
            <Animated.View style={[styles.card, { opacity: opacityAnim }]} />
            <Animated.View style={[styles.label, { opacity: opacityAnim }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: SPACING.xs,
    },
    card: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: 4,
    },
    label: {
        width: '80%',
        height: 12,
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.sm,
    },
});
