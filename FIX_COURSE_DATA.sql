-- Fix course and lesson data for video player
-- This will work whether the data exists or not

-- First, check if course exists
DO $$
DECLARE
  course_exists BOOLEAN;
  lesson_exists BOOLEAN;
BEGIN
  -- Check if course exists
  SELECT EXISTS(
    SELECT 1 FROM courses WHERE slug = 'football-fundamentals'
  ) INTO course_exists;

  IF course_exists THEN
    RAISE NOTICE '✓ Course "football-fundamentals" already exists';
  ELSE
    RAISE NOTICE '✗ Course "football-fundamentals" does NOT exist - inserting now';

    -- Insert the course
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
      '00000000-0000-0000-0000-000000000001',
      'Football Fundamentals',
      'football-fundamentals',
      'Learn the essential concepts of football from the ground up',
      '/images/courses/football-fundamentals.jpg',
      'beginner',
      'free',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title;

    RAISE NOTICE '✓ Course inserted successfully';
  END IF;

  -- Check if lesson exists
  SELECT EXISTS(
    SELECT 1 FROM lessons WHERE slug = 'how-downs-work'
  ) INTO lesson_exists;

  IF lesson_exists THEN
    RAISE NOTICE '✓ Lesson "how-downs-work" already exists';
  ELSE
    RAISE NOTICE '✗ Lesson "how-downs-work" does NOT exist - inserting now';

    -- Insert the lesson
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
      'how-downs-work',
      90,
      1,
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      course_id = EXCLUDED.course_id;

    RAISE NOTICE '✓ Lesson inserted successfully';
  END IF;

  -- Add script sections (delete existing first to avoid duplicates)
  DELETE FROM lesson_script_sections WHERE lesson_id = '00000000-0000-0000-0000-000000000101';

  INSERT INTO lesson_script_sections (
    lesson_id,
    title,
    timestamp,
    content,
    on_screen,
    order_index
  ) VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    'What are Downs?',
    '0:00-0:15',
    'In football, a team gets 4 chances, called "downs," to move the ball 10 yards forward. Think of it like getting 4 tries to reach a goal line.',
    'Animated field showing 10-yard markers',
    0
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'First Down Explained',
    '0:15-0:30',
    'When a team successfully moves 10 yards within their 4 downs, they get a "first down" - which means they get 4 new chances to move another 10 yards. This is how teams march down the field.',
    'Yellow first down line animation',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'What Happens After 4 Downs?',
    '0:30-0:50',
    'If a team doesn''t make 10 yards after using all 4 downs, they lose possession of the ball and the other team gets to start their turn. This is called a "turnover on downs."',
    'Ball changing possession animation',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'Strategic Decisions',
    '0:50-1:15',
    'On 4th down, teams usually punt the ball away to give the opponent worse field position, or attempt a field goal if they''re close enough. Only in crucial situations do teams "go for it" on 4th down.',
    'Split screen showing punt, field goal, and going for it',
    3
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'Why Downs Matter',
    '1:15-1:30',
    'The down system is what makes football strategic. Every play decision is influenced by what down it is, how many yards are needed, and how much time is left. Understanding downs is key to understanding the game.',
    'Game clock and down indicator overlay',
    4
  );

  RAISE NOTICE '✓ Script sections inserted';

  -- Add quiz (delete existing first)
  DELETE FROM lesson_quizzes WHERE lesson_id = '00000000-0000-0000-0000-000000000101';

  INSERT INTO lesson_quizzes (
    lesson_id,
    question,
    options,
    correct_index
  ) VALUES (
    '00000000-0000-0000-0000-000000000101',
    'How many downs does a team get to advance 10 yards?',
    '["3", "4", "5", "6"]'::jsonb,
    1
  );

  RAISE NOTICE '✓ Quiz inserted';
  RAISE NOTICE '';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'SUCCESS! Course and lesson data fixed';
  RAISE NOTICE '====================================';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now visit:';
  RAISE NOTICE 'http://localhost:3000/courses/football-fundamentals/lessons/how-downs-work';
END $$;
