-- Add Certificates and Achievements Feature
-- Gamification system to reward user progress and completion

-- Achievements table - defines available achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  badge_icon TEXT, -- Icon/emoji for the badge
  badge_url TEXT, -- Optional: URL to badge image
  points INTEGER DEFAULT 0 NOT NULL, -- Points awarded for earning this
  category VARCHAR(100), -- e.g., 'course_completion', 'streak', 'quiz_mastery'
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User achievements - tracks which users earned which achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  progress INTEGER DEFAULT 0, -- For progressive achievements (e.g., complete 5 courses)
  metadata JSONB, -- Additional context about how achievement was earned
  UNIQUE(user_id, achievement_id) -- Each achievement earned once per user
);

-- Course certificates - issued when user completes a course
CREATE TABLE course_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) NOT NULL UNIQUE, -- Unique certificate ID
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completion_date TIMESTAMPTZ NOT NULL, -- When course was actually completed
  final_score INTEGER, -- Optional: quiz/assessment score
  certificate_url TEXT, -- Optional: URL to PDF certificate
  is_public BOOLEAN DEFAULT TRUE NOT NULL, -- Can be shared publicly
  UNIQUE(user_id, course_id) -- One certificate per user per course
);

-- Add points system to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0 NOT NULL CHECK (total_points >= 0),
ADD COLUMN IF NOT EXISTS achievement_count INTEGER DEFAULT 0 NOT NULL CHECK (achievement_count >= 0);

-- Create indexes for better query performance
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_slug ON achievements(slug);
CREATE INDEX idx_achievements_active ON achievements(is_active);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_earned ON user_achievements(earned_at DESC);

CREATE INDEX idx_certificates_user_id ON course_certificates(user_id);
CREATE INDEX idx_certificates_course_id ON course_certificates(course_id);
CREATE INDEX idx_certificates_issued ON course_certificates(issued_at DESC);
CREATE INDEX idx_certificates_number ON course_certificates(certificate_number);

-- Function to generate unique certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Format: KHQ-YYYY-XXXXXX (e.g., KHQ-2025-000123)
  NEW.certificate_number := 'KHQ-' ||
    EXTRACT(YEAR FROM NOW())::TEXT || '-' ||
    LPAD(nextval('certificate_sequence')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for certificate numbers
CREATE SEQUENCE IF NOT EXISTS certificate_sequence START 1;

CREATE TRIGGER set_certificate_number
  BEFORE INSERT ON course_certificates
  FOR EACH ROW
  WHEN (NEW.certificate_number IS NULL)
  EXECUTE FUNCTION generate_certificate_number();

-- Function to update user's achievement count and points
CREATE OR REPLACE FUNCTION update_user_achievement_stats()
RETURNS TRIGGER AS $$
DECLARE
  achievement_points INTEGER;
BEGIN
  -- Get points for this achievement
  SELECT points INTO achievement_points
  FROM achievements
  WHERE id = NEW.achievement_id;

  -- Update user's total points and achievement count
  UPDATE profiles
  SET
    total_points = total_points + COALESCE(achievement_points, 0),
    achievement_count = (
      SELECT COUNT(*) FROM user_achievements WHERE user_id = NEW.user_id
    )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievement_earned
  AFTER INSERT ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_user_achievement_stats();

-- Function to automatically issue certificate when course is completed
CREATE OR REPLACE FUNCTION auto_issue_certificate()
RETURNS TRIGGER AS $$
BEGIN
  -- Only issue certificate if course was just completed (completed_at changed to non-null)
  IF OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
    INSERT INTO course_certificates (user_id, course_id, completion_date)
    VALUES (NEW.user_id, NEW.course_id, NEW.completed_at)
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_certificate_on_completion
  AFTER UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION auto_issue_certificate();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

-- Achievements - everyone can view active achievements
CREATE POLICY "Anyone can view active achievements"
  ON achievements FOR SELECT
  USING (is_active = TRUE);

-- User achievements - users can view their own, others can see via leaderboard
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievement counts"
  ON user_achievements FOR SELECT
  USING (TRUE); -- Needed for leaderboards

-- Certificates - users manage their own, public ones are viewable
CREATE POLICY "Users can view their own certificates"
  ON course_certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public certificates"
  ON course_certificates FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can update their own certificates"
  ON course_certificates FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE achievements IS 'Available achievements users can earn';
COMMENT ON TABLE user_achievements IS 'Tracks which users earned which achievements';
COMMENT ON TABLE course_certificates IS 'Certificates issued for completed courses';
COMMENT ON COLUMN course_certificates.certificate_number IS 'Unique certificate ID (format: KHQ-YYYY-XXXXXX)';
COMMENT ON COLUMN course_certificates.is_public IS 'Whether certificate can be publicly viewed/shared';
COMMENT ON COLUMN profiles.total_points IS 'Total points earned from achievements';
COMMENT ON COLUMN profiles.achievement_count IS 'Total number of achievements earned';

-- Insert default achievements
INSERT INTO achievements (name, slug, description, badge_icon, category, points) VALUES
('First Steps', 'first-steps', 'Complete your first lesson', '👣', 'course_completion', 10),
('Course Complete', 'course-complete', 'Complete your first course', '🎓', 'course_completion', 50),
('Quiz Master', 'quiz-master', 'Pass your first quiz with 100%', '💯', 'quiz_mastery', 25),
('Perfect Score', 'perfect-score', 'Get 100% on 5 quizzes', '⭐', 'quiz_mastery', 100),
('Speed Learner', 'speed-learner', 'Complete a course in one day', '⚡', 'course_completion', 75),
('Dedicated Student', 'dedicated-student', 'Complete 5 courses', '📚', 'course_completion', 200),
('Football Expert', 'football-expert', 'Complete 10 courses', '🏈', 'course_completion', 500),
('Review Writer', 'review-writer', 'Write your first course review', '✍️', 'engagement', 15),
('Helpful Helper', 'helpful-helper', 'Have 10 people mark your review as helpful', '🤝', 'engagement', 50),
('Bookmark Pro', 'bookmark-pro', 'Create 25 bookmarks', '🔖', 'engagement', 30)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Certificates and achievements created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ achievements - Available achievements to earn';
  RAISE NOTICE '  ✅ user_achievements - Track earned achievements';
  RAISE NOTICE '  ✅ course_certificates - Auto-issued on completion';
  RAISE NOTICE '  ✅ Points system added to profiles';
  RAISE NOTICE '  ✅ 10 default achievements created';
  RAISE NOTICE '';
  RAISE NOTICE '🏆 Gamification system ready!';
  RAISE NOTICE '📜 Certificates auto-issued with unique IDs (KHQ-YYYY-XXXXXX)';
END $$;
