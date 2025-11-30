import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface BuildingCardProps {
    name: string;
    level: number;
    imageSource: any;
    status: 'active' | 'upgrading' | 'ready_to_collect' | 'locked';
    onPress: () => void;
    width?: number;
    height?: number;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
    name,
    level,
    imageSource,
    status,
    onPress,
    width = 100,
    height = 100,
}) => {
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (status === 'ready_to_collect') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            glowAnim.setValue(0);
        }
    }, [status]);

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.6],
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[styles.container, { width, height }]}
        >
            {/* Glow Effect */}
            {status === 'ready_to_collect' && (
                <Animated.View
                    style={[
                        styles.glow,
                        { opacity: glowOpacity, width: width + 20, height: height + 20 }
                    ]}
                />
            )}

            <View style={[styles.card, status === 'locked' && styles.cardLocked]}>
                {/* Building Image */}
                <Image
                    source={imageSource}
                    style={[styles.image, status === 'locked' && { opacity: 0.5 }]}
                    resizeMode="contain"
                />

                {/* Level Badge */}
                {status !== 'locked' && (
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{level}</Text>
                    </View>
                )}

                {/* Status Indicators */}
                {status === 'upgrading' && (
                    <View style={styles.statusOverlay}>
                        <View style={styles.constructionBadge}>
                            <FontAwesome5 name="hammer" size={10} color={COLORS.white} />
                        </View>
                    </View>
                )}

                {status === 'ready_to_collect' && (
                    <View style={styles.statusOverlay}>
                        <View style={styles.collectBadge}>
                            <FontAwesome5 name="coins" size={12} color={COLORS.white} />
                        </View>
                    </View>
                )}

                {status === 'locked' && (
                    <View style={styles.statusOverlay}>
                        <FontAwesome5 name="lock" size={16} color={COLORS.textMuted} />
                    </View>
                )}
            </View>

            {/* Name Label */}
            <View style={styles.nameContainer}>
                <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: SPACING.xs,
    },
    glow: {
        position: 'absolute',
        backgroundColor: COLORS.accent,
        borderRadius: BORDER_RADIUS.full,
        zIndex: -1,
    },
    card: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.backgroundCard,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    cardLocked: {
        backgroundColor: '#1a1a1a',
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    levelBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: COLORS.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    levelText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
        fontSize: 10,
    },
    statusOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    constructionBadge: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 6,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.warning,
    },
    collectBadge: {
        backgroundColor: COLORS.success,
        padding: 6,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.white,
        ...SHADOWS.md,
    },
    nameContainer: {
        marginTop: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    nameText: {
        color: COLORS.text,
        fontFamily: FONTS.medium,
        fontSize: 10,
    },
});
