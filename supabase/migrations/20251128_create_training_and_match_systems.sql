-- Migration: Create Training and Match Systems
-- Created: 2025-11-28
-- Purpose: Enable squad training and match simulation for mobile game
--
-- This migration creates:
-- - unit_training_sessions table: Tracks active training sessions
-- - match_history table: Stores match results
-- - Adds team_readiness to profiles
-- - Training and match helper functions

-- ============================================================================
-- UPDATE PROFILES: Add team_readiness field
-- ============================================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_readiness INTEGER DEFAULT 50;

-- Create index for team_readiness (used in matchmaking)
CREATE INDEX IF NOT EXISTS idx_profiles_team_readiness ON profiles(team_readiness);

-- ============================================================================
-- CREATE TABLE: unit_training_sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS unit_training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type VARCHAR(50) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completes_at TIMESTAMPTZ NOT NULL,
  energy_cost INTEGER DEFAULT 10,
  completed BOOLEAN DEFAULT FALSE,
  collected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_unit_type CHECK (
    unit_type IN ('offensive-line', 'running-back', 'wide-receiver', 'linebacker', 'defensive-back')
  ),
  CONSTRAINT valid_energy_cost CHECK (energy_cost > 0)
);

-- ============================================================================
-- CREATE TABLE: match_history
-- ============================================================================

