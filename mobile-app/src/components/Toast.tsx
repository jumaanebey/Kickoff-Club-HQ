import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
    duration?: number;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type,
    visible,
    duration = 3000,
    onDismiss,
}) => {
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.spring(slideAnim, {
                    toValue: 50, // Top margin
                    useNativeDriver: true,
                    friction: 5,
                }),
                Animated.delay(duration),
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (finished) onDismiss();
            });
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'info': return 'info-circle';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return COLORS.success;
            case 'error': return COLORS.error;
            case 'info': return COLORS.primary;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={[styles.content, { borderLeftColor: getColor() }]}>
                <FontAwesome5 name={getIcon()} size={20} color={getColor()} style={styles.icon} />
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundCard,
        width: '90%',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderLeftWidth: 4,
        ...SHADOWS.md,
    },
    icon: {
        marginRight: SPACING.md,
    },
    message: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.sm,
        color: COLORS.white,
        flex: 1,
    },
});
