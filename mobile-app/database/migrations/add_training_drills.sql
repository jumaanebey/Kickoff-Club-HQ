-- Training Drills System (FarmVille-style crops for football)
-- This is the CORE mechanic that makes it feel like FarmVille

-- Training drill templates (like crop types)
CREATE TABLE drill_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  drill_type TEXT NOT NULL CHECK (drill_type IN ('passing', 'shooting', 'defense', 'fitness', 'tactics')),
  description TEXT,
  icon TEXT,

  -- Timer mechanics (like crop growth times)
  duration_minutes INTEGER NOT NULL, -- 15, 60, 240, 1440 (ranges from 15min to 1 day)

  -- Energy cost to plant
  energy_cost INTEGER DEFAULT 5,

  -- Rewards when harvested
  skill_points INTEGER DEFAULT 10,
  coins INTEGER DEFAULT 20,
  xp INTEGER DEFAULT 5,

  -- Unlock requirements
  level_required INTEGER DEFAULT 1,

  -- Visuals
  image_url TEXT,
  animation_stages JSONB, -- ['planting', 'training', 'ready', 'withering']

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's planted drills (like planted crops)
CREATE TABLE training_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  drill_template_id UUID REFERENCES drill_templates(id),

  -- Position on field
  field_slot INTEGER NOT NULL, -- 0-11 (3x4 grid)

  -- Timer tracking
  planted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ready_at TIMESTAMPTZ NOT NULL, -- planted_at + duration
  wither_at TIMESTAMPTZ NOT NULL, -- ready_at + (duration * 0.5) - 50% grace period
  harvested_at TIMESTAMPTZ,

  -- State tracking
  state TEXT GENERATED ALWAYS AS (
    CASE
      WHEN harvested_at IS NOT NULL THEN 'harvested'
      WHEN NOW() >= wither_at THEN 'withered'
      WHEN NOW() >= ready_at THEN 'ready'
      ELSE 'training'
    END
  ) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent multiple drills in same slot
  UNIQUE(user_id, field_slot, harvested_at)
    WHERE harvested_at IS NULL
);

-- Player cards (like animals - passive producers)
CREATE TABLE player_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('striker', 'midfielder', 'defender', 'goalkeeper')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),

  -- Production mechanics
  production_type TEXT DEFAULT 'skill_points',
  production_rate INTEGER DEFAULT 5, -- per hour
  production_max INTEGER DEFAULT 50, -- storage capacity
  feed_cost INTEGER DEFAULT 10, -- coins to activate
  feed_duration_hours INTEGER DEFAULT 4, -- how long they produce

  -- Stats
  overall_rating INTEGER DEFAULT 60,
  image_url TEXT,

  -- Unlock
  level_required INTEGER DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's player collection
CREATE TABLE user_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  player_card_id UUID REFERENCES player_cards(id),

  -- Placement
  field_slot INTEGER, -- NULL if in storage

  -- Production tracking
  fed_at TIMESTAMPTZ,
  production_expires_at TIMESTAMPTZ,
  production_current INTEGER DEFAULT 0,
  last_collected TIMESTAMPTZ DEFAULT NOW(),

  -- State
  is_producing BOOLEAN GENERATED ALWAYS AS (
    fed_at IS NOT NULL AND NOW() < production_expires_at
  ) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, field_slot)
    WHERE field_slot IS NOT NULL
);

-- RLS Policies
ALTER TABLE training_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drills"
  ON training_drills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drills"
  ON training_drills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drills"
  ON training_drills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own players"
  ON user_players FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own players"
  ON user_players FOR ALL
  USING (auth.uid() = user_id);

-- Function to plant a drill (with validation)
CREATE OR REPLACE FUNCTION plant_drill(
  p_user_id UUID,
  p_drill_template_id UUID,
  p_field_slot INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_template drill_templates;
  v_user_energy INTEGER;
  v_drill_id UUID;
  v_ready_at TIMESTAMPTZ;
  v_wither_at TIMESTAMPTZ;
BEGIN
  -- Get drill template
  SELECT * INTO v_template
  FROM drill_templates
  WHERE id = p_drill_template_id;

  IF v_template IS NULL THEN
    RAISE EXCEPTION 'Invalid drill template';
  END IF;

  -- Check user has enough energy
  SELECT energy INTO v_user_energy
  FROM profiles
  WHERE id = p_user_id;

  IF v_user_energy < v_template.energy_cost THEN
    RETURN json_build_object('error', 'insufficient_energy');
  END IF;

  -- Check slot is empty
  IF EXISTS (
    SELECT 1 FROM training_drills
    WHERE user_id = p_user_id
      AND field_slot = p_field_slot
      AND harvested_at IS NULL
  ) THEN
    RETURN json_build_object('error', 'slot_occupied');
  END IF;

  -- Calculate timers
  v_ready_at := NOW() + (v_template.duration_minutes || ' minutes')::INTERVAL;
  v_wither_at := v_ready_at + (v_template.duration_minutes * 0.5 || ' minutes')::INTERVAL;

  -- Plant the drill
  INSERT INTO training_drills (
    user_id,
    drill_template_id,
    field_slot,
    ready_at,
    wither_at
  ) VALUES (
    p_user_id,
    p_drill_template_id,
    p_field_slot,
    v_ready_at,
    v_wither_at
  ) RETURNING id INTO v_drill_id;

  -- Deduct energy
  UPDATE profiles
  SET energy = energy - v_template.energy_cost
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'drill_id', v_drill_id,
    'ready_at', v_ready_at,
    'wither_at', v_wither_at
  );
