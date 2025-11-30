import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { AnimatedButton } from './AnimatedButton';
import { ParticleSystem } from './ParticleSystem';
import { soundManager } from '../utils/SoundManager';
import { Toast } from './Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PACKAGE_WIDTH = (SCREEN_WIDTH - SPACING.xl * 3) / 2;

interface Package {
    id: string;
    kpAmount: number;
    priceUSD: string;
    bonusPercent?: number;
    isFeatured?: boolean;
    icon: string;
}

interface PremiumShopModalProps {
    visible: boolean;
    packages: Package[];
    onPurchase: (packageId: string) => Promise<void>;
    onClose: () => void;
}

const PackageCard: React.FC<{ pkg: Package; onPurchase: (id: string) => void; loading: boolean }> = ({ pkg, onPurchase, loading }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
        <Animated.View style={[styles.packageCardContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.touchable}
            >
                <LinearGradient
                    colors={pkg.isFeatured ? ['#FFD700', '#FFA500'] : ['#4A90E2', '#357ABD']}
                    style={styles.packageCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {pkg.isFeatured && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>BEST VALUE</Text>
                        </View>
                    )}

                    <View style={styles.iconContainer}>
                        <FontAwesome5 name={pkg.icon} size={32} color={COLORS.white} />
                    </View>

                    <Text style={styles.amount}>{pkg.kpAmount.toLocaleString()} KP</Text>

                    {pkg.bonusPercent && (
                        <View style={styles.bonusBadge}>
                            <Text style={styles.bonusText}>+{pkg.bonusPercent}% BONUS</Text>
                        </View>
                    )}

                    <View style={styles.spacer} />

                    <Text style={styles.price}>{pkg.priceUSD}</Text>

                    <AnimatedButton
                        variant={pkg.isFeatured ? 'success' : 'secondary'}
                        size="sm"
                        onPress={() => onPurchase(pkg.id)}
                        loading={loading}
                        style={styles.purchaseButton}
                    >
                        Purchase
                    </AnimatedButton>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const PremiumShopModal: React.FC<PremiumShopModalProps> = ({
    visible,
    packages,
    onPurchase,
    onClose,
}) => {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const handlePurchase = async (packageId: string) => {
        setProcessingId(packageId);
        try {
            await onPurchase(packageId);
            soundManager.playSound('collect_coin'); // Placeholder for purchase success
            setShowConfetti(true);
            setToastVisible(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (error) {
            console.error('Purchase failed', error);
            soundManager.playSound('error');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Premium Shop</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome5 name="times" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.subtitle}>Get Knowledge Points (KP) to speed up your progress!</Text>

                    <View style={styles.grid}>
                        {packages.map((pkg) => (
                            <PackageCard
                                key={pkg.id}
                                pkg={pkg}
                                onPurchase={handlePurchase}
                                loading={processingId === pkg.id}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.restoreButton}>
                        <Text style={styles.restoreText}>Restore Purchases</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Confetti Overlay */}
                <ParticleSystem
                    active={showConfetti}
                    count={100}
                    origin={{ x: SCREEN_WIDTH / 2, y: SCREEN_WIDTH / 2 }}
                    colors={[COLORS.warning, COLORS.accent, COLORS.white]}
                />

                {/* Toast */}
                <Toast
                    visible={toastVisible}
                    message="Purchase Successful!"
                    type="success"
                    onDismiss={() => setToastVisible(false)}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.xl,
        color: COLORS.text,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: FONTS.sizes.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    packageCardContainer: {
        width: PACKAGE_WIDTH,
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    touchable: {
        flex: 1,
    },
    packageCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        alignItems: 'center',
        minHeight: 220,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.error,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderTopRightRadius: BORDER_RADIUS.lg,
        borderBottomLeftRadius: BORDER_RADIUS.md,
    },
    badgeText: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.white,
    },
    iconContainer: {
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    amount: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.lg,
        color: COLORS.white,
        marginBottom: 4,
    },
    bonusBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    bonusText: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: COLORS.white,
    },
    spacer: {
        flex: 1,
    },
    price: {
        fontFamily: FONTS.bold,
        fontSize: FONTS.sizes.md,
        color: COLORS.white,
        marginBottom: SPACING.md,
        marginTop: SPACING.md,
    },
    purchaseButton: {
        width: '100%',
    },
    restoreButton: {
        alignItems: 'center',
        padding: SPACING.lg,
        marginTop: SPACING.md,
    },
    restoreText: {
        fontFamily: FONTS.medium,
        fontSize: FONTS.sizes.sm,
        color: COLORS.textMuted,
    },
});
