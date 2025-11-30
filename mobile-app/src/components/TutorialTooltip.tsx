import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface TutorialTooltipProps {
    text: string;
    onNext: () => void;
    position?: 'top' | 'bottom';
    visible: boolean;
}

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
    text,
    onNext,
    position = 'top',
    visible,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.positionTop : styles.positionBottom,
                { opacity: fadeAnim, transform: [{ translateY }] },
            ]}
        >
            <View style={styles.content}>
                <Text style={styles.text}>{text}</Text>
                <TouchableOpacity onPress={onNext} style={styles.button}>
                    <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
            </View>
            {/* Arrow */}
            <View
                style={[
                    styles.arrow,
                    position === 'top' ? styles.arrowBottom : styles.arrowTop,
                ]}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 100,
        alignSelf: 'center',
        width: 200,
    },
    positionTop: {
        bottom: '100%',
        marginBottom: 10,
    },
    positionBottom: {
        top: '100%',
        marginTop: 10,
    },
    content: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        ...SHADOWS.md,
    },
    text: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.sm,
        color: COLORS.background,
        marginBottom: SPACING.sm,
    },
    button: {
        alignSelf: 'flex-end',
        padding: SPACING.xs,
    },
    buttonText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
        color: COLORS.primary,
    },
    arrow: {
        position: 'absolute',
        alignSelf: 'center',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: COLORS.white,
    },
    arrowBottom: {
        bottom: -8,
        transform: [{ rotate: '180deg' }],
    },
    arrowTop: {
        top: -8,
    },
});
