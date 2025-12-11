import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Modal,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AnimatedButton, CelebrationBurst, AnimatedCountUp } from '../../components/animations';
import { Toast } from '../../components/Toast';
import * as Haptics from 'expo-haptics';
import { getShopItems, spendCoins } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { ShopItem } from '../../types';

export default function ShopScreen() {
  const { user, refreshProfile } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [celebrationAnimations, setCelebrationAnimations] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'grid-outline' },
    { id: 'apparel', label: 'Apparel', icon: 'shirt-outline' },
    { id: 'accessories', label: 'Accessories', icon: 'watch-outline' },
    { id: 'digital', label: 'Digital', icon: 'download-outline' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const itemsData = await getShopItems();
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error loading shop items:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleItemPress = (item: ShopItem) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes?.[0] || null);
    setShowModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedItem || !user) return;

    if (selectedItem.sizes && !selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }

    if ((user.coins || 0) < selectedItem.coin_price) {
      showToast('You don\'t have enough coins for this item', 'error');
      return;
    }

    try {
      await spendCoins(
        user.id,
        selectedItem.coin_price,
        `Shop: ${selectedItem.name}`
      );

      // Trigger celebration animation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCelebrationAnimations([{
        id: Date.now().toString(),
        x: width / 2,
        y: height / 3,
      }]);

      await refreshProfile();
      setShowModal(false);
      showToast('Purchase Successful! Check your email.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to complete purchase', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          <View style={styles.coinBalance}>
            <Ionicons name="logo-bitcoin" size={20} color={COLORS.accent} />
            <AnimatedCountUp
              key={user?.coins}
              endValue={user?.coins || 0}
              duration={800}
              style={styles.coinText}
            />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categories}>
          {categories.map((category) => (
            <AnimatedButton
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={
                  selectedCategory === category.id
                    ? COLORS.white
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </AnimatedButton>
          ))}
        </View>

        {/* Items Grid */}
        <View style={styles.itemsGrid}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <AnimatedButton
                key={item.id}
                style={styles.itemCard}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.itemImage}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.itemImageContent}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.itemImagePlaceholder}>
                      <Ionicons name="gift" size={32} color={COLORS.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.itemPrice}>
                    <Ionicons name="logo-bitcoin" size={14} color={COLORS.accent} />
                    <Text style={styles.itemPriceText}>{item.coin_price}</Text>
                  </View>
                </View>
              </AnimatedButton>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No items available</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AnimatedButton
              style={styles.modalClose}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </AnimatedButton>

            {selectedItem && (
              <>
                <View style={styles.modalImage}>
                  {selectedItem.image_url ? (
                    <Image
                      source={{ uri: selectedItem.image_url }}
                      style={styles.modalImageContent}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.modalImagePlaceholder}>
                      <Ionicons name="gift" size={64} color={COLORS.primary} />
                    </View>
                  )}
                </View>

                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.description}
                </Text>

                {selectedItem.sizes && (
                  <View style={styles.sizeSection}>
                    <Text style={styles.sizeLabel}>Select Size</Text>
                    <View style={styles.sizeOptions}>
                      {selectedItem.sizes.map((size) => (
                        <AnimatedButton
                          key={size}
                          style={[
                            styles.sizeButton,
                            selectedSize === size && styles.sizeButtonActive,
                          ]}
                          onPress={() => setSelectedSize(size)}
                        >
                          <Text
                            style={[
                              styles.sizeButtonText,
                              selectedSize === size && styles.sizeButtonTextActive,
                            ]}
                          >
                            {size}
                          </Text>
                        </AnimatedButton>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.modalPrice}>
                  <Ionicons name="logo-bitcoin" size={24} color={COLORS.accent} />
                  <Text style={styles.modalPriceText}>
                    {selectedItem.coin_price}
                  </Text>
                </View>

                <AnimatedButton
                  style={[
                    styles.purchaseButton,
                    (user?.coins || 0) < selectedItem.coin_price &&
                    styles.purchaseButtonDisabled,
                  ]}
                  onPress={handlePurchase}
                  disabled={(user?.coins || 0) < selectedItem.coin_price}
                >
                  <Text style={styles.purchaseButtonText}>
                    {(user?.coins || 0) < selectedItem.coin_price
                      ? 'Not Enough Coins'
                      : 'Purchase'}
                  </Text>
                </AnimatedButton>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Celebration Animations */}
      {celebrationAnimations.map((celebration) => (
        <CelebrationBurst
          key={celebration.id}
          x={celebration.x}
          y={celebration.y}
          onComplete={() => {
            setCelebrationAnimations((prev) => prev.filter((c) => c.id !== celebration.id));
          }}
        />
      ))}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  coinBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  coinText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: FONTS.sizes.lg,
    marginLeft: SPACING.xs,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.backgroundLight,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
  },
  itemCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  itemImage: {
    height: 120,
    backgroundColor: COLORS.backgroundCard,
  },
  itemImageContent: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    padding: SPACING.sm,
  },
  itemName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPriceText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    width: '100%',
  },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
  },
  modalImage: {
    height: 200,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  modalImageContent: {
    width: '100%',
    height: '100%',
  },
  modalImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  sizeSection: {
    marginBottom: SPACING.lg,
  },
  sizeLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sizeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  sizeButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  sizeButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  modalPriceText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: SPACING.sm,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  purchaseButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
});
