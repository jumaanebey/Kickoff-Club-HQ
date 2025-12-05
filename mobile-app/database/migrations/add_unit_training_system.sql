-- Unit-Based Training System (Premium Football Simulation)
-- This replaces individual drills with position group training

-- Training Units (position groups)
CREATE TABLE IF NOT EXISTS training_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('offensive_line', 'skill_positions', 'defensive_line', 'secondary', 'special_teams')),
  description TEXT,
  icon TEXT,
  base_training_time INTEGER DEFAULT 60, -- minutes per training session
  unlock_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's squad units (each user has all position groups)
CREATE TABLE IF NOT EXISTS user_squad_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('offensive_line', 'skill_positions', 'defensive_line', 'secondary', 'special_teams')),

  -- Readiness system (0-100%)
  readiness INTEGER DEFAULT 0 CHECK (readiness >= 0 AND readiness <= 100),

  -- Training state
  is_training BOOLEAN DEFAULT false,
  training_started_at TIMESTAMPTZ,
  training_completes_at TIMESTAMPTZ,
  training_session_id UUID,

  -- Stats
  total_training_sessions INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, unit_type)
);

-- Training sessions (active training)
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL,

  -- Session details
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completes_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,

  -- Rewards
  readiness_gain INTEGER DEFAULT 15, -- percentage gain
  energy_cost INTEGER DEFAULT 10,
  coins_reward INTEGER DEFAULT 30,
  xp_reward INTEGER DEFAULT 10,

  -- Completion
  completed_at TIMESTAMPTZ,
  claimed BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Season system
CREATE TABLE IF NOT EXISTS user_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_number INTEGER DEFAULT 1,

  -- Season state
  phase TEXT DEFAULT 'offseason' CHECK (phase IN ('offseason', 'preseason', 'regular_season', 'playoffs', 'complete')),

  -- Requirements for phases
  min_readiness_for_matches INTEGER DEFAULT 60, -- need 60% readiness to start playing

  -- Season stats
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,

  -- Season rewards
  total_coins_earned INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,

  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, season_number)
);

-- Match results (connects to existing games table)
CREATE TABLE IF NOT EXISTS user_match_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_id UUID REFERENCES user_seasons(id) ON DELETE CASCADE,
  game_id UUID, -- references games table from predictions system

  -- Match simulation
  user_score INTEGER,
  opponent_score INTEGER,
  won BOOLEAN,

  -- Rewards
  coins_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  knowledge_points_earned INTEGER DEFAULT 0,

  -- Match factors
  team_readiness INTEGER, -- average readiness at time of match

  played_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default training units
INSERT INTO training_units (name, unit_type, description, icon, base_training_time, unlock_level) VALUES
('Offensive Line', 'offensive_line', 'Train your O-Line to dominate the trenches', 'shield-checkmark', 60, 1),
('Skill Positions', 'skill_positions', 'Develop QBs, RBs, WRs, and TEs', 'flash', 60, 1),
('Defensive Line', 'defensive_line', 'Build an unstoppable pass rush', 'shield-half', 60, 1),
('Secondary', 'secondary', 'Train DBs to lock down receivers', 'eye', 60, 2),
('Special Teams', 'special_teams', 'Perfect kicks, punts, and returns', 'football', 90, 3)
ON CONFLICT DO NOTHING;

