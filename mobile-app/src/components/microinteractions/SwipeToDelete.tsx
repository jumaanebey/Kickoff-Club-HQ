import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, BORDER_RADIUS } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DELETE_THRESHOLD = SCREEN_WIDTH * 0.4;

interface SwipeToDeleteProps {
    onDelete: () => void;
    children: React.ReactNode;
}

export const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({
    onDelete,
    children,
}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const deleteIconScale = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx < 0;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 0) {
                    pan.setValue({ x: gestureState.dx, y: 0 });

                    // Scale icon based on swipe distance
                    const scale = Math.min(1.2, Math.abs(gestureState.dx) / 100);
                    deleteIconScale.setValue(scale);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -DELETE_THRESHOLD) {
                    // Delete action
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    Animated.timing(pan, {
                        toValue: { x: -SCREEN_WIDTH, y: 0 },
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => onDelete());
                } else {
                    // Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 5,
                        useNativeDriver: false,
                    }).start();

                    Animated.timing(deleteIconScale, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.container}>
            {/* Background Layer (Red) */}
            <View style={styles.background}>
                <Animated.View style={[styles.iconContainer, { transform: [{ scale: deleteIconScale }] }]}>
                    <FontAwesome5 name="trash-alt" size={24} color={COLORS.white} />
                </Animated.View>
            </View>

            {/* Foreground Layer (Content) */}
            <Animated.View
                style={[styles.foreground, { transform: [{ translateX: pan.x }] }]}
                {...panResponder.panHandlers}
            >
                {children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.error,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 30,
        borderRadius: BORDER_RADIUS.md,
    },
    foreground: {
        backgroundColor: COLORS.backgroundCard,
    },
    iconContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
