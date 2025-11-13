-- Add User Notes, Streaks, and Leaderboards
-- Personal notes, daily streaks, and competitive rankings

-- User notes - private notes on lessons
CREATE TABLE lesson_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- User streaks - daily learning activity tracking
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  total_active_days INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Daily activity log - tracks daily engagement
CREATE TABLE daily_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  lessons_completed INTEGER DEFAULT 0 NOT NULL,
  watch_time_seconds INTEGER DEFAULT 0 NOT NULL,
  quizzes_passed INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, activity_date)
);

-- Leaderboard entries - competitive rankings
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  leaderboard_type VARCHAR(50) NOT NULL, -- 'points', 'completions', 'streak', 'monthly'
  score INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, leaderboard_type, period_start)
);

-- Create indexes
CREATE INDEX idx_lesson_notes_user_id ON lesson_notes(user_id);
CREATE INDEX idx_lesson_notes_lesson_id ON lesson_notes(lesson_id);

CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_streaks_current ON user_streaks(current_streak DESC);
CREATE INDEX idx_user_streaks_longest ON user_streaks(longest_streak DESC);

CREATE INDEX idx_daily_activity_user_id ON daily_activity_log(user_id);
CREATE INDEX idx_daily_activity_date ON daily_activity_log(activity_date DESC);

CREATE INDEX idx_leaderboard_type ON leaderboard_entries(leaderboard_type, rank);
CREATE INDEX idx_leaderboard_period ON leaderboard_entries(period_start, period_end);
CREATE INDEX idx_leaderboard_user ON leaderboard_entries(user_id);

-- Triggers
CREATE TRIGGER update_lesson_notes_updated_at BEFORE UPDATE ON lesson_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON user_streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON leaderboard_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update streak on activity
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_count INTEGER;
  longest_count INTEGER;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, longest_streak
  INTO last_date, current_count, longest_count
  FROM user_streaks
  WHERE user_id = NEW.user_id;

  -- If no streak record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
    VALUES (NEW.user_id, 1, 1, NEW.activity_date, 1);
    RETURN NEW;
  END IF;

  -- If activity is today or yesterday, continue/maintain streak
  IF last_date = NEW.activity_date THEN
    -- Same day, no change
    RETURN NEW;
  ELSIF last_date = NEW.activity_date - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    current_count := current_count + 1;
    longest_count := GREATEST(longest_count, current_count);
  ELSIF last_date < NEW.activity_date - INTERVAL '1 day' THEN
    -- Streak broken, reset to 1
    current_count := 1;
  END IF;

  -- Update streak record
  UPDATE user_streaks
  SET
    current_streak = current_count,
    longest_streak = longest_count,
    last_activity_date = NEW.activity_date,
    total_active_days = total_active_days + 1
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_activity_streak_update
  AFTER INSERT ON daily_activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streak();

-- RLS Policies
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Lesson notes - private to user
CREATE POLICY "Users can view their own notes"
  ON lesson_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON lesson_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON lesson_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON lesson_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Streaks - users can view their own
CREATE POLICY "Users can view their own streak"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

-- Activity log - users can view their own
CREATE POLICY "Users can view their own activity"
  ON daily_activity_log FOR SELECT
  USING (auth.uid() = user_id);

-- Leaderboards - everyone can view
CREATE POLICY "Anyone can view leaderboards"
  ON leaderboard_entries FOR SELECT
  USING (TRUE);

-- Comments
COMMENT ON TABLE lesson_notes IS 'Private user notes on lessons';
COMMENT ON TABLE user_streaks IS 'Daily learning streaks tracking';
COMMENT ON TABLE daily_activity_log IS 'Daily engagement metrics per user';
COMMENT ON TABLE leaderboard_entries IS 'Competitive rankings by points, completions, etc.';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Notes, streaks, and leaderboards created!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ lesson_notes - Private study notes';
  RAISE NOTICE '  ✅ user_streaks - Daily streak tracking';
  RAISE NOTICE '  ✅ daily_activity_log - Daily engagement metrics';
  RAISE NOTICE '  ✅ leaderboard_entries - Competitive rankings';
  RAISE NOTICE '';
  RAISE NOTICE '🔥 Track streaks and compete on leaderboards!';
END $$;
