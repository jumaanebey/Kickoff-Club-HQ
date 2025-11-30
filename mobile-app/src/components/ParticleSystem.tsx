import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../constants/theme';

interface Particle {
    id: number;
    x: Animated.Value;
    y: Animated.Value;
    opacity: Animated.Value;
    scale: Animated.Value;
    color: string;
}

interface ParticleSystemProps {
    active: boolean;
    count?: number;
    origin: { x: number; y: number };
    colors?: string[];
    onComplete?: () => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
    active,
    count = 20,
    origin,
    colors = [COLORS.primary, COLORS.accent, COLORS.white],
    onComplete,
}) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (active) {
            const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
                id: i,
                x: new Animated.Value(origin.x),
                y: new Animated.Value(origin.y),
                opacity: new Animated.Value(1),
                scale: new Animated.Value(0),
                color: colors[Math.floor(Math.random() * colors.length)],
            }));

            setParticles(newParticles);

            const animations = newParticles.map((p) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 100 + 50;
                const duration = Math.random() * 500 + 500;

                const toX = origin.x + Math.cos(angle) * distance;
                const toY = origin.y + Math.sin(angle) * distance;

                return Animated.parallel([
                    Animated.timing(p.x, {
                        toValue: toX,
                        duration: duration,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.y, {
                        toValue: toY,
                        duration: duration,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(p.scale, {
                            toValue: Math.random() * 0.5 + 0.5,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(p.scale, {
                            toValue: 0,
                            duration: duration - 200,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.timing(p.opacity, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ]);
            });

            Animated.stagger(20, animations).start(() => {
                if (onComplete) onComplete();
            });
        }
    }, [active]);

    if (!active) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map((p) => (
                <Animated.View
                    key={p.id}
                    style={[
                        styles.particle,
                        {
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            transform: [
                                { translateX: p.x },
                                { translateY: p.y },
                                { scale: p.scale },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        top: 0,
        left: 0,
    },
});
