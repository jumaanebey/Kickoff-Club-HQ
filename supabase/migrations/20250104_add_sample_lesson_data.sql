-- Sample lesson data for "How Downs Work" lesson
-- This assumes you already have a course created

-- First, let's create a sample course if it doesn't exist
INSERT INTO courses (
  id,
  title,
  slug,
  description,
  thumbnail_url,
  difficulty_level,
  tier,
  is_published
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Use a fixed UUID for easy reference
  'Football Fundamentals',
  'football-fundamentals',
  'Learn the essential concepts of football from the ground up',
  '/images/courses/football-fundamentals.jpg',
  'beginner',
  'free',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Insert the "How Downs Work" lesson
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
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001',
  'How Downs Work',
  'how-downs-work',
  'Master the most important concept in football - the down system that drives every play',
  'how-downs-work', -- This matches the R2 filename: how-downs-work.mp4
  90, -- 90 seconds
  1,
  true, -- This is a free lesson
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Insert script sections for "How Downs Work"
INSERT INTO lesson_script_sections (
  lesson_id,
  title,
  timestamp,
  content,
  on_screen,
  order_index
) VALUES
-- Section 1
(
  '00000000-0000-0000-0000-000000000101',
  'What are Downs?',
  '0:00-0:15',
  'In football, a team gets 4 chances, called "downs," to move the ball 10 yards forward. Think of it like getting 4 tries to reach a goal line.',
  'Animated field showing 10-yard markers',
  0
),
-- Section 2
(
  '00000000-0000-0000-0000-000000000101',
  'First Down Explained',
  '0:15-0:30',
  'When a team successfully moves 10 yards within their 4 downs, they get a "first down" - which means they get 4 new chances to move another 10 yards. This is how teams march down the field.',
  'Yellow first down line animation',
  1
),
-- Section 3
(
  '00000000-0000-0000-0000-000000000101',
  'What Happens After 4 Downs?',
  '0:30-0:50',
  'If a team doesn''t make 10 yards after using all 4 downs, they lose possession of the ball and the other team gets to start their turn. This is called a "turnover on downs."',
  'Ball changing possession animation',
  2
),
-- Section 4
(
  '00000000-0000-0000-0000-000000000101',
  'Strategic Decisions',
  '0:50-1:15',
  'On 4th down, teams usually punt the ball away to give the opponent worse field position, or attempt a field goal if they''re close enough. Only in crucial situations do teams "go for it" on 4th down.',
  'Split screen showing punt, field goal, and going for it',
  3
),
-- Section 5
(
  '00000000-0000-0000-0000-000000000101',
  'Why Downs Matter',
  '1:15-1:30',
  'The down system is what makes football strategic. Every play decision is influenced by what down it is, how many yards are needed, and how much time is left. Understanding downs is key to understanding the game.',
  'Game clock and down indicator overlay',
  4
);

-- Insert quiz for "How Downs Work"
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000101',
  'How many downs does a team get to advance 10 yards?',
  '["3", "4", "5", "6"]'::jsonb,
  1 -- Index 1 = "4"
) ON CONFLICT DO NOTHING;

-- Insert a second sample lesson for completeness
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
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000001',
  'Scoring Touchdowns',
  'scoring-touchdowns',
  'Learn how teams score the most points in football',
  'scoring-touchdowns',
  90,
  2,
  true,
  true
) ON CONFLICT (course_id, slug) DO NOTHING;

-- Script sections for "Scoring Touchdowns"
INSERT INTO lesson_script_sections (
  lesson_id,
  title,
  timestamp,
  content,
  on_screen,
  order_index
) VALUES
(
  '00000000-0000-0000-0000-000000000102',
  'What is a Touchdown?',
  '0:00-0:20',
  'A touchdown is worth 6 points and happens when a player carries the ball into the end zone or catches a pass in the end zone. It''s the most exciting and valuable scoring play in football.',
  'Player crossing goal line into end zone',
  0
),
(
  '00000000-0000-0000-0000-000000000102',
  'The Extra Point Decision',
  '0:20-0:45',
  'After a touchdown, teams get a bonus chance to score more points. They can kick an extra point for 1 point (easy) or try a 2-point conversion by running or passing into the end zone again (harder but worth more).',
  'Kicker lining up for PAT',
  1
),
(
  '00000000-0000-0000-0000-000000000102',
  'Touchdown Celebrations',
  '0:45-1:00',
  'Touchdown celebrations are a huge part of football culture. Players can celebrate as a team, but excessive celebrations that delay the game or show disrespect can result in penalties.',
  'Various touchdown celebration clips',
  2
),
(
  '00000000-0000-0000-0000-000000000102',
  'Touchdown Review',
  '1:00-1:30',
  'In close calls, referees can review whether a touchdown actually occurred. The ball must cross the goal line while the player has possession. Even if only the tip of the ball breaks the plane of the goal line, it''s a touchdown!',
  'Referee review screen showing goal line camera',
  3
);

-- Quiz for "Scoring Touchdowns"
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000102',
  'How many points is a touchdown worth?',
  '["3", "6", "7", "8"]'::jsonb,
  1 -- Index 1 = "6"
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Sample lesson data inserted successfully!';
  RAISE NOTICE '📹 Lessons created:';
  RAISE NOTICE '  1. How Downs Work (video_id: how-downs-work)';
  RAISE NOTICE '  2. Scoring Touchdowns (video_id: scoring-touchdowns)';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Make sure these videos exist in your R2 bucket:';
  RAISE NOTICE '  - how-downs-work.mp4';
  RAISE NOTICE '  - scoring-touchdowns.mp4';
END $$;
