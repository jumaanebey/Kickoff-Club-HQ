-- HQ Buildings and Practice Field Drills Migration
-- Run this in Supabase SQL Editor after the base schema

-- ============================================
-- BUILDING SYSTEM
-- ============================================

-- Building types (static configuration)
CREATE TABLE building_types (
  id TEXT PRIMARY KEY, -- 'film-room', 'stadium', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Ionicon name
  base_cost INTEGER NOT NULL DEFAULT 100,
  base_production_rate INTEGER DEFAULT 0, -- coins/hour or kp/hour
  production_type TEXT CHECK (production_type IN ('coins', 'kp', 'none')),
  unlock_level INTEGER DEFAULT 1,
  max_level INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Building level configurations (upgrade stats per level)
CREATE TABLE building_level_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_type TEXT REFERENCES building_types(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  upgrade_cost INTEGER NOT NULL,
  production_rate INTEGER DEFAULT 0, -- production per hour at this level
  production_cap INTEGER DEFAULT 0, -- max stored production
  build_time_seconds INTEGER DEFAULT 0, -- time to upgrade to this level
  UNIQUE(building_type, level)
);

-- User's buildings (instances)
CREATE TABLE user_buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_type TEXT REFERENCES building_types(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 0, -- 0 = not built yet, 1+ = built and upgraded
  production_current INTEGER DEFAULT 0, -- current stored production
  production_last_collected TIMESTAMPTZ DEFAULT NOW(),
  is_upgrading BOOLEAN DEFAULT FALSE,
  upgrade_complete_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, building_type)
);

-- ============================================
-- PRACTICE FIELD DRILLS SYSTEM (FarmVille-style)
-- ============================================

-- Drill types (static configuration - like crop types)
CREATE TABLE drill_types (
  id TEXT PRIMARY KEY, -- 'passing-drill', 'defense-drill', etc.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Ionicon name
  coin_cost INTEGER NOT NULL DEFAULT 50, -- cost to plant
  growth_time_minutes INTEGER NOT NULL DEFAULT 60, -- time to mature
  coin_reward INTEGER DEFAULT 100, -- reward when collected
  xp_reward INTEGER DEFAULT 10,
  kp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlock_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's active drills (like planted crops)
CREATE TABLE user_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  drill_type TEXT REFERENCES drill_types(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL, -- which field slot (0-11 for a 3x4 grid)
  planted_at TIMESTAMPTZ DEFAULT NOW(),
  ready_at TIMESTAMPTZ NOT NULL, -- when drill is ready to collect
  is_ready BOOLEAN GENERATED ALWAYS AS (ready_at <= NOW()) STORED,
  collected_at TIMESTAMPTZ, -- null = not collected yet
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slot_number), -- one drill per slot
  CHECK (slot_number >= 0 AND slot_number < 12) -- 12 slots (3x4 grid)
);

-- ============================================
-- ADD MISSING PROFILE COLUMNS
-- ============================================

-- Add knowledge points and energy to profiles if not exists
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS knowledge_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- SEED DATA - BUILDING TYPES
-- ============================================

