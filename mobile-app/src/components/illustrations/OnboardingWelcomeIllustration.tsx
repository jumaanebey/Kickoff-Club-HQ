import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const OnboardingWelcomeIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#10B981" stopOpacity="0.8" />
                        <Stop offset="1" stopColor="#059669" stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                {/* Field */}
                <Rect x="20" y="60" width="160" height="100" rx="4" fill="url(#fieldGrad)" transform="skewX(-10)" />
                {/* Center Circle */}
                <Circle cx="100" cy="110" r="20" stroke="white" strokeWidth="2" fill="none" opacity={0.5} transform="skewX(-10)" />
                {/* Lines */}
                <Rect x="98" y="60" width="4" height="100" fill="white" opacity={0.5} transform="skewX(-10)" />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="futbol" size={size * 0.25} color={COLORS.white} />
                <View style={styles.glow} />
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
        top: '40%',
    },
    glow: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.white,
        opacity: 0.3,
        zIndex: -1,
    },
});
