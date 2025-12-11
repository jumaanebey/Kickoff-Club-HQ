import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { GameIcon } from './GameIcon';
import { COLORS } from '../constants/theme';

interface EnergyRefillAnimationProps {
    visible: boolean;
    onComplete?: () => void;
}

export const EnergyRefillAnimation: React.FC<EnergyRefillAnimationProps> = ({
    visible,
    onComplete,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0);
            opacityAnim.setValue(1);
            rotateAnim.setValue(0);

            Animated.parallel([
                Animated.sequence([
                    Animated.spring(scaleAnim, {
                        toValue: 1.5,
                        friction: 5,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.delay(500),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onComplete) onComplete();
            });
        }
    }, [visible]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    if (!visible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            <Animated.View
                style={[
                    styles.iconContainer,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }, { rotate: spin }],
                    },
                ]}
            >
                <GameIcon name="energy" size={40} />
            </Animated.View>
            <Animated.View
                style={[
                    styles.glow,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    iconContainer: {
        zIndex: 2,
    },
    glow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        zIndex: 1,
    },
});
