import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const EmptyAchievementsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <RadialGradient id="grad" cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor={COLORS.primary} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={COLORS.background} stopOpacity="0" />
                    </RadialGradient>
                </Defs>
                <Circle cx="100" cy="100" r="90" fill="url(#grad)" />
                <Circle cx="100" cy="100" r="70" fill={COLORS.backgroundCard} opacity={0.5} />
            </Svg>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="trophy" size={size * 0.4} color={COLORS.warning} />
                <FontAwesome5 name="question" size={size * 0.15} color={COLORS.white} style={styles.questionMark} />
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
    questionMark: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: COLORS.primary,
        borderRadius: 100,
        padding: 4,
        overflow: 'hidden',
    },
});
