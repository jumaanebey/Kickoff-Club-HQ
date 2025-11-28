-- Daily Missions and Challenges System

-- Mission templates (what missions exist)
CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('training', 'match', 'login', 'upgrade', 'collect')),

  -- Requirements
  requirement_count INTEGER DEFAULT 1, -- how many times to complete

  -- Rewards
  coins_reward INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 10,
  knowledge_points_reward INTEGER DEFAULT 0,

  -- Availability
  is_daily BOOLEAN DEFAULT true,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's active missions
CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_template_id UUID REFERENCES mission_templates(id),

  -- Progress
  current_count INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  claimed BOOLEAN DEFAULT false,

  -- Timing
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default mission templates
INSERT INTO mission_templates (name, description, mission_type, requirement_count, coins_reward, xp_reward, knowledge_points_reward, is_daily, rarity) VALUES
-- Training missions
('Complete Training Sessions', 'Complete 3 training sessions', 'training', 3, 50, 20, 5, true, 'common'),
('Training Marathon', 'Complete 5 training sessions', 'training', 5, 100, 40, 15, true, 'rare'),
('Elite Training', 'Complete 10 training sessions', 'training', 10, 250, 100, 50, true, 'epic'),

-- Match missions
('First Victory', 'Win 1 match', 'match', 1, 75, 30, 10, true, 'common'),
('Winning Streak', 'Win 3 matches', 'match', 3, 200, 80, 30, true, 'rare'),
('Dominate the Field', 'Win 5 matches', 'match', 5, 500, 200, 75, true, 'epic'),

-- Login missions
('Daily Login', 'Log in to the app', 'login', 1, 25, 10, 0, true, 'common'),

-- Collect missions
('Resource Collector', 'Collect from 2 buildings', 'collect', 2, 40, 15, 5, true, 'common'),

-- Upgrade missions
('Building Upgrade', 'Upgrade any building', 'upgrade', 1, 100, 50, 20, true, 'rare')
ON CONFLICT DO NOTHING;

-- Function to assign daily missions to a user
CREATE OR REPLACE FUNCTION assign_daily_missions(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_missions_assigned INTEGER := 0;
  v_template RECORD;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Calculate expiration (24 hours from now)
  v_expires_at := NOW() + INTERVAL '24 hours';

  -- Clear old incomplete missions
  DELETE FROM user_missions
  WHERE user_id = p_user_id
    AND expires_at < NOW()
    AND completed = false;

  -- Check if user already has active missions for today
  IF EXISTS (
    SELECT 1 FROM user_missions
    WHERE user_id = p_user_id
      AND expires_at > NOW()
      AND is_daily = true
  ) THEN
    RETURN json_build_object('message', 'Daily missions already assigned');
  END IF;

  -- Assign 3 random common missions, 1 rare, and maybe 1 epic (20% chance)

  -- Common missions (3)
  FOR v_template IN
    SELECT * FROM mission_templates
    WHERE is_daily = true AND rarity = 'common'
    ORDER BY RANDOM()
    LIMIT 3
  LOOP
    INSERT INTO user_missions (user_id, mission_template_id, expires_at)
    VALUES (p_user_id, v_template.id, v_expires_at);
    v_missions_assigned := v_missions_assigned + 1;
  END LOOP;

  -- Rare mission (1)
  FOR v_template IN
    SELECT * FROM mission_templates
    WHERE is_daily = true AND rarity = 'rare'
    ORDER BY RANDOM()
    LIMIT 1
  LOOP
    INSERT INTO user_missions (user_id, mission_template_id, expires_at)
    VALUES (p_user_id, v_template.id, v_expires_at);
    v_missions_assigned := v_missions_assigned + 1;
  END LOOP;

  -- Epic mission (20% chance)
  IF RANDOM() < 0.2 THEN
    FOR v_template IN
      SELECT * FROM mission_templates
      WHERE is_daily = true AND rarity = 'epic'
      ORDER BY RANDOM()
      LIMIT 1
    LOOP
      INSERT INTO user_missions (user_id, mission_template_id, expires_at)
      VALUES (p_user_id, v_template.id, v_expires_at);
      v_missions_assigned := v_missions_assigned + 1;
    END LOOP;
  END IF;

  RETURN json_build_object(
    'success', true,
    'missions_assigned', v_missions_assigned
  );
END;
$$;

-- Function to update mission progress
CREATE OR REPLACE FUNCTION update_mission_progress(
  p_user_id UUID,
  p_mission_type TEXT,
  p_increment INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission RECORD;
BEGIN
  -- Update all active missions of this type
  FOR v_mission IN
    SELECT um.id, um.current_count, mt.requirement_count
    FROM user_missions um
    JOIN mission_templates mt ON um.mission_template_id = mt.id
    WHERE um.user_id = p_user_id
      AND mt.mission_type = p_mission_type
      AND um.completed = false
      AND um.expires_at > NOW()
  LOOP
    -- Increment progress
    UPDATE user_missions
    SET current_count = LEAST(current_count + p_increment, v_mission.requirement_count),
        completed = (current_count + p_increment) >= v_mission.requirement_count,
        completed_at = CASE
          WHEN (current_count + p_increment) >= v_mission.requirement_count THEN NOW()
          ELSE completed_at
        END
    WHERE id = v_mission.id;
  END LOOP;
END;
$$;

-- Function to claim mission rewards
CREATE OR REPLACE FUNCTION claim_mission_reward(p_mission_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission user_missions;
  v_template mission_templates;
BEGIN
  -- Get mission
  SELECT * INTO v_mission FROM user_missions WHERE id = p_mission_id FOR UPDATE;

  IF v_mission IS NULL THEN
    RETURN json_build_object('error', 'mission_not_found');
  END IF;

  IF NOT v_mission.completed THEN
    RETURN json_build_object('error', 'mission_not_complete');
  END IF;

  IF v_mission.claimed THEN
    RETURN json_build_object('error', 'already_claimed');
  END IF;

  -- Get template for rewards
  SELECT * INTO v_template FROM mission_templates WHERE id = v_mission.mission_template_id;

  -- Award rewards
  UPDATE profiles
  SET coins = coins + v_template.coins_reward,
      xp = xp + v_template.xp_reward,
      knowledge_points = knowledge_points + v_template.knowledge_points_reward
  WHERE id = v_mission.user_id;

  -- Mark as claimed
  UPDATE user_missions
  SET claimed = true,
      claimed_at = NOW()
  WHERE id = p_mission_id;

  RETURN json_build_object(
    'success', true,
    'coins_earned', v_template.coins_reward,
    'xp_earned', v_template.xp_reward,
    'kp_earned', v_template.knowledge_points_reward
  );
END;
$$;

-- RLS Policies
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own missions"
  ON user_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON user_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- Automatically assign daily missions on login (this would be called from app)
-- Users can call assign_daily_missions() when they open the app each day
