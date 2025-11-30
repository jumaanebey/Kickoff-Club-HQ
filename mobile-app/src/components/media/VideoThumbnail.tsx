import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface VideoThumbnailProps {
    thumbnailUri: string;
    duration: number; // seconds
    isLocked: boolean;
    watchProgress?: number; // 0-100
    onPress: () => void;
    style?: ViewStyle;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
    thumbnailUri,
    duration,
    isLocked,
    watchProgress = 0,
    onPress,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchable}
                disabled={isLocked}
            >
                <Image source={{ uri: thumbnailUri }} style={styles.image} resizeMode="cover" />

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                />

                {/* Center Icon */}
                <View style={styles.centerIcon}>
                    {isLocked ? (
                        <View style={styles.lockCircle}>
                            <FontAwesome5 name="lock" size={20} color={COLORS.textMuted} />
                        </View>
                    ) : (
                        <View style={styles.playCircle}>
                            <FontAwesome5 name="play" size={20} color={COLORS.white} style={{ marginLeft: 4 }} />
                        </View>
                    )}
                </View>

                {/* Duration Badge */}
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{formatDuration(duration)}</Text>
                </View>

                {/* Progress Bar */}
                {watchProgress > 0 && !isLocked && (
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${watchProgress}%` }]} />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.backgroundCard,
        ...SHADOWS.sm,
    },
    touchable: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    centerIcon: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    lockCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        fontFamily: FONTS.medium,
        fontSize: 10,
        color: COLORS.white,
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
});
