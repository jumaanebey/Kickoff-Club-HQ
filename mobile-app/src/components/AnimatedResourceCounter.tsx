import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, TextStyle, Animated } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface AnimatedResourceCounterProps {
    value: number;
    style?: TextStyle;
    prefix?: string;
    suffix?: string;
}

export const AnimatedResourceCounter: React.FC<AnimatedResourceCounterProps> = ({
    value,
    style,
    prefix = '',
    suffix = '',
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const animatedValue = useRef(new Animated.Value(value)).current;

    useEffect(() => {
        const listener = animatedValue.addListener(({ value: v }) => {
            setDisplayValue(Math.floor(v));
        });

        Animated.timing(animatedValue, {
            toValue: value,
            duration: 800,
            useNativeDriver: false, // Required for listener to work with text updates
        }).start();

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [value]);

    return (
        <Text style={[styles.text, style]}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.md,
        color: COLORS.text,
        fontVariant: ['tabular-nums'],
    },
});
