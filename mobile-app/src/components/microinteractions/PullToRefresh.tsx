import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, RefreshControl, ScrollView, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    refreshing?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    refreshing: externalRefreshing,
}) => {
    const [internalRefreshing, setInternalRefreshing] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;

    const isRefreshing = externalRefreshing !== undefined ? externalRefreshing : internalRefreshing;

    const handleRefresh = async () => {
        setInternalRefreshing(true);

        // Spin animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();

        await onRefresh();

        setInternalRefreshing(false);
        spinValue.setValue(0);
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor="transparent" // Hide default spinner
                    colors={['transparent']}
                />
            }
        >
            {isRefreshing && (
                <View style={styles.refreshContainer}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <FontAwesome5 name="futbol" size={24} color={COLORS.primary} />
                    </Animated.View>
                    <Text style={styles.refreshText}>Updating Field...</Text>
                </View>
            )}
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    refreshContainer: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    refreshText: {
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        fontSize: 12,
    },
});
