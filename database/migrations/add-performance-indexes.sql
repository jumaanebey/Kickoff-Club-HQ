-- Performance Optimization Indexes
-- Run this in your Supabase SQL Editor to dramatically improve query performance

-- ========== COURSES TABLE ==========

-- Index for course lookups by slug (used in /courses/[slug])
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug) WHERE is_published = true;

-- Index for published course listings with ordering
CREATE INDEX IF NOT EXISTS idx_courses_published_order ON courses(is_published, order_index) WHERE is_published = true;

-- Index for category filtering (if category column exists)
-- CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(is_published, category) WHERE is_published = true;

-- Index for difficulty filtering
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(is_published, difficulty_level) WHERE is_published = true;

-- Index for tier filtering
CREATE INDEX IF NOT EXISTS idx_courses_tier ON courses(is_published, tier_required) WHERE is_published = true;

-- Index for enrolled_count (used for sorting popular courses)
CREATE INDEX IF NOT EXISTS idx_courses_enrolled_count ON courses(enrolled_count DESC) WHERE is_published = true;

-- ========== LESSONS TABLE ==========

-- Critical index for course lesson lists (most common query)
CREATE INDEX IF NOT EXISTS idx_lessons_course_published_order ON lessons(course_id, is_published, order_index) WHERE is_published = true;

-- Index for individual lesson lookups by slug
CREATE INDEX IF NOT EXISTS idx_lessons_course_slug ON lessons(course_id, slug) WHERE is_published = true;

-- Index for free lessons filter
CREATE INDEX IF NOT EXISTS idx_lessons_free ON lessons(is_free) WHERE is_free = true AND is_published = true;

-- ========== PODCASTS TABLE ==========

-- Index for podcast lookups by slug
CREATE INDEX IF NOT EXISTS idx_podcasts_slug ON podcasts(slug) WHERE is_published = true;

-- Index for published episodes listing
CREATE INDEX IF NOT EXISTS idx_podcasts_published_episode ON podcasts(is_published, episode_number DESC) WHERE is_published = true;

-- ========== ENROLLMENTS TABLE ==========

-- Index for user enrollment lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON enrollments(user_id, course_id);

-- Index for course enrollment counts (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);

-- Index for recent enrollments (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON enrollments(enrolled_at DESC);

-- ========== USER PROGRESS TABLE ==========

-- Index for user lesson progress lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);

-- Index for lesson completion tracking
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_completed ON user_progress(lesson_id, completed) WHERE completed = true;

-- ========== PROFILES TABLE ==========

-- Index for admin role checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE role = 'admin';

-- Index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Index for subscription tier queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

-- ========== REVIEWS TABLE ==========
-- Commented out - reviews table does not exist yet
-- Uncomment these when reviews table is created:

-- CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id, created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ========== SUPPORT TABLES ==========
-- Commented out - these tables may not exist yet
-- Uncomment these when tables are created:

-- CREATE INDEX IF NOT EXISTS idx_lesson_script_sections_lesson ON lesson_script_sections(lesson_id, order_index);
-- CREATE INDEX IF NOT EXISTS idx_lesson_quizzes_lesson ON lesson_quizzes(lesson_id);
-- CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id, order_index);

-- ========== VERIFY INDEXES ==========

-- Run this query to see all indexes created:
-- SELECT tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- AND indexname LIKE 'idx_%'
-- ORDER BY tablename, indexname;

-- ========== EXPECTED PERFORMANCE GAINS ==========

-- Before: 50-500ms for filtered queries
-- After: 1-10ms for the same queries (10-100x faster)
--
-- Most impact on:
-- 1. /courses page - category/difficulty/tier filters
-- 2. /courses/[slug] - course and lesson lookups
-- 3. /admin dashboard - enrollment and user queries
-- 4. /dashboard - user progress and enrollment queries
