-- Add Practice Drills
-- Interactive exercises separate from video lessons

-- Practice drills table - defines drills/exercises
CREATE TABLE practice_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  instructions TEXT,
  thumbnail_url TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  category course_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  estimated_minutes INTEGER DEFAULT 0 NOT NULL,
  drill_type VARCHAR(50) NOT NULL, -- 'scenario', 'multiple_choice', 'form_check', 'video_analysis'
  passing_score INTEGER DEFAULT 70 NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Drill attempts - tracks user drill attempts
CREATE TABLE drill_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES practice_drills(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0 NOT NULL,
  max_score INTEGER DEFAULT 0 NOT NULL,
  percentage INTEGER DEFAULT 0 NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  passed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0 NOT NULL,
  feedback TEXT
);

-- Drill scores - best scores per user per drill
CREATE TABLE drill_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES practice_drills(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0 NOT NULL,
  best_percentage INTEGER DEFAULT 0 NOT NULL,
  attempts_count INTEGER DEFAULT 0 NOT NULL,
  first_attempt_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, drill_id)
);

-- Create indexes
CREATE INDEX idx_practice_drills_published ON practice_drills(is_published);
CREATE INDEX idx_practice_drills_slug ON practice_drills(slug);
CREATE INDEX idx_practice_drills_course ON practice_drills(course_id);
CREATE INDEX idx_practice_drills_category ON practice_drills(category);
CREATE INDEX idx_practice_drills_difficulty ON practice_drills(difficulty_level);

CREATE INDEX idx_drill_attempts_user_id ON drill_attempts(user_id);
CREATE INDEX idx_drill_attempts_drill_id ON drill_attempts(drill_id);
CREATE INDEX idx_drill_attempts_completed ON drill_attempts(completed_at DESC);

CREATE INDEX idx_drill_scores_user_id ON drill_scores(user_id);
CREATE INDEX idx_drill_scores_drill_id ON drill_scores(drill_id);
CREATE INDEX idx_drill_scores_best ON drill_scores(best_percentage DESC);

-- Triggers
CREATE TRIGGER update_practice_drills_updated_at BEFORE UPDATE ON practice_drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update best drill scores
CREATE OR REPLACE FUNCTION update_drill_best_score()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO drill_scores (user_id, drill_id, best_score, best_percentage, attempts_count, first_attempt_at, last_attempt_at)
  VALUES (NEW.user_id, NEW.drill_id, NEW.score, NEW.percentage, 1, NEW.completed_at, NEW.completed_at)
  ON CONFLICT (user_id, drill_id)
  DO UPDATE SET
    best_score = GREATEST(drill_scores.best_score, NEW.score),
    best_percentage = GREATEST(drill_scores.best_percentage, NEW.percentage),
    attempts_count = drill_scores.attempts_count + 1,
    last_attempt_at = NEW.completed_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER drill_attempt_completed
  AFTER INSERT ON drill_attempts
  FOR EACH ROW
  EXECUTE FUNCTION update_drill_best_score();

-- RLS Policies
ALTER TABLE practice_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_scores ENABLE ROW LEVEL SECURITY;

-- Drills - anyone can view published drills
CREATE POLICY "Anyone can view published drills"
  ON practice_drills FOR SELECT
  USING (is_published = TRUE);

-- Drill attempts - users can view and create their own
CREATE POLICY "Users can view their own drill attempts"
  ON drill_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create drill attempts"
  ON drill_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Drill scores - users can view their own and top scores
CREATE POLICY "Users can view their own scores"
  ON drill_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view top scores"
  ON drill_scores FOR SELECT
  USING (TRUE); -- For leaderboards

-- Comments
COMMENT ON TABLE practice_drills IS 'Interactive practice exercises and drills';
COMMENT ON TABLE drill_attempts IS 'User attempts at practice drills';
COMMENT ON TABLE drill_scores IS 'Best scores per user per drill';
COMMENT ON COLUMN practice_drills.drill_type IS 'Type of drill: scenario, multiple_choice, form_check, video_analysis';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Practice drills created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ practice_drills - Interactive exercises';
  RAISE NOTICE '  ✅ drill_attempts - Drill attempt tracking';
  RAISE NOTICE '  ✅ drill_scores - Best scores tracking';
  RAISE NOTICE '';
  RAISE NOTICE '🏋️ Students can now practice with interactive drills!';
END $$;
