-- Add knowledge_points and energy columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS knowledge_points INTEGER DEFAULT 0;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

-- Create knowledge_point_transactions table
CREATE TABLE IF NOT EXISTS knowledge_point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_buildings table
CREATE TABLE IF NOT EXISTS user_buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_type TEXT NOT NULL CHECK (building_type IN ('film-room', 'practice-field', 'stadium', 'locker-room', 'draft-room', 'concession')),
  level INTEGER DEFAULT 1,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT TRUE,
  production_current INTEGER DEFAULT 0,
  last_collected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, building_type)
);

-- Enable RLS
ALTER TABLE knowledge_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own KP transactions" ON knowledge_point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own KP transactions" ON knowledge_point_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own buildings" ON user_buildings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own buildings" ON user_buildings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own buildings" ON user_buildings FOR UPDATE USING (auth.uid() = user_id);

-- Create mission_templates table
CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('complete_lessons','make_predictions','watch_videos','login_streak','earn_coins','spend_coins','answer_questions','share_app','train_units','collect_buildings')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  coin_reward INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 100,
  target_value INTEGER NOT NULL,
  duration_hours INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_missions table
CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES mission_templates(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view mission templates" ON mission_templates FOR SELECT USING (true);
CREATE POLICY "Users can view their own missions" ON user_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own missions" ON user_missions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service can insert user missions" ON user_missions FOR INSERT WITH CHECK (true);

-- Create user_squad_units table
CREATE TABLE IF NOT EXISTS user_squad_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('quarterback', 'runningback', 'receiver', 'lineman', 'linebacker', 'safety', 'cornerback', 'kicker')),
  overall_rating INTEGER DEFAULT 50,
  attack_stat INTEGER DEFAULT 50,
  defense_stat INTEGER DEFAULT 50,
  speed_stat INTEGER DEFAULT 50,
  training_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, unit_type)
);

-- Create training_sessions table
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  stat_to_train TEXT NOT NULL CHECK (stat_to_train IN ('attack', 'defense', 'speed', 'overall')),
  stat_increase INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completes_at TIMESTAMPTZ NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_seasons table
CREATE TABLE IF NOT EXISTS user_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_number INTEGER DEFAULT 1,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,
  points_for INTEGER DEFAULT 0,
  points_against INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_match_results table
CREATE TABLE IF NOT EXISTS user_match_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_id UUID REFERENCES user_seasons(id) ON DELETE CASCADE,
  opponent_name TEXT NOT NULL,
  user_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss')),
  coins_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_squad_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_match_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own squad" ON user_squad_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own squad" ON user_squad_units FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own training sessions" ON training_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own training sessions" ON training_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own seasons" ON user_seasons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own seasons" ON user_seasons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own match results" ON user_match_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own match results" ON user_match_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert mission templates
INSERT INTO mission_templates (title, description, mission_type, rarity, coin_reward, xp_reward, target_value, duration_hours) VALUES
('First Lesson', 'Complete 1 lesson today', 'complete_lessons', 'common', 30, 50, 1, 24),
('Learning Session', 'Complete 3 lessons today', 'complete_lessons', 'common', 50, 100, 3, 24),
('Make a Prediction', 'Predict the outcome of 1 game', 'make_predictions', 'common', 40, 75, 1, 24),
('Video Watcher', 'Watch 2 video lessons', 'watch_videos', 'common', 35, 60, 2, 24),
('Daily Login', 'Login to the app', 'login_streak', 'common', 25, 40, 1, 24),
('Lesson Master', 'Complete 5 lessons today', 'complete_lessons', 'rare', 100, 200, 5, 24),
('Prediction Streak', 'Make 3 predictions today', 'make_predictions', 'rare', 80, 150, 3, 24),
('Coin Collector', 'Earn 100 coins today', 'earn_coins', 'rare', 75, 125, 100, 24),
('Big Spender', 'Spend 50 coins in the shop', 'spend_coins', 'rare', 60, 100, 50, 24),
('Quiz Master', 'Answer 10 quiz questions correctly', 'answer_questions', 'rare', 90, 175, 10, 24),
('Course Crusher', 'Complete 10 lessons today', 'complete_lessons', 'epic', 200, 400, 10, 24),
('Prediction Pro', 'Make 5 predictions today', 'make_predictions', 'epic', 150, 300, 5, 24),
('Coin Tycoon', 'Earn 300 coins today', 'earn_coins', 'epic', 180, 350, 300, 24),
('Training Camp', 'Complete 5 training sessions', 'train_units', 'epic', 160, 320, 5, 24),
('Ultimate Learner', 'Complete an entire course today', 'complete_lessons', 'legendary', 500, 1000, 15, 24),
('Fortune Seeker', 'Earn 1000 coins today', 'earn_coins', 'legendary', 400, 800, 1000, 24),
('HQ Manager', 'Collect from all buildings 3 times', 'collect_buildings', 'legendary', 350, 700, 3, 24)
ON CONFLICT DO NOTHING;

-- Update existing users
UPDATE profiles
SET knowledge_points = COALESCE(knowledge_points, 0),
    energy = COALESCE(energy, 100),
    last_energy_update = COALESCE(last_energy_update, NOW())
WHERE knowledge_points IS NULL OR energy IS NULL;
