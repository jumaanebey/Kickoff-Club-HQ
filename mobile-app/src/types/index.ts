// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'captain';
  coins: number;
  xp: number;
  level: number;
  streak_days: number;
  last_login: string;
  created_at: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  duration_minutes: number;
  lesson_count: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  is_premium: boolean;
  order_index: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  order_index: number;
  coin_reward: number;
}

export interface CourseProgress {
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  progress_percent: number;
  last_watched_at: string;
}

// Prediction types
export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_logo: string;
  away_logo: string;
  game_time: string;
  week: number;
  season: number;
  status: 'upcoming' | 'live' | 'final';
  home_score?: number;
  away_score?: number;
}

export interface Prediction {
  id: string;
  user_id: string;
  game_id: string;
  predicted_winner: 'home' | 'away';
  predicted_score_home?: number;
  predicted_score_away?: number;
  coins_wagered: number;
  is_correct?: boolean;
  coins_won?: number;
  created_at: string;
}

// Shop types
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  coin_price: number;
  category: 'apparel' | 'accessories' | 'digital';
  sizes?: string[];
  in_stock: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_coins: number;
  shipping_address: Address;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}

export interface OrderItem {
  item_id: string;
  quantity: number;
  size?: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  coins: number;
  xp: number;
  rank: number;
  correct_predictions: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  coin_reward: number;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Predict: undefined;
  Learn: undefined;
  Shop: undefined;
  Profile: undefined;
};

export type LearnStackParamList = {
  CourseList: undefined;
  CourseDetail: { courseId: string };
  LessonPlayer: { lessonId: string; courseId: string };
};
