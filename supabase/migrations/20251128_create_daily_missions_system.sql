-- Migration: Create Daily Missions System
-- Created: 2025-11-28
-- Purpose: Enable daily missions/tasks for mobile app gamification
--
-- This migration creates:
-- - mission_templates table: Predefined mission types
-- - user_missions table: User-specific mission progress
-- - Functions: assign_daily_missions, update_mission_progress, claim_mission_reward

-- ============================================================================
-- CREATE TYPES
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE mission_type AS ENUM ('training', 'match', 'login', 'upgrade', 'collect');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE mission_rarity AS ENUM ('common', 'rare', 'epic');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- CREATE TABLE: mission_templates
-- ============================================================================

CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  mission_type mission_type NOT NULL,
  requirement_count INTEGER NOT NULL DEFAULT 1,
  coins_reward INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  knowledge_points_reward INTEGER NOT NULL DEFAULT 0,
  is_daily BOOLEAN DEFAULT TRUE,
  rarity mission_rarity DEFAULT 'common',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATE TABLE: user_missions
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_template_id UUID NOT NULL REFERENCES mission_templates(id) ON DELETE CASCADE,
  current_count INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_current_count CHECK (current_count >= 0),
  CONSTRAINT unique_user_daily_mission UNIQUE (user_id, mission_template_id, assigned_at::date)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_mission_templates_type ON mission_templates(mission_type);
CREATE INDEX IF NOT EXISTS idx_mission_templates_daily ON mission_templates(is_daily);
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_expires_at ON user_missions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_missions_completed ON user_missions(completed, claimed);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

-- Anyone can view mission templates
CREATE POLICY "Anyone can view mission templates"
  ON mission_templates FOR SELECT
  USING (true);

-- Users can view their own missions
CREATE POLICY "Users can view own missions"
  ON user_missions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: assign_daily_missions
-- ============================================================================

CREATE OR REPLACE FUNCTION assign_daily_missions(p_user_id UUID)
RETURNS void AS $$
DECLARE
  mission_template RECORD;
  today_start TIMESTAMPTZ;
  today_end TIMESTAMPTZ;
  existing_count INTEGER;
BEGIN
  -- Set timezone boundaries for today
  today_start := date_trunc('day', NOW());
  today_end := today_start + INTERVAL '1 day';

  -- Check if user already has missions for today
  SELECT COUNT(*) INTO existing_count
  FROM user_missions
  WHERE user_id = p_user_id
    AND assigned_at >= today_start
    AND assigned_at < today_end;

  -- If missions already assigned today, skip
  IF existing_count > 0 THEN
    RETURN;
  END IF;

  -- Assign 3 random daily missions
  FOR mission_template IN
    SELECT * FROM mission_templates
    WHERE is_daily = true
    ORDER BY RANDOM()
    LIMIT 3
  LOOP
    INSERT INTO user_missions (
      user_id,
      mission_template_id,
      current_count,
      expires_at
    ) VALUES (
      p_user_id,
      mission_template.id,
      0,
      today_end
    );
  END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: update_mission_progress
-- ============================================================================

CREATE OR REPLACE FUNCTION update_mission_progress(
  p_user_id UUID,
  p_mission_type mission_type,
  p_increment INTEGER DEFAULT 1
)
RETURNS void AS $$
DECLARE
  mission RECORD;
  template RECORD;
BEGIN
  -- Find active missions of this type for the user
  FOR mission IN
    SELECT um.*, mt.requirement_count
    FROM user_missions um
    JOIN mission_templates mt ON um.mission_template_id = mt.id
    WHERE um.user_id = p_user_id
      AND mt.mission_type = p_mission_type
      AND um.completed = false
      AND um.expires_at > NOW()
  LOOP
    -- Update progress
    UPDATE user_missions
    SET
      current_count = LEAST(current_count + p_increment, mission.requirement_count),
      completed = (current_count + p_increment >= mission.requirement_count),
      completed_at = CASE
        WHEN (current_count + p_increment >= mission.requirement_count) THEN NOW()
        ELSE completed_at
      END
    WHERE id = mission.id;
  END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: claim_mission_reward
-- ============================================================================

