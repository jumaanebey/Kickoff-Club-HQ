-- Kickoff Club HQ - Complete Database Setup
-- Run this entire file in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE course_category AS ENUM ('quarterback', 'wide_receiver', 'running_back', 'offensive_line', 'defense', 'special_teams', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
  subscription_status subscription_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor_name VARCHAR(255) NOT NULL,
  instructor_bio TEXT,
  instructor_avatar TEXT,
  category course_category NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  tier_required subscription_tier DEFAULT 'free' NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  enrolled_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration_seconds INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  resources JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(course_id, slug)
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  completion_date TIMESTAMPTZ,
  watch_time_seconds INTEGER DEFAULT 0 NOT NULL,
  last_position_seconds INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(user_id, course_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_tier ON courses(tier_required);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment enrolled_count when user enrolls
CREATE OR REPLACE FUNCTION increment_course_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET enrolled_count = enrolled_count + 1
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enrollment_created ON enrollments;
CREATE TRIGGER enrollment_created AFTER INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION increment_course_enrollment();

-- Function to update course progress percentage
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  new_progress INTEGER;
BEGIN
  -- Get total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons
  WHERE course_id = (SELECT course_id FROM lessons WHERE id = NEW.lesson_id);

  -- Get completed lessons for this user
  SELECT COUNT(*) INTO completed_lessons
  FROM user_progress up
  JOIN lessons l ON up.lesson_id = l.id
  WHERE up.user_id = NEW.user_id
    AND l.course_id = (SELECT course_id FROM lessons WHERE id = NEW.lesson_id)
    AND up.completed = TRUE;

  -- Calculate progress percentage
  new_progress := (completed_lessons * 100) / NULLIF(total_lessons, 0);

  -- Update enrollment progress
  UPDATE enrollments
  SET progress_percentage = new_progress,
      completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE NULL END
  WHERE user_id = NEW.user_id
    AND course_id = (SELECT course_id FROM lessons WHERE id = NEW.lesson_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_progress_updated ON user_progress;
CREATE TRIGGER user_progress_updated AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_course_progress();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view published lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can modify their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can enroll themselves in courses" ON enrollments;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = TRUE);

-- Lessons policies
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  USING (
    is_published = TRUE
    AND EXISTS (SELECT 1 FROM courses WHERE id = lessons.course_id AND is_published = TRUE)
  );

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves in courses"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated;

-- Insert sample courses
INSERT INTO courses (title, slug, description, category, difficulty_level, duration_minutes, tier_required, instructor_name, instructor_bio, is_published, order_index) VALUES

('How Downs Work', 'how-downs-work', 'Master the fundamental concept of football: 4 downs to gain 10 yards. This is the strategy engine that makes football unique. Learn why this simple rule creates infinite complexity and excitement.', 'general', 'beginner', 12, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 1),

('Field Layout & Scoring', 'field-layout-scoring', 'Understand the football field, end zones, and how teams score points. Learn about touchdowns, field goals, extra points, and two-point conversions. Essential knowledge for every fan.', 'general', 'beginner', 10, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 2),

('Quarterback Fundamentals', 'quarterback-fundamentals', 'Dive deep into the QB position. Learn proper footwork, throwing mechanics, reading defenses, and making pre-snap adjustments. Become the field general your team needs.', 'quarterback', 'intermediate', 25, 'basic', 'Coach Jake Morrison', 'Former NFL QB and QB coach', true, 3),

('Wide Receiver Routes', 'wide-receiver-routes', 'Master the route tree. Learn how to run crisp routes, create separation, and become a reliable target. Includes drills you can practice at home.', 'wide_receiver', 'beginner', 20, 'basic', 'Coach DeAndre Thompson', '8-year NFL receiver veteran', true, 4),

('Running Back Techniques', 'running-back-techniques', 'Learn vision, patience, and explosion. Understand gap schemes, pass protection, and how to be a dual-threat back. Film study included.', 'running_back', 'intermediate', 22, 'basic', 'Coach Terrell Davis', 'Former Pro Bowl running back', true, 5),

('Defensive Line Fundamentals', 'defensive-line-fundamentals', 'Master the trenches. Learn hand placement, leverage, gap responsibility, and pass rush moves. Dominate the line of scrimmage.', 'defense', 'intermediate', 24, 'premium', 'Coach Michael Strahan', '15-year NFL defensive end', true, 6),

('Linebacker Reads & Reactions', 'linebacker-reads-reactions', 'The QB of the defense. Learn to read offensive formations, fill gaps, and make plays sideline to sideline. Advanced defensive concepts.', 'defense', 'advanced', 28, 'premium', 'Coach Ray Lewis', 'NFL Hall of Fame linebacker', true, 7),

('Understanding Penalties', 'understanding-penalties', 'Never be confused by a flag again. Learn all major penalties, why they are called, and how they impact the game. Includes real game examples.', 'general', 'beginner', 15, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 8),

('Special Teams Mastery', 'special-teams-mastery', 'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.', 'special_teams', 'intermediate', 18, 'basic', 'Coach Justin Tucker', 'All-Pro NFL kicker', true, 9),

('NFL Seasons & Playoffs', 'nfl-seasons-playoffs', 'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship. Perfect for new fans.', 'general', 'beginner', 12, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 10)

ON CONFLICT (slug) DO NOTHING;

-- Sample lessons for first course (How Downs Work)
INSERT INTO lessons (course_id, title, slug, description, video_url, video_duration_seconds, order_index, is_published)
SELECT
  c.id,
  'Introduction to Downs',
  'introduction-to-downs',
  'Learn the basic concept of downs and why it matters',
  'https://example.com/video1.mp4',
  420,
  1,
  true
FROM courses c WHERE c.slug = 'how-downs-work'
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO lessons (course_id, title, slug, description, video_url, video_duration_seconds, order_index, is_published)
SELECT
  c.id,
  'The 10-Yard Rule',
  'ten-yard-rule',
  'Why 10 yards? How it creates strategy',
  'https://example.com/video2.mp4',
  360,
  2,
  true
FROM courses c WHERE c.slug = 'how-downs-work'
ON CONFLICT (course_id, slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup complete! You now have 10 courses and 2 sample lessons.';
END $$;
