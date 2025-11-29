-- Create user_drills table for Practice Field
CREATE TABLE IF NOT EXISTS user_drills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slot_index INTEGER NOT NULL, -- 0-8 for a 3x3 grid
  drill_type TEXT NOT NULL, -- 'speed_ladder', 'bench_press', 'film_study'
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed'
  is_reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique slot per user
  UNIQUE(user_id, slot_index)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_drills_user ON user_drills(user_id);

-- RLS
ALTER TABLE user_drills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own drills" ON user_drills;
CREATE POLICY "Users can view their own drills"
  ON user_drills FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own drills" ON user_drills;
CREATE POLICY "Users can update their own drills"
  ON user_drills FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own drills" ON user_drills;
CREATE POLICY "Users can insert their own drills"
  ON user_drills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own drills" ON user_drills;
CREATE POLICY "Users can delete their own drills"
  ON user_drills FOR DELETE
  USING (auth.uid() = user_id);
