import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const ConnectionErrorIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Circle cx="100" cy="100" r="80" fill={COLORS.error} opacity={0.1} />
                <Path
                    d="M60 100 Q100 60 140 100 T180 100"
                    stroke={COLORS.error}
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity={0.3}
                    fill="none"
                />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="cloud" size={size * 0.4} color={COLORS.textMuted} />
                <FontAwesome5 name="wifi" size={size * 0.2} color={COLORS.error} style={styles.wifi} />
                <View style={styles.slash} />
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
    wifi: {
        position: 'absolute',
        top: 10,
    },
    slash: {
        position: 'absolute',
        width: 60,
        height: 4,
        backgroundColor: COLORS.error,
        transform: [{ rotate: '45deg' }],
        top: 20,
    },
});
