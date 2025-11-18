import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getUpcomingGames, getCourses } from '../../services/supabase';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';
import { APP_CONFIG } from '../../constants/config';
import { Game, Course } from '../../types';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, refreshProfile } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [games, courses] = await Promise.all([
        getUpcomingGames(),
        getCourses(),
      ]);
      setUpcomingGames(games?.slice(0, 3) || []);
      setFeaturedCourses(courses?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), refreshProfile()]);
    setRefreshing(false);
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
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user?.username || 'Player'}</Text>
          </View>
          <TouchableOpacity style={styles.coinBalance}>
            <Ionicons name="logo-bitcoin" size={20} color={COLORS.accent} />
            <Text style={styles.coinText}>{user?.coins || 0}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={COLORS.error} />
            <Text style={styles.statValue}>{user?.streak_days || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={COLORS.accent} />
            <Text style={styles.statValue}>{user?.xp || 0}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="ribbon" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{user?.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {/* Daily Bonus Card */}
        <TouchableOpacity style={styles.dailyBonus}>
          <View style={styles.dailyBonusContent}>
            <Ionicons name="gift" size={32} color={COLORS.accent} />
            <View style={styles.dailyBonusText}>
              <Text style={styles.dailyBonusTitle}>Daily Bonus</Text>
              <Text style={styles.dailyBonusSubtitle}>
                Claim {APP_CONFIG.coins.dailyBonus[user?.subscription_tier || 'free']} Coins
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Upcoming Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Games</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Predict' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingGames.length > 0 ? (
            upcomingGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => navigation.navigate('Predict' as never)}
              >
                <View style={styles.gameTeams}>
                  <Text style={styles.teamName}>{game.away_team}</Text>
                  <Text style={styles.vs}>@</Text>
                  <Text style={styles.teamName}>{game.home_team}</Text>
                </View>
                <Text style={styles.gameTime}>
                  {new Date(game.game_time).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming games</Text>
          )}
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Learn' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => navigation.navigate('Learn' as never)}
              >
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDesc} numberOfLines={1}>
                    {course.description}
                  </Text>
                </View>
                <View style={styles.courseMeta}>
                  <Ionicons name="play-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.lessonCount}>
                    {course.lesson_count} lessons
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No courses available</Text>
          )}
        </View>

        {/* Subscription CTA (for free users) */}
        {user?.subscription_tier === 'free' && (
          <TouchableOpacity style={styles.upgradeCTA}>
            <Ionicons name="rocket" size={24} color={COLORS.white} />
            <View style={styles.upgradeText}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeSubtitle}>
                Unlock all courses & get more Coins
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  username: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
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
    marginTop: SPACING.xs,
  },
  dailyBonus: {
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
  dailyBonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyBonusText: {
    marginLeft: SPACING.md,
  },
  dailyBonusTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dailyBonusSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.accent,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
  },
  gameCard: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  gameTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  vs: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  gameTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  courseCard: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  courseInfo: {
    marginBottom: SPACING.sm,
  },
  courseTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  courseDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonCount: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  upgradeCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  upgradeText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  upgradeTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  upgradeSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  bottomPadding: {
    height: SPACING.xxl,
  },
});
