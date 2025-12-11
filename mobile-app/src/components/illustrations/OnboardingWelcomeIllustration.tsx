import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G, Ellipse } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

export const OnboardingWelcomeIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#E0F7FA" />
                        <Stop offset="1" stopColor="#B2EBF2" />
                    </LinearGradient>
                    <LinearGradient id="gateGrad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#5D4037" />
                        <Stop offset="1" stopColor="#3E2723" />
                    </LinearGradient>
                </Defs>

                {/* Sky Background */}
                <Circle cx="100" cy="100" r="95" fill="url(#skyGrad)" />

                {/* Sun */}
                <Circle cx="150" cy="50" r="15" fill="#FFD700" opacity="0.8" />

                {/* Stadium Entrance Gate */}
                <G transform="translate(40, 60)">
                    {/* Pillars */}
                    <Rect x="0" y="20" width="20" height="100" fill="url(#gateGrad)" rx="2" />
                    <Rect x="100" y="20" width="20" height="100" fill="url(#gateGrad)" rx="2" />

                    {/* Arch */}
                    <Path d="M0 30 Q60 -20 120 30" stroke="#5D4037" strokeWidth="8" fill="none" />
                    <Path d="M10 30 Q60 -10 110 30" stroke="#8D6E63" strokeWidth="2" fill="none" strokeDasharray="4 4" />

                    {/* Sign */}
                    <Rect x="30" y="0" width="60" height="20" fill="#FF7043" rx="4" />
                    <Path d="M35 10 H85" stroke="white" strokeWidth="2" strokeDasharray="2 2" />

                    {/* Ground */}
                    <Rect x="-20" y="110" width="160" height="10" fill="#81C784" rx="5" />
                </G>

                {/* Confetti */}
                <Rect x="50" y="40" width="4" height="4" fill="#FF5252" transform="rotate(15)" />
                <Rect x="140" y="70" width="4" height="4" fill="#448AFF" transform="rotate(-15)" />
                <Circle cx="80" cy="30" r="2" fill="#69F0AE" />
                <Circle cx="170" cy="60" r="3" fill="#FFD740" />

                {/* Welcome Character (Silhouette) */}
                <G transform="translate(90, 130)">
                    <Circle cx="10" cy="0" r="8" fill="#37474F" />
                    <Path d="M10 10 L0 30 L20 30 Z" fill="#37474F" />
                    <Path d="M0 30 L-5 45 M20 30 L25 45" stroke="#37474F" strokeWidth="3" />
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
