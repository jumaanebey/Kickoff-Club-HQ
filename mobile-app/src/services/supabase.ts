import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY, API_BASE_URL } from '../constants/config';
import { ProfileUpdates, OrderItem, Address, UserBuilding } from '../types';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth functions
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      username,
      subscription_tier: 'free',
      coins: 100, // Welcome bonus
      knowledge_points: 0,
      energy: 100,
      last_energy_update: new Date().toISOString(),
      xp: 0,
      level: 1,
      streak_days: 0,
    });

    // Initialize squad units and season
    await supabase.rpc('initialize_user_squad', {
      p_user_id: data.user.id,
    });
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: ProfileUpdates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Course functions
export const getCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('order_index');

  if (error) throw error;
  return data;
};

export const getCourseWithLessons = async (courseId: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (*)
    `)
    .eq('id', courseId)
    .single();

  if (error) throw error;
  return data;
};

// Video URL fetching - gets signed URL for R2 or YouTube embed URL
export const getVideoUrl = async (videoId: string): Promise<{
  url: string;
  type: 'youtube' | 'r2' | 'direct';
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/video-url?videoId=${videoId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get video URL');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching video URL:', error);
    throw error;
  }
};

export const getCourseProgress = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error) return null; // No progress yet
  return data;
};

export const updateCourseProgress = async (
  userId: string,
  courseId: string,
  lessonId: string
) => {
  // Get current progress
  const current = await getCourseProgress(userId, courseId);

  const completedLessons = current?.completed_lessons || [];
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  // Get total lessons for course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId);

  const progressPercent = lessons
    ? (completedLessons.length / lessons.length) * 100
    : 0;

  const { data, error } = await supabase
    .from('course_progress')
    .upsert({
      user_id: userId,
      course_id: courseId,
      completed_lessons: completedLessons,
      progress_percent: progressPercent,
      last_watched_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Prediction functions
export const getUpcomingGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'upcoming')
    .order('game_time');

  if (error) throw error;
  return data;
};

export const getUserPredictions = async (userId: string) => {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      *,
      games (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const makePrediction = async (prediction: {
  user_id: string;
  game_id: string;
  predicted_winner: 'home' | 'away';
  coins_wagered: number;
}) => {
  const { data, error } = await supabase
    .from('predictions')
    .insert(prediction)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Shop functions
export const getShopItems = async () => {
  const { data, error } = await supabase
    .from('shop_items')
    .select('*')
    .eq('in_stock', true)
    .order('coin_price');

  if (error) throw error;
  return data;
};

export const createOrder = async (order: {
  user_id: string;
  items: OrderItem[];
  total_coins: number;
  shipping_address: Address;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...order,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Leaderboard functions
export const getLeaderboard = async (limit: number = 100) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, coins, xp')
    .order('coins', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data?.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
};

// Coin functions
export const addCoins = async (userId: string, amount: number, reason: string) => {
  // Get current coins
  const { data: profile } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', userId)
    .single();

  const newCoins = (profile?.coins || 0) + amount;

  // Update coins
  await supabase
    .from('profiles')
    .update({ coins: newCoins })
    .eq('id', userId);

  // Log transaction
  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount,
    reason,
    balance_after: newCoins,
  });

  return newCoins;
};

export const spendCoins = async (userId: string, amount: number, reason: string) => {
  // Get current coins
  const { data: profile } = await supabase
    .from('profiles')
    .select('coins')
    .eq('id', userId)
    .single();

  if ((profile?.coins || 0) < amount) {
    throw new Error('Insufficient coins');
  }

  const newCoins = (profile?.coins || 0) - amount;

  // Update coins
  await supabase
    .from('profiles')
    .update({ coins: newCoins })
    .eq('id', userId);

  // Log transaction
  await supabase.from('coin_transactions').insert({
    user_id: userId,
    amount: -amount,
    reason,
    balance_after: newCoins,
  });

  return newCoins;
};

// Knowledge Points functions
export const addKnowledgePoints = async (userId: string, amount: number, source: string) => {
  const { data, error } = await supabase.rpc('add_knowledge_points', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
  });

  if (error) throw error;
  return data;
};

export const subtractKnowledgePoints = async (userId: string, amount: number, source: string) => {
  const { data, error } = await supabase.rpc('subtract_knowledge_points', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
  });

  if (error) throw error;
  return data;
};

// Energy functions
export const refillEnergy = async (userId: string) => {
  const { data, error } = await supabase.rpc('refill_energy', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const useEnergy = async (userId: string, amount: number) => {
  // Get current energy (with refill)
  const currentEnergy = await refillEnergy(userId);

  if (currentEnergy < amount) {
    throw new Error('Insufficient energy');
  }

  // Deduct energy
  const { data, error } = await supabase
    .from('profiles')
    .update({ energy: currentEnergy - amount })
    .eq('id', userId)
    .select('energy')
    .single();

  if (error) throw error;
  return data.energy;
};

// Building functions
export const getUserBuildings = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_buildings')
    .select('*')
    .eq('user_id', userId)
    .order('position_x');

  if (error) throw error;
  return data || [];
};

export const createBuilding = async (building: {
  user_id: string;
  building_type: string;
  position_x: number;
  position_y: number;
  level?: number;
}) => {
  const { data, error } = await supabase
    .from('user_buildings')
    .insert(building)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upgradeBuilding = async (buildingId: string, newLevel: number) => {
  const { data, error } = await supabase
    .from('user_buildings')
    .update({ level: newLevel })
    .eq('id', buildingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const collectBuildingProduction = async (buildingId: string, amount: number) => {
  const { data, error } = await supabase
    .from('user_buildings')
    .update({
      production_current: 0,
      production_last_collected: new Date().toISOString(),
    })
    .eq('id', buildingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Enhanced building production functions
export const calculateProductionForBuilding = async (buildingId: string): Promise<number> => {
  const { data, error } = await supabase.rpc('calculate_building_production', {
    p_user_building_id: buildingId,
  });

  if (error) {
    console.error('Production calculation error:', error);
    return 0;
  }
  return data || 0;
};

export const startBuildingUpgrade = async (
  userId: string,
  buildingId: string,
  upgradeCost: number
): Promise<{ success: boolean; error?: string; data?: UserBuilding }> => {
  try {
    // Get building and config info
    const { data: building, error: fetchError } = await supabase
      .from('user_buildings')
      .select('building_type, level')
      .eq('id', buildingId)
      .single();

    if (fetchError || !building) {
      return { success: false, error: 'Building not found' };
    }

    const nextLevel = building.level + 1;

    const { data: config, error: configError } = await supabase
      .from('building_level_configs')
      .select('build_time_seconds, upgrade_cost')
      .eq('building_type', building.building_type)
      .eq('level', nextLevel)
      .single();

    if (configError || !config) {
      return { success: false, error: 'Invalid upgrade level' };
    }

    const completeAt = new Date(Date.now() + (config.build_time_seconds || 0) * 1000);

    // Deduct coins from user (Fetch first to ensure atomic-like operation not possible without RPC, but safer than raw SQL injection attempt)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', userId)
      .single();

    if (profileError || !profile || profile.coins < upgradeCost) {
      return { success: false, error: 'Insufficient coins' };
    }

    const { error: coinsError } = await supabase
      .from('profiles')
      .update({ coins: profile.coins - upgradeCost })
      .eq('id', userId);

    if (coinsError) {
      return { success: false, error: 'Insufficient coins' };
    }

    // Mark building as upgrading
    const { data: updatedBuilding, error: updateError } = await supabase
      .from('user_buildings')
      .update({
        is_upgrading: true,
        upgrade_complete_at: completeAt.toISOString(),
      })
      .eq('id', buildingId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, data: updatedBuilding };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const completeBuildingUpgrade = async (
  buildingId: string
): Promise<{ success: boolean; error?: string; data?: UserBuilding }> => {
  try {
    const { data: building } = await supabase
      .from('user_buildings')
      .select('level')
      .eq('id', buildingId)
      .single();

    if (!building) {
      return { success: false, error: 'Building not found' };
    }

    const { data, error } = await supabase
      .from('user_buildings')
      .update({
        level: building.level + 1,
        is_upgrading: false,
        upgrade_complete_at: null,
      })
      .eq('id', buildingId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Unit Training System functions
export const getUserSquadUnits = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_squad_units')
    .select('*')
    .eq('user_id', userId)
    .order('unit_type');

  if (error) throw error;
  return data || [];
};

export const startTrainingSession = async (
  userId: string,
  unitType: string,
  durationMinutes: number
) => {
  const { data, error } = await supabase.rpc('start_training_session', {
    p_user_id: userId,
    p_unit_type: unitType,
    p_duration_minutes: durationMinutes,
  });

  if (error) throw error;
  return data;
};

export const completeTrainingSession = async (sessionId: string) => {
  const { data, error } = await supabase.rpc('complete_training_session', {
    p_session_id: sessionId,
  });

  if (error) throw error;
  return data;
};

export const getTrainingSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('claimed', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getUserSeason = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_seasons')
    .select('*')
    .eq('user_id', userId)
    .order('season_number', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
};

export const getMatchResults = async (userId: string, seasonId: string) => {
  const { data, error } = await supabase
    .from('user_match_results')
    .select('*')
    .eq('user_id', userId)
    .eq('season_id', seasonId)
    .order('played_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const simulateMatch = async (userId: string, gameId: string) => {
  const { data, error } = await supabase.rpc('simulate_match', {
    p_user_id: userId,
    p_game_id: gameId,
  });

  if (error) throw error;
  return data;
};

// Daily Missions functions
export const assignDailyMissions = async (userId: string) => {
  const { data, error } = await supabase.rpc('assign_daily_missions', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const getUserMissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_missions')
    .select(`
      *,
      mission_templates (*)
    `)
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateMissionProgress = async (userId: string, missionType: string, increment: number = 1) => {
  const { error } = await supabase.rpc('update_mission_progress', {
    p_user_id: userId,
    p_mission_type: missionType,
    p_increment: increment,
  });

  if (error) throw error;
};

export const claimMissionReward = async (missionId: string) => {
  const { data, error } = await supabase.rpc('claim_mission_reward', {
    p_mission_id: missionId,
  });

  if (error) throw error;
  return data;
};

// ============================================================================
// Training System Functions (New - Week 3)
// ============================================================================

export const startTraining = async (userId: string, unitType: string) => {
  const { data, error } = await supabase.rpc('start_training', {
    p_user_id: userId,
    p_unit_type: unitType,
  });

  if (error) throw error;
  return data;
};

export const collectTraining = async (sessionId: string) => {
  const { data, error } = await supabase.rpc('collect_training', {
    p_session_id: sessionId,
  });

  if (error) throw error;
  return data;
};

export const getActiveTrainingSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('unit_training_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('collected', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ============================================================================
// Match System Functions (New - Week 5)
// ============================================================================

export const playMatch = async (userId: string) => {
  const { data, error } = await supabase.rpc('play_match', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const getMatchHistory = async (userId: string, limit: number = 10) => {
  const { data, error } = await supabase
    .from('match_history')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getMatchStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('match_history')
    .select('won, coins_earned, xp_earned')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    totalMatches: data?.length || 0,
    wins: data?.filter((m) => m.won).length || 0,
    losses: data?.filter((m) => !m.won).length || 0,
    winRate: 0,
    totalCoinsEarned: data?.reduce((sum, m) => sum + m.coins_earned, 0) || 0,
    totalXpEarned: data?.reduce((sum, m) => sum + m.xp_earned, 0) || 0,
  };

  stats.winRate = stats.totalMatches > 0 ? (stats.wins / stats.totalMatches) * 100 : 0;

  return stats;
};