CREATE TABLE IF NOT EXISTS match_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Opponent info
  opponent_level INTEGER NOT NULL,
  opponent_team_readiness INTEGER NOT NULL,

  -- Match details
  strategy VARCHAR(50), -- Future: 'aggressive-pass', 'balanced-run', etc.
  user_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  won BOOLEAN NOT NULL,

  -- Rewards
  coins_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  kp_earned INTEGER DEFAULT 0,

  -- Timestamps
  played_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_scores CHECK (user_score >= 0 AND opponent_score >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Training sessions indexes
CREATE INDEX IF NOT EXISTS idx_training_user_id ON unit_training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_training_completes_at ON unit_training_sessions(completes_at) WHERE completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_training_active ON unit_training_sessions(user_id, completed, collected);

-- Match history indexes
CREATE INDEX IF NOT EXISTS idx_match_history_user_id ON match_history(user_id);
CREATE INDEX IF NOT EXISTS idx_match_history_played_at ON match_history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_history_wins ON match_history(user_id, won);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE unit_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;

-- Training sessions policies
CREATE POLICY "Users can view own training sessions"
  ON unit_training_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own training sessions"
  ON unit_training_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own training sessions"
  ON unit_training_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Match history policies
CREATE POLICY "Users can view own match history"
  ON match_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own match history"
  ON match_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: start_training
-- ============================================================================

CREATE OR REPLACE FUNCTION start_training(
  p_user_id UUID,
  p_unit_type VARCHAR(50)
)
RETURNS jsonb AS $$
DECLARE
  user_energy INTEGER;
  training_duration INTERVAL;
  completes_at_time TIMESTAMPTZ;
  new_session_id UUID;
BEGIN
  -- Check user's energy
  SELECT energy INTO user_energy FROM profiles WHERE id = p_user_id;

  IF user_energy IS NULL THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;

  IF user_energy < 10 THEN
    RETURN jsonb_build_object('error', 'Not enough energy');
  END IF;

  -- Training duration: 5 minutes for normal, 1 minute for first-time tutorial
  training_duration := INTERVAL '5 minutes';
  completes_at_time := NOW() + training_duration;

  -- Create training session
  INSERT INTO unit_training_sessions (
    user_id,
    unit_type,
    completes_at,
    energy_cost
  ) VALUES (
    p_user_id,
    p_unit_type,
    completes_at_time,
    10
  ) RETURNING id INTO new_session_id;

  -- Deduct energy
  UPDATE profiles SET energy = energy - 10 WHERE id = p_user_id;

  -- Update mission progress for 'training' type
  PERFORM update_mission_progress(p_user_id, 'training'::mission_type, 1);

  RETURN jsonb_build_object(
    'success', true,
    'session_id', new_session_id,
    'completes_at', completes_at_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: collect_training
-- ============================================================================

CREATE OR REPLACE FUNCTION collect_training(p_session_id UUID)
RETURNS jsonb AS $$
DECLARE
  session RECORD;
  readiness_boost INTEGER := 5;
BEGIN
  -- Get session details
  SELECT * INTO session FROM unit_training_sessions
  WHERE id = p_session_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Training session not found');
  END IF;

  IF session.collected THEN
    RETURN jsonb_build_object('error', 'Already collected');
  END IF;

  IF NOW() < session.completes_at THEN
    RETURN jsonb_build_object('error', 'Training not complete yet');
  END IF;

  -- Mark as completed and collected
  UPDATE unit_training_sessions
  SET completed = true, collected = true
  WHERE id = p_session_id;

  -- Increase team readiness
  UPDATE profiles
  SET team_readiness = team_readiness + readiness_boost
  WHERE id = auth.uid();

  RETURN jsonb_build_object(
    'success', true,
    'readiness_gained', readiness_boost
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: play_match
-- ============================================================================

CREATE OR REPLACE FUNCTION play_match(p_user_id UUID)
RETURNS jsonb AS $$
DECLARE
  user_profile RECORD;
  opponent_level INTEGER;
  opponent_readiness INTEGER;
  user_power NUMERIC;
  opponent_power NUMERIC;
  win_probability NUMERIC;
  user_wins BOOLEAN;
  user_score INTEGER;
  opponent_score INTEGER;
  coins_reward INTEGER;
  xp_reward INTEGER;
  kp_reward INTEGER;
BEGIN
  -- Check user's energy
  SELECT * INTO user_profile FROM profiles WHERE id = p_user_id;

  IF user_profile.energy < 20 THEN
    RETURN jsonb_build_object('error', 'Not enough energy (need 20)');
  END IF;

  -- Generate opponent (user level ±2)
  opponent_level := user_profile.level + (FLOOR(RANDOM() * 5) - 2);
  IF opponent_level < 1 THEN opponent_level := 1; END IF;
  opponent_readiness := opponent_level * 10 + FLOOR(RANDOM() * 20);

  -- Calculate win probability
  user_power := user_profile.team_readiness;
  opponent_power := opponent_readiness;
  win_probability := user_power / (user_power + opponent_power);

  -- Determine winner
  user_wins := RANDOM() < win_probability;

  -- Generate realistic football scores
  IF user_wins THEN
    user_score := 21 + FLOOR(RANDOM() * 15); -- 21-35
    opponent_score := FLOOR(RANDOM() * 21); -- 0-20
    coins_reward := 50;
    xp_reward := 25;
    kp_reward := 10;
  ELSE
    user_score := FLOOR(RANDOM() * 21); -- 0-20
    opponent_score := 21 + FLOOR(RANDOM() * 15); -- 21-35
    coins_reward := 10;
    xp_reward := 5;
    kp_reward := 0;
  END IF;

  -- Save match history
  INSERT INTO match_history (
    user_id,
    opponent_level,
    opponent_team_readiness,
    user_score,
    opponent_score,
    won,
    coins_earned,
    xp_earned,
    kp_earned
  ) VALUES (
    p_user_id,
    opponent_level,
    opponent_readiness,
    user_score,
    opponent_score,
    user_wins,
    coins_reward,
    xp_reward,
    kp_reward
  );

  -- Award rewards and deduct energy
  UPDATE profiles SET
    coins = coins + coins_reward,
    xp = xp + xp_reward,
    knowledge_points = knowledge_points + kp_reward,
    energy = energy - 20
  WHERE id = p_user_id;

  -- Update mission progress for 'match' type (only if won)
  IF user_wins THEN
    PERFORM update_mission_progress(p_user_id, 'match'::mission_type, 1);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'won', user_wins,
    'user_score', user_score,
    'opponent_score', opponent_score,
    'opponent_level', opponent_level,
    'coins_earned', coins_reward,
    'xp_earned', xp_reward,
    'kp_earned', kp_reward
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: check_completed_training (Background job helper)
-- ============================================================================

CREATE OR REPLACE FUNCTION check_completed_training()
RETURNS void AS $$
BEGIN
  -- Mark completed training sessions
  UPDATE unit_training_sessions
  SET completed = true
  WHERE completed = false
    AND completes_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE ON unit_training_sessions TO authenticated;
GRANT SELECT, INSERT ON match_history TO authenticated;
GRANT EXECUTE ON FUNCTION start_training(UUID, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION collect_training(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION play_match(UUID) TO authenticated;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Training Flow:
-- 1. User taps "Train" on SquadScreen → calls start_training(user_id, unit_type)
-- 2. Function deducts 10 energy, creates session with completes_at = NOW() + 5 min
-- 3. UI shows countdown timer
-- 4. After 5 minutes, user taps "Collect" → calls collect_training(session_id)
-- 5. Function increases team_readiness by 5 points

-- Match Flow:
-- 1. User taps "Play Match" → calls play_match(user_id)
-- 2. Function generates opponent, simulates match, determines winner
-- 3. Function awards rewards (50 coins for win, 10 for loss)
-- 4. Function deducts 20 energy
-- 5. Returns match results to display on MatchScreen

-- Team Readiness:
-- - Starts at 50 (default for new users)
-- - Increases by 5 per completed training session
-- - Higher readiness = better win probability in matches
-- - Win probability = user_readiness / (user_readiness + opponent_readiness)