INSERT INTO building_types (id, name, description, icon, base_cost, production_type, base_production_rate, max_level) VALUES
  ('film-room', 'Film Room', 'Watch lessons and produce Knowledge Points', 'film', 0, 'kp', 10, 10),
  ('practice-field', 'Practice Field', 'Plant drills to earn coins and XP', 'football', 500, 'none', 0, 5),
  ('stadium', 'Stadium', 'Boost prediction accuracy and rewards', 'trophy', 1000, 'none', 0, 10),
  ('weight-room', 'Weight Room', 'Generate bonus coins over time', 'barbell', 750, 'coins', 20, 10),
  ('headquarters', 'Headquarters', 'Central command center', 'business', 0, 'none', 0, 5),
  ('locker-room', 'Locker Room', 'Store achievements and unlock bonuses', 'shirt', 1500, 'none', 0, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  base_cost = EXCLUDED.base_cost,
  production_type = EXCLUDED.production_type,
  base_production_rate = EXCLUDED.base_production_rate,
  max_level = EXCLUDED.max_level;

-- ============================================
-- SEED DATA - BUILDING LEVEL CONFIGS
-- ============================================

-- Film Room levels (KP production)
INSERT INTO building_level_configs (building_type, level, upgrade_cost, production_rate, production_cap, build_time_seconds) VALUES
  ('film-room', 1, 0, 10, 100, 0),
  ('film-room', 2, 250, 15, 150, 300),
  ('film-room', 3, 500, 25, 250, 600),
  ('film-room', 4, 1000, 40, 400, 1200),
  ('film-room', 5, 2000, 60, 600, 2400),
  ('film-room', 6, 4000, 90, 900, 3600),
  ('film-room', 7, 8000, 130, 1300, 5400),
  ('film-room', 8, 16000, 180, 1800, 7200),
  ('film-room', 9, 32000, 240, 2400, 10800),
  ('film-room', 10, 64000, 320, 3200, 14400)
ON CONFLICT (building_type, level) DO UPDATE SET
  upgrade_cost = EXCLUDED.upgrade_cost,
  production_rate = EXCLUDED.production_rate,
  production_cap = EXCLUDED.production_cap,
  build_time_seconds = EXCLUDED.build_time_seconds;

-- Weight Room levels (Coin production)
INSERT INTO building_level_configs (building_type, level, upgrade_cost, production_rate, production_cap, build_time_seconds) VALUES
  ('weight-room', 1, 750, 20, 200, 600),
  ('weight-room', 2, 1500, 30, 300, 900),
  ('weight-room', 3, 3000, 50, 500, 1800),
  ('weight-room', 4, 6000, 80, 800, 3600),
  ('weight-room', 5, 12000, 120, 1200, 5400),
  ('weight-room', 6, 24000, 180, 1800, 7200),
  ('weight-room', 7, 48000, 260, 2600, 10800),
  ('weight-room', 8, 96000, 360, 3600, 14400),
  ('weight-room', 9, 192000, 500, 5000, 21600),
  ('weight-room', 10, 384000, 700, 7000, 28800)
ON CONFLICT (building_type, level) DO UPDATE SET
  upgrade_cost = EXCLUDED.upgrade_cost,
  production_rate = EXCLUDED.production_rate,
  production_cap = EXCLUDED.production_cap,
  build_time_seconds = EXCLUDED.build_time_seconds;

-- Practice Field levels (increases drill slots)
INSERT INTO building_level_configs (building_type, level, upgrade_cost, production_rate, production_cap, build_time_seconds) VALUES
  ('practice-field', 1, 500, 0, 0, 300),
  ('practice-field', 2, 1000, 0, 0, 900),
  ('practice-field', 3, 2500, 0, 0, 1800),
  ('practice-field', 4, 5000, 0, 0, 3600),
  ('practice-field', 5, 10000, 0, 0, 7200)
ON CONFLICT (building_type, level) DO UPDATE SET
  upgrade_cost = EXCLUDED.upgrade_cost,
  build_time_seconds = EXCLUDED.build_time_seconds;

-- Stadium levels (boost multipliers)
INSERT INTO building_level_configs (building_type, level, upgrade_cost, production_rate, production_cap, build_time_seconds) VALUES
  ('stadium', 1, 1000, 0, 0, 600),
  ('stadium', 2, 2000, 0, 0, 1200),
  ('stadium', 3, 4000, 0, 0, 2400),
  ('stadium', 4, 8000, 0, 0, 4800),
  ('stadium', 5, 16000, 0, 0, 7200),
  ('stadium', 6, 32000, 0, 0, 10800),
  ('stadium', 7, 64000, 0, 0, 14400),
  ('stadium', 8, 128000, 0, 0, 21600),
  ('stadium', 9, 256000, 0, 0, 28800),
  ('stadium', 10, 512000, 0, 0, 43200)
ON CONFLICT (building_type, level) DO UPDATE SET
  upgrade_cost = EXCLUDED.upgrade_cost,
  build_time_seconds = EXCLUDED.build_time_seconds;

-- ============================================
-- SEED DATA - DRILL TYPES
-- ============================================

INSERT INTO drill_types (id, name, description, icon, coin_cost, growth_time_minutes, coin_reward, xp_reward, kp_reward, rarity, unlock_level) VALUES
  -- Common drills (fast, low reward)
  ('passing-basic', 'Basic Passing', 'Quick passing drill', 'american-football', 25, 15, 50, 5, 0, 'common', 1),
  ('catching-basic', 'Basic Catching', 'Simple catching practice', 'hand-left', 25, 15, 50, 5, 0, 'common', 1),
  ('blocking-basic', 'Basic Blocking', 'Fundamental blocking drill', 'shield', 30, 20, 60, 8, 0, 'common', 1),

  -- Rare drills (medium time, medium reward)
  ('passing-advanced', 'Advanced Passing', 'Complex passing routes', 'american-football', 75, 60, 180, 20, 5, 'rare', 3),
  ('defense-tackling', 'Tackling Drill', 'Defensive tackling practice', 'fitness', 75, 60, 180, 20, 5, 'rare', 3),
  ('speed-agility', 'Speed & Agility', 'Cone drills and sprints', 'flash', 80, 75, 200, 25, 5, 'rare', 4),

  -- Epic drills (long time, high reward)
  ('redzone-offense', 'Red Zone Offense', 'Goal-line scenarios', 'trophy', 150, 180, 450, 50, 15, 'epic', 5),
  ('two-minute-drill', 'Two-Minute Drill', 'Hurry-up offense practice', 'timer', 150, 180, 450, 50, 15, 'epic', 5),
  ('film-study', 'Film Study Session', 'Intensive game film analysis', 'film', 120, 120, 300, 40, 25, 'epic', 4),

  -- Legendary drills (very long, massive reward)
  ('championship-prep', 'Championship Prep', 'Elite playoff preparation', 'medal', 300, 360, 1000, 120, 50, 'legendary', 8),
  ('pro-combine', 'Pro Combine Training', 'NFL-level workout', 'star', 350, 420, 1200, 150, 60, 'legendary', 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  coin_cost = EXCLUDED.coin_cost,
  growth_time_minutes = EXCLUDED.growth_time_minutes,
  coin_reward = EXCLUDED.coin_reward,
  xp_reward = EXCLUDED.xp_reward,
  kp_reward = EXCLUDED.kp_reward,
  rarity = EXCLUDED.rarity,
  unlock_level = EXCLUDED.unlock_level;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_buildings_user_id ON user_buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_buildings_building_type ON user_buildings(building_type);
CREATE INDEX IF NOT EXISTS idx_user_drills_user_id ON user_drills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_drills_ready ON user_drills(user_id, is_ready) WHERE collected_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_building_level_configs_type ON building_level_configs(building_type, level);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE building_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_level_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_drills ENABLE ROW LEVEL SECURITY;

-- Building types (public read)
CREATE POLICY "Anyone can view building types" ON building_types
  FOR SELECT USING (true);

-- Building level configs (public read)
CREATE POLICY "Anyone can view building configs" ON building_level_configs
  FOR SELECT USING (true);

-- User buildings (users can view and manage their own)
CREATE POLICY "Users can view own buildings" ON user_buildings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own buildings" ON user_buildings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own buildings" ON user_buildings
  FOR UPDATE USING (auth.uid() = user_id);

-- Drill types (public read)
CREATE POLICY "Anyone can view drill types" ON drill_types
  FOR SELECT USING (true);

-- User drills (users can view and manage their own)
CREATE POLICY "Users can view own drills" ON user_drills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drills" ON user_drills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drills" ON user_drills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drills" ON user_drills
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS - AUTO-INITIALIZE BUILDINGS
-- ============================================

-- Function to auto-create starter buildings for new users
CREATE OR REPLACE FUNCTION initialize_user_buildings()
RETURNS TRIGGER AS $$
BEGIN
  -- Give new users Film Room (level 1, built) and Practice Field (level 0, not built)
  INSERT INTO user_buildings (user_id, building_type, level, production_current, production_last_collected)
  VALUES
    (NEW.id, 'film-room', 1, 0, NOW()),
    (NEW.id, 'practice-field', 0, 0, NOW()),
    (NEW.id, 'stadium', 0, 0, NOW()),
    (NEW.id, 'weight-room', 0, 0, NOW()),
    (NEW.id, 'headquarters', 0, 0, NOW()),
    (NEW.id, 'locker-room', 0, 0, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize buildings on new user signup
DROP TRIGGER IF EXISTS trigger_initialize_user_buildings ON profiles;
CREATE TRIGGER trigger_initialize_user_buildings
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_buildings();

-- ============================================
-- FUNCTIONS - PRODUCTION CALCULATION
-- ============================================

-- Function to calculate accumulated production for a building
CREATE OR REPLACE FUNCTION calculate_building_production(
  p_user_building_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_building user_buildings%ROWTYPE;
  v_config building_level_configs%ROWTYPE;
  v_hours_elapsed NUMERIC;
  v_production_earned INTEGER;
  v_total_production INTEGER;
BEGIN
  -- Get building details
  SELECT * INTO v_building FROM user_buildings WHERE id = p_user_building_id;

  IF NOT FOUND OR v_building.level = 0 THEN
    RETURN 0;
  END IF;

  -- Get production config for this level
  SELECT * INTO v_config
  FROM building_level_configs
  WHERE building_type = v_building.building_type
    AND level = v_building.level;

  IF NOT FOUND OR v_config.production_rate = 0 THEN
    RETURN 0;
  END IF;

  -- Calculate hours elapsed since last collection
  v_hours_elapsed := EXTRACT(EPOCH FROM (NOW() - v_building.production_last_collected)) / 3600.0;

  -- Calculate production earned
  v_production_earned := FLOOR(v_hours_elapsed * v_config.production_rate);

  -- Add to current production, cap at max
  v_total_production := LEAST(
    v_building.production_current + v_production_earned,
    v_config.production_cap
  );

  RETURN v_total_production;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMPLETE!
-- ============================================

-- Migration complete. You can now:
-- 1. Query building_types to see all buildings
-- 2. Query user_buildings to see a user's buildings
-- 3. Query drill_types to see all available drills
-- 4. Plant drills in user_drills table
