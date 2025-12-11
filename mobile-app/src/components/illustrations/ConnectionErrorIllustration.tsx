import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Defs, LinearGradient, Stop, Path, G } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

export const ConnectionErrorIllustration = ({ size = 200 }: { size?: number }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 200 200">
                <Defs>
                    <LinearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#212121" />
                        <Stop offset="1" stopColor="#000000" />
                    </LinearGradient>
                </Defs>

                {/* Background Alert */}
                <Circle cx="100" cy="100" r="90" fill="#FFEBEE" />
                <Circle cx="100" cy="100" r="70" stroke="#FFCDD2" strokeWidth="2" fill="none" strokeDasharray="5 5" />

                {/* Referee Figure */}
                <G transform="translate(80, 60)">
                    {/* Head */}
                    <Circle cx="20" cy="10" r="12" fill="#FFCC80" />
                    <Rect x="8" y="0" width="24" height="6" fill="#212121" rx="2" /> {/* Cap */}

                    {/* Body (Striped Shirt) */}
                    <Rect x="0" y="25" width="40" height="60" rx="10" fill="#FFF" />
                    <Path d="M5 25 V85 M15 25 V85 M25 25 V85 M35 25 V85" stroke="#212121" strokeWidth="4" />

                    {/* Arms (Timeout Signal) */}
                    <Path d="M-10 40 L40 40" stroke="#212121" strokeWidth="8" strokeLinecap="round" />
                    <Path d="M20 40 L20 10" stroke="#212121" strokeWidth="8" strokeLinecap="round" />

                    {/* Whistle */}
                    <Circle cx="15" cy="18" r="3" fill="#B0BEC5" />
                </G>

                {/* Disconnected Cable */}
                <Path d="M40 160 Q80 140 90 160" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
                <Path d="M110 160 Q120 140 160 160" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
                <Path d="M95 150 L105 170 M95 170 L105 150" stroke="#FF5252" strokeWidth="3" /> {/* Spark */}
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
