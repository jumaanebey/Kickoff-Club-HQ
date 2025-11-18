import 'react-native-url-polyfill/dist/polyfill';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';

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
      xp: 0,
      level: 1,
      streak_days: 0,
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

export const updateProfile = async (userId: string, updates: any) => {
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
  items: any[];
  total_coins: number;
  shipping_address: any;
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

  const newCoins = profile.coins - amount;

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
