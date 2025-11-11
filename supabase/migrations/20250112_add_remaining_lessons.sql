-- Add remaining lessons 3-10 with correct video_ids
-- This ensures all R2 videos have corresponding database entries

-- Lesson 3: Field Layout Basics
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000001',
  'Field Layout Basics',
  'field-layout-basics',
  'Understand the football field structure, yard lines, and key areas of play',
  'field-layout-basics',
  90,
  3,
  true,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 4: Offensive Positions
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000001',
  'Offensive Positions',
  'offensive-positions',
  'Learn about the quarterback, running backs, receivers, and offensive line',
  'offensive-positions',
  90,
  4,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 5: Defensive Positions
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000001',
  'Defensive Positions',
  'defensive-positions',
  'Discover the defensive line, linebackers, cornerbacks, and safeties',
  'defensive-positions',
  90,
  5,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 6: Quarterback 101
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000001',
  'Quarterback 101',
  'quarterback-101',
  'Master the most important position - the quarterback''s role and responsibilities',
  'quarterback-101',
  90,
  6,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 7: Special Teams Basics
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000107',
  '00000000-0000-0000-0000-000000000001',
  'Special Teams Basics',
  'special-teams-basics',
  'Understand kicks, punts, field goals, and special teams strategy',
  'special-teams-basics',
  90,
  7,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 8: Understanding Penalties
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000108',
  '00000000-0000-0000-0000-000000000001',
  'Understanding Penalties',
  'understanding-penalties',
  'Learn the most common penalties, what they mean, and how they affect the game',
  'understanding-penalties',
  90,
  8,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 9: Timeouts and Clock Management
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000109',
  '00000000-0000-0000-0000-000000000001',
  'Timeouts and Clock Management',
  'timeouts-and-clock',
  'Master game clock strategy, timeouts, and time management tactics',
  'timeouts-and-clock',
  90,
  9,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Lesson 10: NFL Seasons and Playoffs
INSERT INTO lessons (
  id,
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
  '00000000-0000-0000-0000-000000000110',
  '00000000-0000-0000-0000-000000000001',
  'NFL Seasons and Playoffs',
  'nfl-seasons-playoffs',
  'Understand the NFL season structure, playoffs, and road to the Super Bowl',
  'nfl-seasons-playoffs',
  90,
  10,
  false,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ All 10 lessons now in database!';
  RAISE NOTICE '';
  RAISE NOTICE '📹 Complete lesson list with video_ids:';
  RAISE NOTICE '  1. How Downs Work (how-downs-work)';
  RAISE NOTICE '  2. Scoring Touchdowns (scoring-touchdowns)';
  RAISE NOTICE '  3. Field Layout Basics (field-layout-basics) ✨ NEW';
  RAISE NOTICE '  4. Offensive Positions (offensive-positions) ✨ NEW';
  RAISE NOTICE '  5. Defensive Positions (defensive-positions) ✨ NEW';
  RAISE NOTICE '  6. Quarterback 101 (quarterback-101) ✨ NEW';
  RAISE NOTICE '  7. Special Teams Basics (special-teams-basics) ✨ NEW';
  RAISE NOTICE '  8. Understanding Penalties (understanding-penalties) ✨ NEW';
  RAISE NOTICE '  9. Timeouts and Clock Management (timeouts-and-clock) ✨ NEW';
  RAISE NOTICE '  10. NFL Seasons and Playoffs (nfl-seasons-playoffs) ✨ NEW';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 These video_ids match your R2 bucket files (add .mp4 extension)';
  RAISE NOTICE '🎯 All lessons linked to Football Fundamentals course';
  RAISE NOTICE '🆓 Lessons 1-3 are free, rest require subscription';
END $$;
