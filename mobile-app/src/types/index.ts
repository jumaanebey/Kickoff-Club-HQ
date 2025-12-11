// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'captain';
  coins: number;
  knowledge_points: number;
  energy: number;
  last_energy_update: string;
  xp: number;
  level: number;
  streak_days: number;
  last_login: string;
  created_at: string;
  team_readiness?: number;
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
  HQ: undefined;
  Squad: undefined;
  Match: undefined;
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

export type HQStackParamList = {
  HQMain: undefined;
  PracticeField: undefined;
};

// Unit Training System types
export type UnitType = 'offensive_line' | 'skill_positions' | 'defensive_line' | 'secondary' | 'special_teams';

export interface TrainingUnit {
  id: string;
  name: string;
  unit_type: UnitType;
  description: string;
  icon: string;
  base_training_time: number;
  unlock_level: number;
  created_at: string;
}

export interface UserSquadUnit {
  id: string;
  user_id: string;
  unit_type: UnitType;
  readiness: number; // 0-100
  is_training: boolean;
  training_started_at?: string;
  training_completes_at?: string;
  training_session_id?: string;
  total_training_sessions: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  unit_type: UnitType;
  started_at: string;
  completes_at: string;
  duration_minutes: number;
  readiness_gain: number;
  energy_cost: number;
  coins_reward: number;
  xp_reward: number;
  completed_at?: string;
  claimed: boolean;
  created_at: string;
}

export type SeasonPhase = 'offseason' | 'preseason' | 'regular_season' | 'playoffs' | 'complete';

export interface UserSeason {
  id: string;
  user_id: string;
  season_number: number;
  phase: SeasonPhase;
  min_readiness_for_matches: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  total_coins_earned: number;
  total_xp_earned: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface UserMatchResult {
  id: string;
  user_id: string;
  season_id: string;
  game_id: string;
  user_score: number;
  opponent_score: number;
  won: boolean;
  coins_earned: number;
  xp_earned: number;
  knowledge_points_earned: number;
  team_readiness: number;
  played_at: string;
  created_at: string;
}

// Daily Missions types
export type MissionType = 'training' | 'match' | 'login' | 'upgrade' | 'collect';
export type MissionRarity = 'common' | 'rare' | 'epic';

export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  mission_type: MissionType;
  requirement_count: number;
  coins_reward: number;
  xp_reward: number;
  knowledge_points_reward: number;
  is_daily: boolean;
  rarity: MissionRarity;
  created_at: string;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_template_id: string;
  current_count: number;
  completed: boolean;
  claimed: boolean;
  assigned_at: string;
  expires_at: string;
  completed_at?: string;
  claimed_at?: string;
  created_at: string;
  mission_templates?: MissionTemplate;
}

// Profile update types
export type ProfileUpdates = Partial<Omit<User, 'id' | 'created_at'>>;

// Building types
export type BuildingType = 'training_facility' | 'locker_room' | 'stadium' | 'merchandise_shop' | 'medical_center';

export interface UserBuilding {
  id: string;
  user_id: string;
  building_type: BuildingType;
  position_x: number;
  position_y: number;
  level: number;
  is_upgrading: boolean;
  upgrade_complete_at?: string;
  production_current: number;
  production_last_collected?: string;
  created_at: string;
  updated_at: string;
}

export interface BuildingLevelConfig {
  id: string;
  building_type: BuildingType;
  level: number;
  build_time_seconds: number;
  upgrade_cost: number;
  production_rate: number;
  max_capacity: number;
}

// Navigation composite types for screens
export type LearnScreenNavigationProp = {
  navigate: (screen: 'CourseDetail', params: { courseId: string }) => void;
};

export type CourseDetailScreenNavigationProp = {
  navigate: (screen: 'LessonPlayer', params: { lessonId: string; courseId: string }) => void;
  goBack: () => void;
};

export type LessonPlayerScreenNavigationProp = {
  navigate: (screen: 'LessonPlayer', params: { lessonId: string; courseId: string }) => void;
  goBack: () => void;
};

export type HomeScreenNavigationProp = {
  navigate: (screen: 'Predict' | 'Learn') => void;
};
