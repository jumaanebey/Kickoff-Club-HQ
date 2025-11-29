-- Complete Database Migration for Mobile App Features
-- Run this in Supabase SQL Editor

-- 1. Add Knowledge Points & Energy to Profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS knowledge_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

-- 2. Create User Buildings Table
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

-- 3. Create Mission Templates Table
CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  coin_reward INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 100,
  target_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create User Missions Table
CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES mission_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  coin_reward INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 100,
  target_value INTEGER NOT NULL,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 5. Create Knowledge Point Transactions Table
CREATE TABLE IF NOT EXISTS knowledge_point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS on all tables
ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_point_transactions ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies (in case they exist)
DROP POLICY IF EXISTS "Users can view their own buildings" ON user_buildings;
DROP POLICY IF EXISTS "Users can insert their own buildings" ON user_buildings;
DROP POLICY IF EXISTS "Users can update their own buildings" ON user_buildings;
DROP POLICY IF EXISTS "Anyone can view mission templates" ON mission_templates;
DROP POLICY IF EXISTS "Users can view their own missions" ON user_missions;
DROP POLICY IF EXISTS "Users can insert their own missions" ON user_missions;
DROP POLICY IF EXISTS "Users can update their own missions" ON user_missions;
DROP POLICY IF EXISTS "Users can view their own KP transactions" ON knowledge_point_transactions;
DROP POLICY IF EXISTS "Users can insert their own KP transactions" ON knowledge_point_transactions;

-- 8. Create RLS Policies
CREATE POLICY "Users can view their own buildings"
  ON user_buildings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buildings"
  ON user_buildings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buildings"
  ON user_buildings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view mission templates"
  ON mission_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own missions"
  ON user_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own missions"
  ON user_missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own missions"
  ON user_missions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own KP transactions"
  ON knowledge_point_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KP transactions"
  ON knowledge_point_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. Create assign_daily_missions function
CREATE OR REPLACE FUNCTION assign_daily_missions(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission_count INTEGER;
  v_common_missions UUID[];
  v_rare_missions UUID[];
  v_result JSON;
BEGIN
  DELETE FROM user_missions
  WHERE user_id = p_user_id
    AND expires_at < NOW();

  SELECT COUNT(*) INTO v_mission_count
  FROM user_missions
  WHERE user_id = p_user_id
    AND NOT claimed
    AND expires_at > NOW();

  IF v_mission_count >= 5 THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Already have active missions'
    );
  END IF;

  SELECT ARRAY_AGG(id) INTO v_common_missions
  FROM mission_templates
  WHERE rarity = 'common'
  ORDER BY RANDOM()
  LIMIT 3;

  SELECT ARRAY_AGG(id) INTO v_rare_missions
  FROM mission_templates
  WHERE rarity = 'rare'
  ORDER BY RANDOM()
  LIMIT 1;

  INSERT INTO user_missions (user_id, template_id, title, description, mission_type, rarity, coin_reward, xp_reward, target_value)
  SELECT
    p_user_id,
    t.id,
    t.title,
    t.description,
    t.mission_type,
    t.rarity,
    t.coin_reward,
    t.xp_reward,
    t.target_value
  FROM mission_templates t
  WHERE t.id = ANY(v_common_missions || v_rare_missions);

  RETURN json_build_object(
    'success', true,
    'missions_assigned', array_length(v_common_missions || v_rare_missions, 1)
  );
END;
$$;

-- 10. Create claim_mission_reward function
CREATE OR REPLACE FUNCTION claim_mission_reward(p_mission_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_mission RECORD;
  v_user_id UUID;
BEGIN
  SELECT * INTO v_mission
  FROM user_missions
  WHERE id = p_mission_id;

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Mission not found');
  END IF;

  IF NOT v_mission.completed THEN
    RETURN json_build_object('error', 'Mission not completed');
  END IF;

  IF v_mission.claimed THEN
    RETURN json_build_object('error', 'Reward already claimed');
  END IF;

  v_user_id := v_mission.user_id;

  UPDATE profiles
  SET
    coins = coins + v_mission.coin_reward,
    xp = xp + v_mission.xp_reward
  WHERE id = v_user_id;

  UPDATE user_missions
  SET claimed = TRUE
  WHERE id = p_mission_id;

  RETURN json_build_object(
    'success', true,
    'coins_earned', v_mission.coin_reward,
    'xp_earned', v_mission.xp_reward
  );
END;
$$;

-- 11. Add some sample mission templates
INSERT INTO mission_templates (title, description, mission_type, rarity, coin_reward, xp_reward, target_value)
VALUES
  ('Complete 3 Lessons', 'Watch and complete 3 video lessons', 'lesson_complete', 'common', 50, 100, 3),
  ('Train Your Squad', 'Complete 5 training sessions', 'training_complete', 'common', 75, 150, 5),
  ('Win a Match', 'Win 1 match simulation', 'match_win', 'rare', 150, 300, 1),
  ('Upgrade Buildings', 'Upgrade any 2 buildings', 'building_upgrade', 'common', 100, 200, 2),
  ('Earn Knowledge Points', 'Earn 50 knowledge points', 'knowledge_earn', 'rare', 200, 400, 50)
ON CONFLICT DO NOTHING;

-- 12. Initialize existing users with default buildings
INSERT INTO user_buildings (user_id, building_type, level, position_x, position_y, unlocked)
SELECT
  p.id,
  building,
  1,
  ROW_NUMBER() OVER (PARTITION BY p.id) * 100,
  100,
  true
FROM profiles p
CROSS JOIN (
  SELECT unnest(ARRAY['film-room', 'practice-field', 'stadium']) as building
) buildings
ON CONFLICT (user_id, building_type) DO NOTHING;

-- Success message
SELECT 'Migration completed successfully!' as message;
