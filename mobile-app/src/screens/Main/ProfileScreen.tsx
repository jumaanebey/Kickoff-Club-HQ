import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { AnimatedButton } from '../../components/animations';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { isDarkMode, notificationsEnabled, toggleDarkMode, toggleNotifications, colors } = useSettings();

  // Create dynamic styles based on current theme
  const dynamicStyles = useMemo(() => ({
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    textSecondary: { color: colors.textSecondary },
    textMuted: { color: colors.textMuted },
    card: { backgroundColor: colors.backgroundLight },
    border: { borderColor: colors.border },
  }), [colors]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  const handleUpgrade = () => {
    // Navigate to subscription screen or show in-app purchase
    Alert.alert(
      'Upgrade to Pro',
      'Get access to all courses, unlimited predictions, and more Coins daily!',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Upgrade $9.99/mo', onPress: () => {} },
      ]
    );
  };

  const tierColors = {
    free: colors.textMuted,
    pro: colors.primary,
    captain: colors.accent,
  };

  const tierLabels = {
    free: 'Free',
    pro: 'Pro',
    captain: 'Captain',
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, dynamicStyles.text]}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, dynamicStyles.card]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.username, dynamicStyles.text]}>{user?.username || 'User'}</Text>
            <Text style={[styles.email, dynamicStyles.textSecondary]}>{user?.email}</Text>
            <View
              style={[
                styles.tierBadge,
                { backgroundColor: tierColors[user?.subscription_tier || 'free'] + '30' },
              ]}
            >
              <Text
                style={[
                  styles.tierText,
                  { color: tierColors[user?.subscription_tier || 'free'] },
                ]}
              >
                {tierLabels[user?.subscription_tier || 'free']}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, dynamicStyles.card]}>
          <View style={styles.statItem}>
            <Ionicons name="logo-bitcoin" size={24} color={colors.accent} />
            <Text style={[styles.statValue, dynamicStyles.text]}>{user?.coins || 0}</Text>
            <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>Coins</Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.border]} />
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color={colors.primary} />
            <Text style={[styles.statValue, dynamicStyles.text]}>{user?.xp || 0}</Text>
            <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>XP</Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.border]} />
          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color={colors.error} />
            <Text style={[styles.statValue, dynamicStyles.text]}>{user?.streak_days || 0}</Text>
            <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>Streak</Text>
          </View>
        </View>

        {/* Upgrade CTA (for free users) */}
        {user?.subscription_tier === 'free' && (
          <AnimatedButton style={styles.upgradeCard} onPress={handleUpgrade}>
            <View style={styles.upgradeContent}>
              <Ionicons name="rocket" size={32} color={COLORS.accent} />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                <Text style={styles.upgradeSubtitle}>
                  Unlock all features for ${APP_CONFIG.pricing.pro.price}/month
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.accent} />
          </AnimatedButton>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.textSecondary]}>Settings</Text>

          <View style={[styles.settingItem, dynamicStyles.card]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <Text style={[styles.settingLabel, dynamicStyles.text]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={[styles.settingItem, dynamicStyles.card]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text style={[styles.settingLabel, dynamicStyles.text]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="card-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Subscription</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="time-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Order History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="trophy-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Achievements</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>

          <AnimatedButton style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-outline" size={20} color={COLORS.text} />
              <Text style={styles.menuLabel}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </AnimatedButton>
        </View>

        {/* Sign Out */}
        <AnimatedButton style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </AnimatedButton>

        {/* App Version */}
        <Text style={styles.version}>
          Kickoff Club HQ v{APP_CONFIG.version}
        </Text>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  username: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
  },
  tierText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upgradeText: {
    marginLeft: SPACING.md,
  },
  upgradeTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  upgradeSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundLight,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginBottom: SPACING.md,
  },
  signOutText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
