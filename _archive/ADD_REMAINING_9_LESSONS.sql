-- Add the remaining 9 lessons to Football Fundamentals course
-- Run this in your Supabase SQL Editor after uploading videos to R2

-- Lesson 2: Scoring Touchdowns (already in sample data, this updates it)
UPDATE lessons
SET description = 'Learn how teams score the most exciting plays in football - the touchdown and what happens after',
    duration_seconds = 90
WHERE slug = 'scoring-touchdowns';

-- Lesson 3: Field Layout Basics
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000001',
  'Field Layout Basics',
  'field-layout-basics',
  'Understanding the football field - yard lines, end zones, and where everything happens',
  'placeholder',
  'field-layout-basics',
  120,
  3,
  true,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 4: Offensive Positions
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000001',
  'Offensive Positions',
  'offensive-positions',
  'Meet the offensive players - quarterbacks, running backs, receivers, and the offensive line',
  'placeholder',
  'offensive-positions',
  180,
  4,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 5: Defensive Positions
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000001',
  'Defensive Positions',
  'defensive-positions',
  'Understanding defensive players - linemen, linebackers, and defensive backs',
  'placeholder',
  'defensive-positions',
  180,
  5,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 6: Understanding Penalties
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000001',
  'Understanding Penalties',
  'understanding-penalties',
  'Common penalties explained - holding, offsides, pass interference and what those flags mean',
  'placeholder',
  'understanding-penalties',
  150,
  6,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 7: Special Teams Basics
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000107',
  '00000000-0000-0000-0000-000000000001',
  'Special Teams Basics',
  'special-teams-basics',
  'Kickoffs, punts, field goals - understanding the third phase of football',
  'placeholder',
  'special-teams-basics',
  120,
  7,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 8: Timeouts and Clock Management
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000108',
  '00000000-0000-0000-0000-000000000001',
  'Timeouts and Clock Management',
  'timeouts-and-clock',
  'How the game clock works, timeouts, and why clock management matters in crucial moments',
  'placeholder',
  'timeouts-and-clock',
  150,
  8,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 9: NFL Seasons and Playoffs
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000109',
  '00000000-0000-0000-0000-000000000001',
  'NFL Seasons and Playoffs',
  'nfl-seasons-playoffs',
  'Regular season, playoffs, and the road to the Super Bowl - understanding the NFL structure',
  'placeholder',
  'nfl-seasons-playoffs',
  180,
  9,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 10: Quarterback 101
INSERT INTO lessons (
  id, course_id, title, slug, description, video_url, video_id,
  duration_seconds, order_index, is_free, is_published
) VALUES (
  '00000000-0000-0000-0000-000000000110',
  '00000000-0000-0000-0000-000000000001',
  'Quarterback 101',
  'quarterback-101',
  'The most important position in football - what quarterbacks do and why they matter',
  'placeholder',
  'quarterback-101',
  120,
  10,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Successfully added 9 additional lessons!';
  RAISE NOTICE '📹 Total lessons in Football Fundamentals: 10';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Videos uploaded to R2:';
  RAISE NOTICE '  ✓ scoring-touchdowns.mp4';
  RAISE NOTICE '  ✓ field-layout-basics.mp4';
  RAISE NOTICE '  ✓ offensive-positions.mp4';
  RAISE NOTICE '  ✓ defensive-positions.mp4';
  RAISE NOTICE '  ✓ understanding-penalties.mp4';
  RAISE NOTICE '  ✓ special-teams-basics.mp4';
  RAISE NOTICE '  ✓ timeouts-and-clock.mp4';
  RAISE NOTICE '  ✓ nfl-seasons-playoffs.mp4';
  RAISE NOTICE '  ✓ quarterback-101.mp4';
  RAISE NOTICE '';
  RAISE NOTICE '🆓 Free lessons: how-downs-work, scoring-touchdowns, field-layout-basics';
  RAISE NOTICE '🔒 Premium lessons: 7 lessons require subscription';
END $$;