CREATE OR REPLACE FUNCTION claim_mission_reward(p_mission_id UUID)
RETURNS jsonb AS $$
DECLARE
  mission RECORD;
  template RECORD;
  result jsonb;
BEGIN
  -- Get mission details
  SELECT um.*, mt.*
  INTO mission
  FROM user_missions um
  JOIN mission_templates mt ON um.mission_template_id = mt.id
  WHERE um.id = p_mission_id
    AND um.user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Mission not found');
  END IF;

  -- Check if mission is completed
  IF NOT mission.completed THEN
    RETURN jsonb_build_object('error', 'Mission not completed yet');
  END IF;

  -- Check if already claimed
  IF mission.claimed THEN
    RETURN jsonb_build_object('error', 'Reward already claimed');
  END IF;

  -- Mark as claimed
  UPDATE user_missions
  SET claimed = true, claimed_at = NOW()
  WHERE id = p_mission_id;

  -- Award rewards to user
  UPDATE profiles
  SET
    coins = coins + mission.coins_reward,
    xp = xp + mission.xp_reward,
    knowledge_points = knowledge_points + mission.knowledge_points_reward
  WHERE id = auth.uid();

  -- Return reward details
  result := jsonb_build_object(
    'coins_earned', mission.coins_reward,
    'xp_earned', mission.xp_reward,
    'kp_earned', mission.knowledge_points_reward
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON mission_templates TO anon, authenticated;
GRANT SELECT ON user_missions TO authenticated;
GRANT EXECUTE ON FUNCTION assign_daily_missions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_mission_progress(UUID, mission_type, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_mission_reward(UUID) TO authenticated;

-- ============================================================================
-- SEED DATA: Mission Templates
-- ============================================================================

-- Common Daily Missions
INSERT INTO mission_templates (name, description, mission_type, requirement_count, coins_reward, xp_reward, knowledge_points_reward, is_daily, rarity) VALUES
  ('Daily Training', 'Complete 3 training sessions', 'training', 3, 25, 10, 5, true, 'common'),
  ('Play a Match', 'Win 1 match today', 'match', 1, 30, 15, 10, true, 'common'),
  ('Daily Check-In', 'Log in today', 'login', 1, 15, 5, 0, true, 'common'),
  ('Building Upgrade', 'Upgrade any building', 'upgrade', 1, 20, 10, 5, true, 'common'),
  ('Resource Collector', 'Collect production from 2 buildings', 'collect', 2, 20, 8, 3, true, 'common')
ON CONFLICT DO NOTHING;

-- Rare Daily Missions
INSERT INTO mission_templates (name, description, mission_type, requirement_count, coins_reward, xp_reward, knowledge_points_reward, is_daily, rarity) VALUES
  ('Intensive Training', 'Complete 5 training sessions', 'training', 5, 50, 25, 15, true, 'rare'),
  ('Win Streak', 'Win 2 matches today', 'match', 2, 60, 30, 20, true, 'rare'),
  ('Master Builder', 'Upgrade 2 buildings', 'upgrade', 2, 45, 20, 10, true, 'rare')
ON CONFLICT DO NOTHING;

-- Epic Daily Missions
INSERT INTO mission_templates (name, description, mission_type, requirement_count, coins_reward, xp_reward, knowledge_points_reward, is_daily, rarity) VALUES
  ('Training Warrior', 'Complete 10 training sessions', 'training', 10, 100, 50, 30, true, 'epic'),
  ('Domination', 'Win 3 matches today', 'match', 3, 120, 60, 40, true, 'epic'),
  ('Empire Builder', 'Upgrade 3 buildings', 'upgrade', 3, 80, 40, 25, true, 'epic')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Usage Flow:
-- 1. App calls assign_daily_missions(user_id) on login - automatically assigns 3 random daily missions
-- 2. As user performs actions, call update_mission_progress(user_id, mission_type, 1)
-- 3. When mission is completed, user can claim rewards via claim_mission_reward(mission_id)
-- 4. Missions expire at end of day (24 hours from assignment)
--
-- Mission Types:
--   'training' - Complete training sessions in Practice Field
--   'match' - Play and win matches in Squad mode
--   'login' - Daily login bonus
--   'upgrade' - Upgrade buildings
--   'collect' - Collect production from buildings
