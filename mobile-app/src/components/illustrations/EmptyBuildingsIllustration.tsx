import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const EmptyBuildingsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor={COLORS.secondary} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={COLORS.background} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                <Rect x="20" y="40" width="160" height="120" rx="10" fill="url(#grad)" />
                <Rect x="30" y="50" width="140" height="100" rx="8" stroke={COLORS.secondary} strokeWidth="2" strokeDasharray="5, 5" fill="none" opacity={0.5} />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="hard-hat" size={size * 0.35} color={COLORS.secondary} />
                <FontAwesome5 name="tools" size={size * 0.2} color={COLORS.textMuted} style={styles.tools} />
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
    tools: {
        position: 'absolute',
        bottom: -20,
        right: -30,
    },
});
