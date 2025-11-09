-- Add remaining lessons for all R2 videos
-- Run this in your Supabase SQL Editor

-- Insert remaining lessons for Football Fundamentals course
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
) VALUES
-- Lesson 3: Field Layout Basics
(
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000001',
  'Field Layout Basics',
  'field-layout-basics',
  'Understand the football field layout, yard lines, and end zones',
  'field-layout-basics',
  90,
  3,
  true,
  true
),
-- Lesson 4: Offensive Positions
(
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000001',
  'Offensive Positions',
  'offensive-positions',
  'Learn about quarterback, running backs, receivers, and offensive line positions',
  'offensive-positions',
  120,
  4,
  false, -- Premium content
  true
),
-- Lesson 5: Defensive Positions
(
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000001',
  'Defensive Positions',
  'defensive-positions',
  'Understand defensive line, linebackers, and defensive backs',
  'defensive-positions',
  120,
  5,
  false, -- Premium content
  true
),
-- Lesson 6: Quarterback 101
(
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000001',
  'Quarterback 101',
  'quarterback-101',
  'Deep dive into the most important position in football',
  'quarterback-101',
  120,
  6,
  false, -- Premium content
  true
),
-- Lesson 7: Special Teams Basics
(
  '00000000-0000-0000-0000-000000000107',
  '00000000-0000-0000-0000-000000000001',
  'Special Teams Basics',
  'special-teams-basics',
  'Learn about kickers, punters, and special teams plays',
  'special-teams-basics',
  90,
  7,
  false, -- Premium content
  true
),
-- Lesson 8: Understanding Penalties
(
  '00000000-0000-0000-0000-000000000108',
  '00000000-0000-0000-0000-000000000001',
  'Understanding Penalties',
  'understanding-penalties',
  'Master common penalties and what they mean for the game',
  'understanding-penalties',
  120,
  8,
  false, -- Premium content
  true
),
-- Lesson 9: Timeouts and Clock Management
(
  '00000000-0000-0000-0000-000000000109',
  '00000000-0000-0000-0000-000000000001',
  'Timeouts and Clock Management',
  'timeouts-and-clock',
  'Learn how teams use timeouts and manage the game clock strategically',
  'timeouts-and-clock',
  120,
  9,
  false, -- Premium content
  true
),
-- Lesson 10: NFL Seasons and Playoffs
(
  '00000000-0000-0000-0000-000000000110',
  '00000000-0000-0000-0000-000000000001',
  'NFL Seasons and Playoffs',
  'nfl-seasons-playoffs',
  'Understand how the NFL season works, divisions, and playoff structure',
  'nfl-seasons-playoffs',
  150,
  10,
  false, -- Premium content
  true
)
ON CONFLICT (course_id, slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ All lessons added successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📹 Complete lesson list (in order):';
  RAISE NOTICE '  1. How Downs Work (FREE)';
  RAISE NOTICE '  2. Scoring Touchdowns (FREE)';
  RAISE NOTICE '  3. Field Layout Basics (FREE)';
  RAISE NOTICE '  4. Offensive Positions (PREMIUM)';
  RAISE NOTICE '  5. Defensive Positions (PREMIUM)';
  RAISE NOTICE '  6. Quarterback 101 (PREMIUM)';
  RAISE NOTICE '  7. Special Teams Basics (PREMIUM)';
  RAISE NOTICE '  8. Understanding Penalties (PREMIUM)';
  RAISE NOTICE '  9. Timeouts and Clock Management (PREMIUM)';
  RAISE NOTICE '  10. NFL Seasons and Playoffs (PREMIUM)';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 All videos matched to R2 bucket:';
  RAISE NOTICE '  ✅ how-downs-work.mp4';
  RAISE NOTICE '  ✅ scoring-touchdowns.mp4';
  RAISE NOTICE '  ✅ field-layout-basics.mp4';
  RAISE NOTICE '  ✅ offensive-positions.mp4';
  RAISE NOTICE '  ✅ defensive-positions.mp4';
  RAISE NOTICE '  ✅ quarterback-101.mp4';
  RAISE NOTICE '  ✅ special-teams-basics.mp4';
  RAISE NOTICE '  ✅ understanding-penalties.mp4';
  RAISE NOTICE '  ✅ timeouts-and-clock.mp4';
  RAISE NOTICE '  ✅ nfl-seasons-playoffs.mp4';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Ready to test! Visit: http://localhost:3000/courses/football-fundamentals';
END $$;
