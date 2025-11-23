-- Add 10 lessons to Football Fundamentals 101 course
-- This creates the lesson structure for the 10 videos

-- First, get the course ID for Football Fundamentals 101
DO $$
DECLARE
  v_course_id UUID;
BEGIN
  -- Get the course ID
  SELECT id INTO v_course_id
  FROM courses
  WHERE slug = 'football-fundamentals-101'
  LIMIT 1;

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course "football-fundamentals-101" not found!';
  END IF;

  -- Lesson 1: How Downs Work (HAS VIDEO)
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'How Downs Work',
    'how-downs-work',
    'The foundation of football - understanding the down system and how teams advance the ball',
    '/videos/how-downs-work.mp4',
    'how-downs-work',
    60,
    1,
    true,
    true
  ) ON CONFLICT (course_id, slug) DO UPDATE SET
    video_url = EXCLUDED.video_url,
    is_published = EXCLUDED.is_published;

  -- Lesson 2: Scoring Touchdowns
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Scoring Touchdowns',
    'scoring-touchdowns',
    'Learn how teams score the most exciting plays in football - the touchdown and what happens after',
    NULL,
    'scoring-touchdowns',
    90,
    2,
    true,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 3: Field Layout Basics
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Field Layout Basics',
    'field-layout-basics',
    'Understanding the football field - yard lines, end zones, and where everything happens',
    NULL,
    'field-layout-basics',
    120,
    3,
    true,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 4: Offensive Positions
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Offensive Positions',
    'offensive-positions',
    'Meet the offensive players - quarterbacks, running backs, receivers, and the offensive line',
    NULL,
    'offensive-positions',
    180,
    4,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 5: Defensive Positions
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Defensive Positions',
    'defensive-positions',
    'Understanding defensive players - linemen, linebackers, and defensive backs',
    NULL,
    'defensive-positions',
    180,
    5,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 6: Understanding Penalties
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Understanding Penalties',
    'understanding-penalties',
    'Common penalties explained - holding, offsides, pass interference and what those flags mean',
    NULL,
    'understanding-penalties',
    150,
    6,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 7: Special Teams Basics
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Special Teams Basics',
    'special-teams-basics',
    'Kickoffs, punts, field goals - understanding the third phase of football',
    NULL,
    'special-teams-basics',
    120,
    7,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 8: Timeouts and Clock Management
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Timeouts and Clock Management',
    'timeouts-and-clock',
    'How the game clock works, timeouts, and why clock management matters in crucial moments',
    NULL,
    'timeouts-and-clock',
    150,
    8,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 9: NFL Seasons and Playoffs
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'NFL Seasons and Playoffs',
    'nfl-seasons-playoffs',
    'Regular season, playoffs, and the road to the Super Bowl - understanding the NFL structure',
    NULL,
    'nfl-seasons-playoffs',
    180,
    9,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  -- Lesson 10: Quarterback 101
  INSERT INTO lessons (
    course_id, title, slug, description, video_url, video_id,
    duration_seconds, order_index, is_free, is_published
  ) VALUES (
    v_course_id,
    'Quarterback 101',
    'quarterback-101',
    'The most important position in football - what quarterbacks do and why they matter',
    NULL,
    'quarterback-101',
    120,
    10,
    false,
    true
  ) ON CONFLICT (course_id, slug) DO NOTHING;

  RAISE NOTICE '✅ Successfully added 10 lessons to Football Fundamentals 101!';
  RAISE NOTICE '📹 Lesson 1 (How Downs Work) has video: /videos/how-downs-work.mp4';
  RAISE NOTICE '🆓 Free lessons: 3 (lessons 1-3)';
  RAISE NOTICE '🔒 Premium lessons: 7 (lessons 4-10)';
END $$;
