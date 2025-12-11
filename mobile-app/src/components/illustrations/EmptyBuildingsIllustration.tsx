import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G, Ellipse } from 'react-native-svg';

export const EmptyBuildingsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#DCEDC8" />
                        <Stop offset="1" stopColor="#AED581" />
                    </LinearGradient>
                </Defs>

                {/* Empty Field */}
                <Ellipse cx="100" cy="150" rx="90" ry="30" fill="url(#grassGrad)" />

                {/* Construction Sign */}
                <G transform="translate(80, 100)">
                    <Rect x="0" y="0" width="40" height="30" fill="#FFB74D" stroke="#E65100" strokeWidth="2" rx="2" />
                    <Path d="M5 20 L15 10 M25 20 L35 10" stroke="#E65100" strokeWidth="2" />
                    <Path d="M10 30 L10 50 M30 30 L30 50" stroke="#795548" strokeWidth="3" />
                </G>

                {/* Tumbleweed/Shrub */}
                <G transform="translate(150, 130)">
                    <Circle cx="0" cy="0" r="6" fill="#D7CCC8" opacity="0.8" />
                    <Circle cx="8" cy="2" r="5" fill="#D7CCC8" opacity="0.8" />
                    <Circle cx="-4" cy="4" r="5" fill="#D7CCC8" opacity="0.8" />
                </G>

                {/* Shovel */}
                <G transform="translate(50, 130) rotate(-20)">
                    <Path d="M0 0 L0 30" stroke="#795548" strokeWidth="3" strokeLinecap="round" />
                    <Path d="M-5 30 L5 30 L0 40 Z" fill="#B0BEC5" />
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
