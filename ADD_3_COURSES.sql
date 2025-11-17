-- Simple SQL to add 3 free YouTube courses
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- Course 1: How Downs Work
INSERT INTO courses (
  slug,
  title,
  description,
  instructor_name,
  category,
  difficulty_level,
  duration_minutes,
  tier_required,
  is_published,
  order_index
) VALUES (
  'how-downs-work',
  'What are DOWNS in Football?',
  'Finally understand the most confusing part of football. Learn what downs are, why teams get 4 chances, and what it all means for the game.',
  'Kickoff Club HQ',
  'general',
  'beginner',
  5,
  'free',
  true,
  1
);

-- Course 2: Field Layout
INSERT INTO courses (
  slug,
  title,
  description,
  instructor_name,
  category,
  difficulty_level,
  duration_minutes,
  tier_required,
  is_published,
  order_index
) VALUES (
  'field-layout-basics',
  'Football Field Layout',
  'Learn how the football field works. Understand yard lines, end zones, and everything between in simple terms.',
  'Kickoff Club HQ',
  'general',
  'beginner',
  5,
  'free',
  true,
  2
);

-- Course 3: Scoring
INSERT INTO courses (
  slug,
  title,
  description,
  instructor_name,
  category,
  difficulty_level,
  duration_minutes,
  tier_required,
  is_published,
  order_index
) VALUES (
  'scoring-touchdowns',
  'How to Score in Football',
  'Learn all the ways to score in football. Touchdowns, field goals, safeties, and everything in between explained simply.',
  'Kickoff Club HQ',
  'general',
  'beginner',
  4,
  'free',
  true,
  3
);

-- Now add lessons with YouTube video IDs
INSERT INTO lessons (
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_free,
  is_published
)
SELECT
  c.id,
  'What are DOWNS in Football?',
  'intro',
  'The most confusing part of football, explained.',
  '2Crk_DZ0TDE',
  289,
  1,
  true,
  true
FROM courses c WHERE c.slug = 'how-downs-work';

INSERT INTO lessons (
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_free,
  is_published
)
SELECT
  c.id,
  'Football Field Layout',
  'intro',
  'Understanding the field.',
  'KEOxIkQxMDI',
  302,
  1,
  true,
  true
FROM courses c WHERE c.slug = 'field-layout-basics';

INSERT INTO lessons (
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_free,
  is_published
)
SELECT
  c.id,
  'How to Score in Football',
  'intro',
  'All the ways to score.',
  '2F_yl0lWj40',
  271,
  1,
  true,
  true
FROM courses c WHERE c.slug = 'scoring-touchdowns';
