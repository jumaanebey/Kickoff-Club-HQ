import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { GameIcon } from './GameIcon';
import { COLORS } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CoinFountainProps {
    count?: number;
    onComplete?: () => void;
    startPosition?: { x: number; y: number };
}

interface Coin {
    id: number;
    animX: Animated.Value;
    animY: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
}

export const CoinFountain: React.FC<CoinFountainProps> = ({
    count = 10,
    onComplete,
    startPosition = { x: 0, y: 0 },
}) => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const isAnimating = useRef(false);

    useEffect(() => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        const newCoins: Coin[] = Array.from({ length: count }).map((_, i) => ({
            id: i,
            animX: new Animated.Value(startPosition.x),
            animY: new Animated.Value(startPosition.y),
            scale: new Animated.Value(0),
            opacity: new Animated.Value(1),
        }));

        setCoins(newCoins);

        const animations = newCoins.map((coin) => {
            // Randomize trajectory
            const velocity = Math.random() * 150 + 100;
            const duration = 800 + Math.random() * 400;
            const endX = startPosition.x + (Math.random() - 0.5) * 200;
            const endY = startPosition.y - velocity; // Go up first

            return Animated.parallel([
                // Scale up
                Animated.timing(coin.scale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Move X
                Animated.timing(coin.animX, {
                    toValue: endX,
                    duration: duration,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                // Move Y (Arc)
                Animated.sequence([
                    Animated.timing(coin.animY, {
                        toValue: endY,
                        duration: duration * 0.4,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(coin.animY, {
                        toValue: SCREEN_HEIGHT + 50, // Fall off screen
                        duration: duration * 0.6,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                ]),
                // Fade out at end
                Animated.sequence([
                    Animated.delay(duration * 0.8),
                    Animated.timing(coin.opacity, {
                        toValue: 0,
                        duration: duration * 0.2,
                        useNativeDriver: true,
                    }),
                ]),
            ]);
        });

        Animated.stagger(50, animations).start(() => {
            isAnimating.current = false;
            if (onComplete) onComplete();
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {coins.map((coin) => (
                <Animated.View
                    key={coin.id}
                    style={[
                        styles.coin,
                        {
                            transform: [
                                { translateX: coin.animX },
                                { translateY: coin.animY },
                                { scale: coin.scale },
                            ],
                            opacity: coin.opacity,
                        },
                    ]}
                >
                    <GameIcon name="coins" size={20} />
                </Animated.View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    coin: {
        position: 'absolute',
        top: 0,
        left: 0,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
});
