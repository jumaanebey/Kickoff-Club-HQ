-- ============================================
-- ADD 3 FREE YOUTUBE COURSES FOR LAUNCH
-- ============================================
-- These are the beginner-friendly courses with YouTube videos
-- Run this in your Supabase SQL Editor

-- Course 1: How Downs Work
INSERT INTO courses (
  slug,
  title,
  description,
  instructor_name,
  instructor_bio,
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
  'Teaching football basics without judgment or gatekeeping.',
  'general',
  'beginner',
  5,
  'free',
  true,
  1
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Get the course ID for adding lessons
DO $$
DECLARE
  v_course_id_1 UUID;
  v_course_id_2 UUID;
  v_course_id_3 UUID;
BEGIN
  -- Get course IDs
  SELECT id INTO v_course_id_1 FROM courses WHERE slug = 'how-downs-work' LIMIT 1;

  -- Add lesson for Course 1
  IF v_course_id_1 IS NOT NULL THEN
    INSERT INTO lessons (
      course_id,
      title,
      slug,
      description,
      video_id, -- This is the YouTube video ID
      duration_seconds,
      order_index,
      is_free,
      is_published
    ) VALUES (
      v_course_id_1,
      'What are DOWNS in Football? Complete Beginner''s Guide',
      'intro',
      'The most confusing part of football, explained in 5 minutes.',
      '2Crk_DZ0TDE', -- YouTube video ID
      289, -- 4:49
      1,
      true,
      true
    ) ON CONFLICT (course_id, slug) DO UPDATE SET
      video_id = EXCLUDED.video_id,
      is_published = EXCLUDED.is_published,
      updated_at = NOW();
  END IF;

  -- Course 2: Field Layout Basics
  INSERT INTO courses (
    slug,
    title,
    description,
    instructor_name,
    instructor_bio,
    category,
    difficulty_level,
    duration_minutes,
    tier_required,
    is_published,
    order_index
  ) VALUES (
    'field-layout-basics',
    'Football Field Layout - Understanding Yard Lines & More',
    'Learn how the football field works. Understand yard lines, end zones, and everything between in simple terms.',
    'Kickoff Club HQ',
    'Teaching football basics without judgment or gatekeeping.',
    'general',
    'beginner',
    5,
    'free',
    true,
    2
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = EXCLUDED.is_published,
    updated_at = NOW()
  RETURNING id INTO v_course_id_2;

  -- Add lesson for Course 2
  SELECT id INTO v_course_id_2 FROM courses WHERE slug = 'field-layout-basics' LIMIT 1;
  IF v_course_id_2 IS NOT NULL THEN
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
    ) VALUES (
      v_course_id_2,
      'Football Field Layout - Yard Lines, End Zones & More',
      'intro',
      'Understand yard lines, end zones, and everything between.',
      'KEOxIkQxMDI', -- YouTube video ID
      302, -- 5:02
      1,
      true,
      true
    ) ON CONFLICT (course_id, slug) DO UPDATE SET
      video_id = EXCLUDED.video_id,
      is_published = EXCLUDED.is_published,
      updated_at = NOW();
  END IF;

  -- Course 3: Scoring & Touchdowns
  INSERT INTO courses (
    slug,
    title,
    description,
    instructor_name,
    instructor_bio,
    category,
    difficulty_level,
    duration_minutes,
    tier_required,
    is_published,
    order_index
  ) VALUES (
    'scoring-touchdowns',
    'How to Score in Football - Touchdowns, Field Goals & More',
    'Learn all the ways to score in football. Touchdowns, field goals, safeties, and everything in between explained simply.',
    'Kickoff Club HQ',
    'Teaching football basics without judgment or gatekeeping.',
    'general',
    'beginner',
    4,
    'free',
    true,
    3
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = EXCLUDED.is_published,
    updated_at = NOW()
  RETURNING id INTO v_course_id_3;

  -- Add lesson for Course 3
  SELECT id INTO v_course_id_3 FROM courses WHERE slug = 'scoring-touchdowns' LIMIT 1;
  IF v_course_id_3 IS NOT NULL THEN
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
    ) VALUES (
      v_course_id_3,
      'How to Score in Football - Touchdowns, Field Goals & More',
      'intro',
      'All the ways to put points on the board, explained.',
      '2F_yl0lWj40', -- YouTube video ID
      271, -- 4:31
      1,
      true,
      true
    ) ON CONFLICT (course_id, slug) DO UPDATE SET
      video_id = EXCLUDED.video_id,
      is_published = EXCLUDED.is_published,
      updated_at = NOW();
  END IF;

  RAISE NOTICE '✅ Successfully added 3 free YouTube courses!';
  RAISE NOTICE '📺 Course URLs:';
  RAISE NOTICE '   https://kickoffclubhq.com/courses/how-downs-work';
  RAISE NOTICE '   https://kickoffclubhq.com/courses/field-layout-basics';
  RAISE NOTICE '   https://kickoffclubhq.com/courses/scoring-touchdowns';
END $$;
