import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TargetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TutorialOverlayProps {
    isVisible: boolean;
    target?: TargetPosition;
    text: string;
    onNext: () => void;
    onSkip: () => void;
    isLastStep?: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
    isVisible,
    target,
    text,
    onNext,
    onSkip,
    isLastStep = false,
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: 10,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    // Default to center if no target
    const t = target || { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2, width: 0, height: 0 };

    // Calculate backdrop rectangles
    const topHeight = Math.max(0, t.y);
    const bottomHeight = Math.max(0, SCREEN_HEIGHT - (t.y + t.height));
    const leftWidth = Math.max(0, t.x);
    const rightWidth = Math.max(0, SCREEN_WIDTH - (t.x + t.width));

    // Determine bubble position (above or below target)
    const showBelow = t.y < SCREEN_HEIGHT / 2;

    return (
        <Modal transparent visible={isVisible} animationType="none">
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

                {/* Backdrop Parts */}
                <View style={[styles.backdrop, { top: 0, height: topHeight, left: 0, right: 0 }]} />
                <View style={[styles.backdrop, { top: topHeight + t.height, height: bottomHeight, left: 0, right: 0 }]} />
                <View style={[styles.backdrop, { top: topHeight, height: t.height, left: 0, width: leftWidth }]} />
                <View style={[styles.backdrop, { top: topHeight, height: t.height, right: 0, width: rightWidth }]} />

                {/* Spotlight Border */}
                {target && (
                    <View
                        style={{
                            position: 'absolute',
                            top: t.y - 4,
                            left: t.x - 4,
                            width: t.width + 8,
                            height: t.height + 8,
                            borderRadius: BORDER_RADIUS.md,
                            borderWidth: 2,
                            borderColor: COLORS.accent,
                            shadowColor: COLORS.accent,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 10,
                        }}
                    />
                )}

                {/* Content Bubble */}
                <View
                    style={[
                        styles.bubbleContainer,
                        showBelow
                            ? { top: t.y + t.height + 20 }
                            : { bottom: SCREEN_HEIGHT - t.y + 20 }
                    ]}
                >
                    {/* Arrow */}
                    <Animated.View
                        style={[
                            styles.arrowContainer,
                            showBelow ? { top: -24, transform: [{ translateY: bounceAnim }] } : { bottom: -24, transform: [{ translateY: Animated.multiply(bounceAnim, -1) }, { rotate: '180deg' }] }
                        ]}
                    >
                        <FontAwesome5 name="caret-up" size={30} color={COLORS.white} />
                    </Animated.View>

                    <View style={styles.bubble}>
                        <Text style={styles.text}>{text}</Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onNext} style={styles.nextButton}>
                                <Text style={styles.nextText}>{isLastStep ? 'Finish' : 'Next'}</Text>
                                <FontAwesome5 name="arrow-right" size={12} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backdrop: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    bubbleContainer: {
        position: 'absolute',
        left: SPACING.lg,
        right: SPACING.lg,
        alignItems: 'center',
    },
    arrowContainer: {
        position: 'absolute',
        zIndex: 10,
    },
    bubble: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: '100%',
        ...SHADOWS.lg,
    },
    text: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.md,
        color: COLORS.background,
        marginBottom: SPACING.md,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    skipButton: {
        padding: SPACING.sm,
    },
    skipText: {
        fontFamily: FONTS.regular,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm + 2,
        borderRadius: BORDER_RADIUS.full,
    },
    nextText: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.sm,
        color: COLORS.white,
    },
});
