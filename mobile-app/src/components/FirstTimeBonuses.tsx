import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { supabase, addCoins } from '../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants/theme';

interface Bonus {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  unlocked: boolean;
  claimed: boolean;
}

export default function FirstTimeBonuses() {
  const { user, refreshProfile } = useAuth();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBonuses();
  }, [user]);

  const checkBonuses = async () => {
    if (!user) return;

    // Check if user has completed various first-time actions
    const { data: predictions } = await supabase
      .from('predictions')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const { data: progress } = await supabase
      .from('course_progress')
      .select('completed_lessons')
      .eq('user_id', user.id);

    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const totalLessons = progress?.reduce(
      (acc, curr) => acc + (curr.completed_lessons?.length || 0),
      0
    ) || 0;

    // Check claimed bonuses (in real app, store in user_bonuses table)
    const claimedBonuses: string[] = []; // Would fetch from DB

    const allBonuses: Bonus[] = [
      {
        id: 'first-lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        reward: 25,
        icon: 'school',
        unlocked: totalLessons >= 1,
        claimed: claimedBonuses.includes('first-lesson'),
      },
      {
        id: 'first-prediction',
        title: 'Fortune Teller',
        description: 'Make your first prediction',
        reward: 25,
        icon: 'trophy',
        unlocked: (predictions?.length || 0) >= 1,
        claimed: claimedBonuses.includes('first-prediction'),
      },
      {
        id: 'course-complete',
        title: 'Graduate',
        description: 'Complete an entire course',
        reward: 50,
        icon: 'ribbon',
        unlocked: false, // Would check if any course is 100% complete
        claimed: claimedBonuses.includes('course-complete'),
      },
      {
        id: 'first-purchase',
        title: 'Shopper',
        description: 'Make your first shop purchase',
        reward: 25,
        icon: 'cart',
        unlocked: (orders?.length || 0) >= 1,
        claimed: claimedBonuses.includes('first-purchase'),
      },
      {
        id: 'week-streak',
        title: 'Dedicated',
        description: '7 day login streak',
        reward: 100,
        icon: 'flame',
        unlocked: (user.streak_days || 0) >= 7,
        claimed: claimedBonuses.includes('week-streak'),
      },
    ];

    setBonuses(allBonuses);
    setLoading(false);
  };

  const claimBonus = async (bonus: Bonus) => {
    if (!user || !bonus.unlocked || bonus.claimed) return;

    try {
      await addCoins(user.id, bonus.reward, `Bonus: ${bonus.title}`);
      await refreshProfile();

      // Mark as claimed
      setBonuses(prev =>
        prev.map(b =>
          b.id === bonus.id ? { ...b, claimed: true } : b
        )
      );

      Alert.alert(
        'Bonus Claimed!',
        `You earned ${bonus.reward} coins for "${bonus.title}"!`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to claim bonus');
    }
  };

  const unclaimedBonuses = bonuses.filter(b => b.unlocked && !b.claimed);

  if (loading || unclaimedBonuses.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonuses Ready to Claim!</Text>

      {unclaimedBonuses.map((bonus) => (
        <TouchableOpacity
          key={bonus.id}
          style={styles.bonusCard}
          onPress={() => claimBonus(bonus)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={bonus.icon as any} size={24} color={COLORS.accent} />
          </View>

          <View style={styles.bonusInfo}>
            <Text style={styles.bonusTitle}>{bonus.title}</Text>
            <Text style={styles.bonusDescription}>{bonus.description}</Text>
          </View>

          <View style={styles.claimBadge}>
            <Ionicons name="logo-bitcoin" size={14} color={COLORS.accent} />
            <Text style={styles.claimText}>+{bonus.reward}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SPACING.md,
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  bonusTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  bonusDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  claimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  claimText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 4,
  },
});
