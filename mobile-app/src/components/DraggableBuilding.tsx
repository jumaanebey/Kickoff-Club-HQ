import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated, TouchableOpacity } from 'react-native';

interface DraggableBuildingProps {
    children: React.ReactNode;
    onDragEnd: (x: number, y: number) => void;
    enabled?: boolean;
    initialX?: number;
    initialY?: number;
}

export const DraggableBuilding: React.FC<DraggableBuildingProps> = ({
    children,
    onDragEnd,
    enabled = false,
    initialX = 0,
    initialY = 0,
}) => {
    const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
    const scale = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => enabled,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value,
                });
                pan.setValue({ x: 0, y: 0 });

                Animated.spring(scale, {
                    toValue: 1.1,
                    friction: 5,
                    useNativeDriver: false,
                }).start();
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();

                Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false,
                }).start();

                onDragEnd(
                    (pan.x as any)._value,
                    (pan.y as any)._value
                );
            },
        })
    ).current;

    return (
        <Animated.View
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
                zIndex: enabled ? 100 : 1,
            }}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity activeOpacity={1} disabled={enabled}>
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({});
