-- ============================================
-- KICKOFF CLUB HQ - FEATURES MIGRATION
-- All new features: Categories, Tags, Instructors, Quizzes, Coupons, etc.
-- ============================================

-- ============================================
-- 1. COURSE CATEGORIES & TAGS
-- ============================================

-- Create categories table
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon name
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS course_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course-tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS course_tag_relationships (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES course_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, tag_id)
);

-- Add category_id to courses table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='category_id') THEN
    ALTER TABLE courses ADD COLUMN category_id UUID REFERENCES course_categories(id);
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_course ON course_tag_relationships(course_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_tag ON course_tag_relationships(tag_id);

-- Enable RLS
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tag_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "Categories viewable by all" ON course_categories FOR SELECT USING (true);
CREATE POLICY "Tags viewable by all" ON course_tags FOR SELECT USING (true);
CREATE POLICY "Tag relationships viewable by all" ON course_tag_relationships FOR SELECT USING (true);

-- ============================================
-- 2. INSTRUCTOR PROFILES
-- ============================================

CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  credentials TEXT,
  profile_image_url TEXT,
  website_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  years_experience INTEGER,
  specialties TEXT[], -- array of specialties
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add instructor_id to courses
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='instructor_id') THEN
    ALTER TABLE courses ADD COLUMN instructor_id UUID REFERENCES instructors(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);

-- Enable RLS
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructors viewable by all" ON instructors FOR SELECT USING (true);

-- ============================================
-- 3. QUIZ & ASSESSMENT SYSTEM
-- ============================================

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER, -- null = no time limit
  quiz_type TEXT DEFAULT 'lesson' CHECK (quiz_type IN ('lesson', 'final')),
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  points INTEGER DEFAULT 1,
  explanation TEXT, -- shown after answering
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz answer options
CREATE TABLE IF NOT EXISTS quiz_answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers
CREATE TABLE IF NOT EXISTS quiz_user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES quiz_answer_options(id),
  answer_text TEXT, -- for short answer questions
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options ON quiz_answer_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_user_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Quizzes viewable by enrolled users" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Questions viewable by all" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Answer options viewable by all" ON quiz_answer_options FOR SELECT USING (true);
CREATE POLICY "Users can view own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own answers" ON quiz_user_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM quiz_attempts WHERE quiz_attempts.id = quiz_user_answers.attempt_id AND quiz_attempts.user_id = auth.uid())
);

-- ============================================
-- 4. COUPON & DISCOUNT SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  max_redemptions INTEGER, -- null = unlimited
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applies_to_tiers TEXT[], -- array of tiers: ['basic', 'premium'], null = all
  applies_to_courses UUID[], -- array of course IDs, null = all courses
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  discount_amount NUMERIC(10,2) NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coupon_id, user_id) -- one use per user per coupon
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions ON coupon_redemptions(coupon_id);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons viewable by all" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own redemptions" ON coupon_redemptions FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 5. STUDENT ACHIEVEMENTS & BADGES
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  badge_image_url TEXT,
  achievement_type TEXT CHECK (achievement_type IN ('course_completion', 'streak', 'quiz_score', 'review', 'enrollment')),
  criteria JSONB, -- flexible criteria definition
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Learning streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_achievements ON user_achievements(user_id);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements viewable by all" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own streak" ON user_streaks FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 6. ENHANCED EMAIL TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'bounced')),
  external_id TEXT, -- Resend message ID
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_email_log_user ON email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_email_log_type ON email_log(email_type);

-- Enable RLS
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own emails" ON email_log FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 7. COURSE RECOMMENDATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS course_prerequisites (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, prerequisite_course_id)
);

CREATE TABLE IF NOT EXISTS course_recommendations (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  recommended_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  reason TEXT,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (course_id, recommended_course_id)
);

-- Enable RLS
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prerequisites viewable by all" ON course_prerequisites FOR SELECT USING (true);
CREATE POLICY "Recommendations viewable by all" ON course_recommendations FOR SELECT USING (true);

-- ============================================
-- 8. TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Update instructor updated_at
DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
CREATE TRIGGER update_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update quizzes updated_at
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update coupons updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. INSERT SAMPLE DATA
-- ============================================

-- Sample categories
INSERT INTO course_categories (name, slug, description, icon, order_index) VALUES
  ('Offense', 'offense', 'Offensive strategies and techniques', '⚡', 1),
  ('Defense', 'defense', 'Defensive formations and tactics', '🛡️', 2),
  ('Special Teams', 'special-teams', 'Kicking, punting, and returns', '🦶', 3),
  ('Fundamentals', 'fundamentals', 'Basic football skills and rules', '📚', 4),
  ('Position-Specific', 'position-specific', 'Training for specific positions', '🏈', 5),
  ('Coaching', 'coaching', 'Coaching strategies and leadership', '👨‍🏫', 6)
ON CONFLICT (slug) DO NOTHING;

-- Sample tags
INSERT INTO course_tags (name, slug) VALUES
  ('Beginner', 'beginner'),
  ('Intermediate', 'intermediate'),
  ('Advanced', 'advanced'),
  ('Quarterback', 'quarterback'),
  ('Wide Receiver', 'wide-receiver'),
  ('Running Back', 'running-back'),
  ('Offensive Line', 'offensive-line'),
  ('Defensive Line', 'defensive-line'),
  ('Linebacker', 'linebacker'),
  ('Secondary', 'secondary'),
  ('Strategy', 'strategy'),
  ('Technique', 'technique'),
  ('Rules', 'rules'),
  ('Drills', 'drills')
ON CONFLICT (slug) DO NOTHING;

-- Sample instructor
INSERT INTO instructors (name, slug, bio, credentials, years_experience, specialties) VALUES
  ('Coach Marcus Williams', 'coach-marcus-williams',
   'Former NFL player with 15 years of coaching experience at the high school and college levels.',
   'NFL Veteran, NCAA D1 Coaching Certificate, NFLPA Certified',
   15,
   ARRAY['Quarterback Training', 'Offensive Strategy', 'Leadership Development'])
ON CONFLICT (slug) DO NOTHING;

-- Sample achievements
INSERT INTO achievements (name, description, icon, achievement_type, points) VALUES
  ('First Course', 'Complete your first course', '🎓', 'course_completion', 10),
  ('Quick Learner', 'Complete a course in under 24 hours', '⚡', 'course_completion', 20),
  ('Perfect Score', 'Score 100% on a quiz', '💯', 'quiz_score', 15),
  ('7-Day Streak', 'Learn for 7 consecutive days', '🔥', 'streak', 25),
  ('Course Collector', 'Enroll in 5 courses', '📚', 'enrollment', 15),
  ('Helpful Student', 'Leave your first review', '⭐', 'review', 10)
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT
  'course_categories' as table_name,
  COUNT(*) as row_count
FROM course_categories
UNION ALL
SELECT 'course_tags', COUNT(*) FROM course_tags
UNION ALL
SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements
UNION ALL
SELECT 'quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons;
