import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

export const EmptyAchievementsIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="caseGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#8D6E63" />
                        <Stop offset="1" stopColor="#5D4037" />
                    </LinearGradient>
                    <LinearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#E1F5FE" stopOpacity="0.3" />
                        <Stop offset="1" stopColor="#B3E5FC" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>

                {/* Trophy Case */}
                <Rect x="40" y="40" width="120" height="140" rx="4" fill="url(#caseGrad)" />

                {/* Shelves */}
                <Rect x="50" y="80" width="100" height="4" fill="#4E342E" />
                <Rect x="50" y="130" width="100" height="4" fill="#4E342E" />

                {/* Cobwebs (It's empty!) */}
                <Path d="M40 40 L60 60 L40 80" stroke="#E0E0E0" strokeWidth="1" opacity="0.5" />
                <Path d="M160 40 L140 60 L160 80" stroke="#E0E0E0" strokeWidth="1" opacity="0.5" />

                {/* Glass Door */}
                <Rect x="44" y="44" width="54" height="132" fill="url(#glassGrad)" stroke="#A1887F" strokeWidth="2" />
                <Rect x="102" y="44" width="54" height="132" fill="url(#glassGrad)" stroke="#A1887F" strokeWidth="2" />

                {/* "Clean Me" look - Dust particles */}
                <Circle cx="80" cy="110" r="2" fill="#FFF" opacity="0.2" />
                <Circle cx="120" cy="60" r="2" fill="#FFF" opacity="0.2" />
                <Circle cx="60" cy="150" r="2" fill="#FFF" opacity="0.2" />

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
