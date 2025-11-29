-- Create daily_missions table
CREATE TABLE IF NOT EXISTS daily_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'play_match', 'train_unit', 'complete_lesson', 'login'
  description TEXT NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1,
  current_progress INTEGER NOT NULL DEFAULT 0,
  reward_coins INTEGER NOT NULL DEFAULT 0,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_expires ON daily_missions(user_id, expires_at);

-- RLS
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own missions" ON daily_missions;
CREATE POLICY "Users can view their own missions"
  ON daily_missions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own missions" ON daily_missions;
CREATE POLICY "Users can update their own missions"
  ON daily_missions FOR UPDATE
  USING (auth.uid() = user_id);
