import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const OnboardingBuildingsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="orangeGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#F97316" stopOpacity="0.2" />
                        <Stop offset="1" stopColor="#EA580C" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>
                <Path d="M100 40 L160 70 L160 140 L100 170 L40 140 L40 70 Z" fill="url(#orangeGrad)" />
                <Path d="M100 40 L160 70 M100 40 L40 70 M100 170 L100 100 M100 100 L160 70 M100 100 L40 70" stroke={COLORS.accent} strokeWidth="2" opacity={0.5} />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="building" size={size * 0.3} color={COLORS.accent} />
                <View style={styles.arrowContainer}>
                    <FontAwesome5 name="arrow-up" size={size * 0.15} color={COLORS.success} />
                </View>
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
    arrowContainer: {
        position: 'absolute',
        top: -30,
        right: -30,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});
