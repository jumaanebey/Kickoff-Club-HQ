-- Phase 3 Blockers Migration
-- Run this in Supabase SQL Editor

-- 1. Add upgrade_started_at to user_buildings
ALTER TABLE user_buildings
ADD COLUMN IF NOT EXISTS upgrade_started_at TIMESTAMPTZ;

-- 2. Create Achievements Table (if not exists)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  badge_image_url TEXT,
  achievement_type TEXT CHECK (achievement_type IN ('course_completion', 'streak', 'quiz_score', 'review', 'enrollment', 'building_upgrade', 'level_up')),
  criteria JSONB, -- flexible criteria definition
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create User Achievements Table (if not exists)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 4. Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Achievements viewable by all" ON achievements;
CREATE POLICY "Achievements viewable by all" ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- 6. Insert some sample HQ achievements
INSERT INTO achievements (name, description, icon, achievement_type, points) VALUES
  ('First Upgrade', 'Upgrade your first building', '🏗️', 'building_upgrade', 50),
  ('Master Builder', 'Upgrade a building to level 5', '🏰', 'building_upgrade', 200),
  ('Empire Builder', 'Unlock all buildings', '🌍', 'building_upgrade', 500)
ON CONFLICT DO NOTHING;
