-- Kickoff Club HQ Database Migrations
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. CREATE LESSON COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_lesson ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON lesson_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON lesson_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON lesson_comments(created_at DESC);

-- Enable RLS
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON lesson_comments;
CREATE POLICY "Comments are viewable by everyone"
  ON lesson_comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON lesson_comments;
CREATE POLICY "Users can create comments"
  ON lesson_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON lesson_comments;
CREATE POLICY "Users can update own comments"
  ON lesson_comments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON lesson_comments;
CREATE POLICY "Users can delete own comments"
  ON lesson_comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 2. CREATE COURSE REVIEWS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON course_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON course_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_reviews
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON course_reviews;
CREATE POLICY "Reviews are viewable by everyone"
  ON course_reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create reviews" ON course_reviews;
CREATE POLICY "Users can create reviews"
  ON course_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON course_reviews;
CREATE POLICY "Users can update own reviews"
  ON course_reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON course_reviews;
CREATE POLICY "Users can delete own reviews"
  ON course_reviews FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 3. ADD MISSING PROFILE COLUMNS (IF NEEDED)
-- ============================================

-- Add subscription columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_customer_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_subscription_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_end_date') THEN
    ALTER TABLE profiles ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add indexes for Stripe columns
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription ON profiles(stripe_subscription_id);

-- ============================================
-- 4. CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_lesson_comments_updated_at ON lesson_comments;
CREATE TRIGGER update_lesson_comments_updated_at
    BEFORE UPDATE ON lesson_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_reviews_updated_at ON course_reviews;
CREATE TRIGGER update_course_reviews_updated_at
    BEFORE UPDATE ON course_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. VERIFY EXISTING TABLES HAVE RLS
-- ============================================

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables exist
SELECT
  'lesson_comments' as table_name,
  COUNT(*) as row_count
FROM lesson_comments
UNION ALL
SELECT
  'course_reviews' as table_name,
  COUNT(*) as row_count
FROM course_reviews;

-- Show all tables
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
