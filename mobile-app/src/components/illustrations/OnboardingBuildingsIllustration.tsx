import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G } from 'react-native-svg';

export const OnboardingBuildingsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#C8E6C9" />
                        <Stop offset="1" stopColor="#A5D6A7" />
                    </LinearGradient>
                </Defs>

                {/* Ground */}
                <Circle cx="100" cy="180" r="90" fill="url(#groundGrad)" />

                {/* HQ (Center Back) */}
                <G transform="translate(80, 80)">
                    <Rect x="0" y="0" width="40" height="60" fill="#90CAF9" />
                    <Path d="M-5 0 L20 -15 L45 0" fill="#546E7A" /> {/* Roof */}
                    <Rect x="10" y="10" width="20" height="20" fill="#E3F2FD" opacity="0.5" />
                </G>

                {/* Stadium (Front Left) */}
                <G transform="translate(30, 110)">
                    <Rect x="0" y="10" width="60" height="30" fill="#E0E0E0" rx="4" />
                    <Path d="M0 10 L10 0 H50 L60 10 Z" fill="#CFD8DC" />
                    <Path d="M5 10 V30 M55 10 V30" stroke="#B0BEC5" strokeWidth="2" />
                </G>

                {/* Gym (Front Right) */}
                <G transform="translate(120, 110)">
                    <Rect x="0" y="10" width="50" height="30" fill="#FFCC80" rx="2" />
                    <Rect x="0" y="5" width="50" height="5" fill="#EF6C00" />
                    <Circle cx="25" cy="5" r="8" fill="#E65100" />
                </G>

                {/* Trees/Decor */}
                <Circle cx="20" cy="130" r="10" fill="#66BB6A" />
                <Rect x="18" y="140" width="4" height="10" fill="#795548" />

                <Circle cx="180" cy="130" r="8" fill="#66BB6A" />
                <Rect x="178" y="138" width="4" height="10" fill="#795548" />

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
