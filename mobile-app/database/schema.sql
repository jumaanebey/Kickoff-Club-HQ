-- Kickoff Club HQ Mobile App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'captain')),
  coins INTEGER DEFAULT 100,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  lesson_count INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  coin_reward INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course progress table
CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons TEXT[] DEFAULT '{}',
  progress_percent DECIMAL DEFAULT 0,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Games table (for predictions)
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_logo TEXT,
  away_logo TEXT,
  game_time TIMESTAMPTZ NOT NULL,
  week INTEGER,
  season INTEGER DEFAULT 2024,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'final')),
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('home', 'away')),
  predicted_score_home INTEGER,
  predicted_score_away INTEGER,
  coins_wagered INTEGER DEFAULT 0,
  is_correct BOOLEAN,
  coins_won INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- Shop items table
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  coin_price INTEGER NOT NULL,
  category TEXT DEFAULT 'apparel' CHECK (category IN ('apparel', 'accessories', 'digital')),
  sizes TEXT[],
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_coins INTEGER NOT NULL,
  shipping_address JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coin transactions table
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  balance_after INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  coin_reward INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Indexes for performance
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_game_id ON predictions(game_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies (public read)
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

-- Lessons policies (public read)
CREATE POLICY "Anyone can view lessons" ON lessons
  FOR SELECT USING (true);

-- Course progress policies
CREATE POLICY "Users can view own progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON course_progress
  FOR ALL USING (auth.uid() = user_id);

-- Games policies (public read)
CREATE POLICY "Anyone can view games" ON games
  FOR SELECT USING (true);

-- Predictions policies
CREATE POLICY "Users can view own predictions" ON predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own predictions" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shop items policies (public read)
CREATE POLICY "Anyone can view shop items" ON shop_items
  FOR SELECT USING (true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coin transactions policies
CREATE POLICY "Users can view own transactions" ON coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON coin_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sample data for testing

-- Insert sample courses
INSERT INTO courses (title, description, difficulty, lesson_count, duration_minutes, is_premium, order_index) VALUES
('Football 101: The Basics', 'Learn the fundamental rules and concepts of American football', 'beginner', 6, 30, false, 1),
('Positions Explained', 'Understand every position on the field and their roles', 'beginner', 5, 25, false, 2),
('Rules & Scoring', 'Master the scoring system and common penalties', 'beginner', 6, 35, false, 3),
('Common Penalties', 'Learn to identify and understand all penalties', 'intermediate', 8, 40, true, 4),
('How to Watch a Game', 'Become an expert viewer and enjoy games more', 'beginner', 5, 25, true, 5);

-- Insert sample games
INSERT INTO games (home_team, away_team, game_time, week, season, status) VALUES
('Kansas City Chiefs', 'Buffalo Bills', NOW() + INTERVAL '3 days', 12, 2024, 'upcoming'),
('San Francisco 49ers', 'Seattle Seahawks', NOW() + INTERVAL '4 days', 12, 2024, 'upcoming'),
('Dallas Cowboys', 'New York Giants', NOW() + INTERVAL '5 days', 12, 2024, 'upcoming'),
('Green Bay Packers', 'Chicago Bears', NOW() + INTERVAL '6 days', 12, 2024, 'upcoming');

-- Insert sample shop items
INSERT INTO shop_items (name, description, coin_price, category, sizes, in_stock) VALUES
('Kickoff Club T-Shirt', 'Classic black tee with green logo', 500, 'apparel', ARRAY['S', 'M', 'L', 'XL'], true),
('Kickoff Club Hoodie', 'Comfortable hoodie for game day', 1000, 'apparel', ARRAY['S', 'M', 'L', 'XL'], true),
('Kickoff Club Cap', 'Adjustable cap with embroidered logo', 350, 'accessories', NULL, true),
('Digital Playbook', 'PDF guide to understanding plays', 200, 'digital', NULL, true),
('Kickoff Club Sticker Pack', '5 premium vinyl stickers', 150, 'accessories', NULL, true);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, coin_reward, xp_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first lesson', 'school', 50, 100, 'lessons_completed', 1),
('Course Master', 'Complete your first course', 'trophy', 200, 500, 'courses_completed', 1),
('Prediction Pro', 'Get 5 predictions correct', 'checkmark-circle', 150, 300, 'correct_predictions', 5),
('7 Day Streak', 'Login 7 days in a row', 'flame', 100, 200, 'streak_days', 7),
('Big Spender', 'Spend 1000 coins in the shop', 'cart', 100, 150, 'coins_spent', 1000);
