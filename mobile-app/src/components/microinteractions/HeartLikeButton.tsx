import React, { useState, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/theme';
import { ParticleSystem } from '../ParticleSystem';

interface HeartLikeButtonProps {
    initialLiked: boolean;
    onLikeChange: (liked: boolean) => void;
    size?: number;
    style?: ViewStyle;
}

export const HeartLikeButton: React.FC<HeartLikeButtonProps> = ({
    initialLiked,
    onLikeChange,
    size = 24,
    style,
}) => {
    const [liked, setLiked] = useState(initialLiked);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [showParticles, setShowParticles] = useState(false);

    const handlePress = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        onLikeChange(newLiked);

        if (newLiked) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 1000);

            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1.5,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.spring(scaleAnim, {
                toValue: 0.8,
                friction: 3,
                useNativeDriver: true,
            }).start(() => {
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }).start();
            });
        }
    };

    return (
        <TouchableOpacity activeOpacity={1} onPress={handlePress} style={[styles.container, style]}>
            <ParticleSystem
                active={showParticles}
                count={15}
                origin={{ x: size / 2, y: size / 2 }}
                colors={[COLORS.error, '#FF69B4', COLORS.white]}
            />
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <FontAwesome5
                    name={liked ? 'heart' : 'heart'}
                    solid={liked}
                    size={size}
                    color={liked ? COLORS.error : COLORS.textMuted}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
});