-- Function to start training session
CREATE OR REPLACE FUNCTION start_training_session(
  p_user_id UUID,
  p_unit_type TEXT,
  p_duration_minutes INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_energy INTEGER;
  v_energy_cost INTEGER;
  v_session_id UUID;
  v_completes_at TIMESTAMPTZ;
  v_readiness_gain INTEGER;
BEGIN
  -- Check user has enough energy
  SELECT energy INTO v_energy FROM profiles WHERE id = p_user_id;

  v_energy_cost := CASE
    WHEN p_duration_minutes = 30 THEN 5
    WHEN p_duration_minutes = 60 THEN 10
    WHEN p_duration_minutes = 120 THEN 15
    ELSE 10
  END;

  IF v_energy < v_energy_cost THEN
    RETURN json_build_object('error', 'insufficient_energy');
  END IF;

  -- Check unit isn't already training
  IF EXISTS (
    SELECT 1 FROM user_squad_units
    WHERE user_id = p_user_id
      AND unit_type = p_unit_type
      AND is_training = true
  ) THEN
    RETURN json_build_object('error', 'unit_already_training');
  END IF;

  -- Calculate readiness gain based on duration
  v_readiness_gain := CASE
    WHEN p_duration_minutes = 30 THEN 10
    WHEN p_duration_minutes = 60 THEN 20
    WHEN p_duration_minutes = 120 THEN 35
    ELSE 15
  END;

  -- Calculate completion time
  v_completes_at := NOW() + (p_duration_minutes || ' minutes')::INTERVAL;

  -- Create training session
  INSERT INTO training_sessions (
    user_id,
    unit_type,
    completes_at,
    duration_minutes,
    readiness_gain,
    energy_cost
  ) VALUES (
    p_user_id,
    p_unit_type,
    v_completes_at,
    p_duration_minutes,
    v_readiness_gain,
    v_energy_cost
  ) RETURNING id INTO v_session_id;

  -- Update unit state
  UPDATE user_squad_units
  SET is_training = true,
      training_started_at = NOW(),
      training_completes_at = v_completes_at,
      training_session_id = v_session_id,
      updated_at = NOW()
  WHERE user_id = p_user_id AND unit_type = p_unit_type;

  -- Deduct energy
  UPDATE profiles
  SET energy = energy - v_energy_cost
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'session_id', v_session_id,
    'completes_at', v_completes_at,
    'readiness_gain', v_readiness_gain
  );
END;
$$;

-- Function to complete training session
CREATE OR REPLACE FUNCTION complete_training_session(
  p_session_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session training_sessions;
  v_new_readiness INTEGER;
BEGIN
  -- Get session
  SELECT * INTO v_session FROM training_sessions WHERE id = p_session_id FOR UPDATE;

  IF v_session IS NULL THEN
    RETURN json_build_object('error', 'session_not_found');
  END IF;

  IF v_session.claimed THEN
    RETURN json_build_object('error', 'already_claimed');
  END IF;

  IF NOW() < v_session.completes_at THEN
    RETURN json_build_object('error', 'not_complete');
  END IF;

  -- Update unit readiness (cap at 100)
  UPDATE user_squad_units
  SET readiness = LEAST(readiness + v_session.readiness_gain, 100),
      is_training = false,
      training_started_at = NULL,
      training_completes_at = NULL,
      training_session_id = NULL,
      total_training_sessions = total_training_sessions + 1,
      updated_at = NOW()
  WHERE user_id = v_session.user_id AND unit_type = v_session.unit_type
  RETURNING readiness INTO v_new_readiness;

  -- Award rewards
  UPDATE profiles
  SET coins = coins + v_session.coins_reward,
      xp = xp + v_session.xp_reward
  WHERE id = v_session.user_id;

  -- Mark session as claimed
  UPDATE training_sessions
  SET completed_at = NOW(),
      claimed = true
  WHERE id = p_session_id;

  RETURN json_build_object(
    'success', true,
    'new_readiness', v_new_readiness,
    'coins_earned', v_session.coins_reward,
    'xp_earned', v_session.xp_reward
  );
END;
$$;

-- Function to initialize squad for new users
CREATE OR REPLACE FUNCTION initialize_user_squad(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create all 5 units for the user
  INSERT INTO user_squad_units (user_id, unit_type, readiness, level)
  VALUES
    (p_user_id, 'offensive_line', 0, 1),
    (p_user_id, 'skill_positions', 0, 1),
    (p_user_id, 'defensive_line', 0, 1),
    (p_user_id, 'secondary', 0, 1),
    (p_user_id, 'special_teams', 0, 1)
  ON CONFLICT (user_id, unit_type) DO NOTHING;

  -- Create first season
  INSERT INTO user_seasons (user_id, season_number, phase)
  VALUES (p_user_id, 1, 'offseason')
  ON CONFLICT (user_id, season_number) DO NOTHING;
END;
$$;

-- Initialize squads for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM profiles LOOP
    PERFORM initialize_user_squad(user_record.id);
  END LOOP;
END;
$$;

-- RLS Policies
ALTER TABLE user_squad_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own squad units"
  ON user_squad_units FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own squad units"
  ON user_squad_units FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own training sessions"
  ON training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own training sessions"
  ON training_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own seasons"
  ON user_seasons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own match results"
  ON user_match_results FOR SELECT
  USING (auth.uid() = user_id);
