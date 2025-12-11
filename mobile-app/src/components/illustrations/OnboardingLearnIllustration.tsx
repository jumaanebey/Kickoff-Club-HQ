import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G } from 'react-native-svg';

export const OnboardingLearnIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FFFFFF" />
                        <Stop offset="1" stopColor="#F5F5F5" />
                    </LinearGradient>
                </Defs>

                {/* Floor */}
                <Rect x="20" y="140" width="160" height="40" fill="#E0F2F1" rx="10" />

                {/* Whiteboard Stand */}
                <Path d="M50 140 L40 170 M150 140 L160 170" stroke="#78909C" strokeWidth="4" strokeLinecap="round" />

                {/* Whiteboard Frame */}
                <Rect x="40" y="50" width="120" height="90" fill="#B0BEC5" rx="4" />
                <Rect x="45" y="55" width="110" height="80" fill="url(#boardGrad)" />

                {/* Tactical Drawings (Xs and Os) */}
                <Path d="M60 80 L70 90 M70 80 L60 90" stroke="#FF5252" strokeWidth="2" />
                <Circle cx="100" cy="85" r="5" stroke="#448AFF" strokeWidth="2" fill="none" />
                <Path d="M75 85 Q100 110 130 90" stroke="#66BB6A" strokeWidth="2" strokeDasharray="3 3" />
                <Path d="M125 90 L130 90 L130 95" stroke="#66BB6A" strokeWidth="2" />

                {/* Coach Figure */}
                <G transform="translate(140, 100)">
                    <Circle cx="0" cy="0" r="12" fill="#FFCC80" /> {/* Head */}
                    <Rect x="-8" y="-4" width="16" height="4" fill="#37474F" rx="2" /> {/* Cap */}
                    <Path d="M0 12 L0 50" stroke="#1E88E5" strokeWidth="12" strokeLinecap="round" /> {/* Body */}
                    <Path d="M0 20 L20 10" stroke="#1E88E5" strokeWidth="4" strokeLinecap="round" /> {/* Arm points to board */}
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
