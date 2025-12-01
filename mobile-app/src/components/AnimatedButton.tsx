import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, BORDER_RADIUS, SPACING, SHADOWS } from '../constants/theme';

interface AnimatedButtonProps {
    children: React.ReactNode;
    onPress: () => void | Promise<void>;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (disabled || loading) return;
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled || loading) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = async () => {
        if (disabled || loading) return;

        // Haptic feedback
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        await onPress();
    };

    // Styles based on props
    const getBackgroundColor = () => {
        if (disabled) return COLORS.border;
        switch (variant) {
            case 'primary': return COLORS.primary;
            case 'secondary': return COLORS.secondary;
            case 'success': return COLORS.success;
            case 'danger': return COLORS.error;
            case 'outline': return 'transparent';
            default: return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return COLORS.textMuted;
        if (variant === 'outline') return COLORS.primary;
        return COLORS.white;
    };

    const getPadding = () => {
        switch (size) {
            case 'sm': return { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md };
            case 'lg': return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl };
            default: return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg }; // md
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={1}
                style={[
                    styles.button,
                    { backgroundColor: getBackgroundColor() },
                    getPadding(),
                    variant === 'outline' && { borderWidth: 1, borderColor: COLORS.primary },
                    style,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={getTextColor()} size="small" />
                ) : (
                    <Text style={[styles.text, { color: getTextColor(), fontSize: size === 'lg' ? FONTS.sizes.md : FONTS.sizes.sm }]}>
                        {children}
                    </Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        ...SHADOWS.sm,
    },
    text: {
        fontFamily: FONTS.bold,
        textAlign: 'center',
    },
});
