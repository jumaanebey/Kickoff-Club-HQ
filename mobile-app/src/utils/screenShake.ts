import { useRef, useCallback } from 'react';
import { Animated, Vibration, Platform } from 'react-native';

export const useScreenShake = () => {
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    const shake = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
        const duration = 100; // ms per shake
        const iterations = intensity === 'heavy' ? 4 : intensity === 'medium' ? 3 : 2;
        const offset = intensity === 'heavy' ? 10 : intensity === 'medium' ? 6 : 3;

        // Haptic feedback
        if (Platform.OS !== 'web') {
            Vibration.vibrate(intensity === 'heavy' ? 50 : 20);
        }

        const sequence = [];
        for (let i = 0; i < iterations; i++) {
            sequence.push(
                Animated.timing(shakeAnimation, {
                    toValue: offset,
                    duration: duration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -offset,
                    duration: duration,
                    useNativeDriver: true,
                })
            );
        }

        sequence.push(
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true,
            })
        );

        Animated.sequence(sequence).start();
    }, [shakeAnimation]);

    const animatedStyle = {
        transform: [{ translateX: shakeAnimation }],
    };

    return { shake, animatedStyle };
};