END;
$$;

-- Function to harvest a drill
CREATE OR REPLACE FUNCTION harvest_drill(
  p_drill_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_drill training_drills;
  v_template drill_templates;
  v_state TEXT;
  v_rewards JSON;
  v_multiplier NUMERIC;
BEGIN
  -- Lock the drill row
  SELECT * INTO v_drill
  FROM training_drills
  WHERE id = p_drill_id
  FOR UPDATE;

  IF v_drill IS NULL THEN
    RETURN json_build_object('error', 'drill_not_found');
  END IF;

  -- Check if already harvested
  IF v_drill.harvested_at IS NOT NULL THEN
    RETURN json_build_object('error', 'already_harvested');
  END IF;

  -- Check state
  IF NOW() < v_drill.ready_at THEN
    RETURN json_build_object('error', 'not_ready');
  END IF;

  IF NOW() >= v_drill.wither_at THEN
    -- Drill withered - no rewards
    UPDATE training_drills
    SET harvested_at = NOW()
    WHERE id = p_drill_id;

    RETURN json_build_object(
      'success', true,
      'withered', true,
      'coins', 0,
      'xp', 0,
      'skill_points', 0
    );
  END IF;

  -- Get template for rewards
  SELECT * INTO v_template
  FROM drill_templates
  WHERE id = v_drill.drill_template_id;

  -- Calculate rewards (reduced if close to withering)
  v_multiplier := 1.0;
  IF NOW() > v_drill.ready_at + (v_template.duration_minutes * 0.3 || ' minutes')::INTERVAL THEN
    -- Reward decay in final 30% before withering
    v_multiplier := 0.7;
  END IF;

  -- Apply rewards
  UPDATE profiles
  SET coins = coins + (v_template.coins * v_multiplier)::INTEGER,
      xp = xp + (v_template.xp * v_multiplier)::INTEGER,
      knowledge_points = knowledge_points + (v_template.skill_points * v_multiplier)::INTEGER
  WHERE id = v_drill.user_id;

  -- Mark as harvested
  UPDATE training_drills
  SET harvested_at = NOW()
  WHERE id = p_drill_id;

  RETURN json_build_object(
    'success', true,
    'coins', (v_template.coins * v_multiplier)::INTEGER,
    'xp', (v_template.xp * v_multiplier)::INTEGER,
    'skill_points', (v_template.skill_points * v_multiplier)::INTEGER,
    'multiplier', v_multiplier
  );
END;
$$;

-- Insert starter drill templates
INSERT INTO drill_templates (name, drill_type, duration_minutes, energy_cost, skill_points, coins, xp, level_required, icon, description) VALUES
-- Quick drills (15 minutes) - for frequent check-ins
('Quick Pass', 'passing', 15, 3, 5, 10, 3, 1, 'football', 'Practice basic passing - 15 minutes'),
('Speed Sprint', 'fitness', 15, 3, 5, 10, 3, 1, 'flash', 'Quick cardio session - 15 minutes'),

-- Short drills (1 hour) - perfect for lunch breaks
('Target Shooting', 'shooting', 60, 5, 15, 30, 8, 1, 'flame', 'Shooting accuracy drills - 1 hour'),
('Defensive Stance', 'defense', 60, 5, 15, 30, 8, 2, 'shield', 'Defensive positioning - 1 hour'),

-- Medium drills (4 hours) - work day / sleep cycles
('Formation Practice', 'tactics', 240, 8, 40, 80, 20, 3, 'map', 'Team formations and tactics - 4 hours'),
('Endurance Run', 'fitness', 240, 8, 40, 80, 20, 3, 'bicycle', 'Build stamina - 4 hours'),

-- Long drills (8 hours) - overnight
('Advanced Playbook', 'tactics', 480, 12, 80, 160, 40, 5, 'book', 'Study complex plays - 8 hours'),
('Pro Shooting Clinic', 'shooting', 480, 12, 80, 160, 40, 5, 'trophy', 'Master finishing - 8 hours'),

-- Epic drills (24 hours) - weekend commitment
('Championship Camp', 'tactics', 1440, 20, 250, 500, 120, 10, 'ribbon', 'Elite training camp - 24 hours'),
('Full Squad Practice', 'tactics', 1440, 20, 250, 500, 120, 10, 'people', 'Comprehensive team training - 24 hours');

-- Insert starter player cards
INSERT INTO player_cards (name, position, rarity, production_rate, production_max, feed_cost, overall_rating, level_required) VALUES
('Rookie Forward', 'striker', 'common', 5, 30, 10, 65, 1),
('Young Midfielder', 'midfielder', 'common', 4, 25, 8, 62, 1),
('Amateur Defender', 'defender', 'common', 3, 20, 6, 60, 1),
('Backup Keeper', 'goalkeeper', 'common', 3, 20, 6, 58, 1),
('Rising Star', 'striker', 'rare', 10, 60, 25, 75, 5),
('Playmaker', 'midfielder', 'rare', 8, 50, 20, 73, 5),
('Veteran Legend', 'striker', 'epic', 20, 150, 60, 88, 10),
('Icon Midfielder', 'midfielder', 'legendary', 40, 300, 120, 95, 15);
