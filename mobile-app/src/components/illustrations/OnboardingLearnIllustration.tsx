import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const OnboardingLearnIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="purpleGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#8B5CF6" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#7C3AED" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>
                <Circle cx="100" cy="100" r="80" fill="url(#purpleGrad)" />
                <Rect x="60" y="60" width="80" height="80" rx="4" stroke="#8B5CF6" strokeWidth="2" fill="none" opacity={0.3} />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="lightbulb" size={size * 0.3} color="#FBBF24" />
                <FontAwesome5 name="brain" size={size * 0.15} color="#8B5CF6" style={styles.brain} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brain: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        overflow: 'hidden',
    },
});
