-- ============================================
-- POPULATE LESSONS FOR PRODUCTION DATABASE
-- ============================================
-- Run this SQL in your Supabase SQL Editor to add lesson data
-- This will create the "How Downs Work" course and its first lesson

-- Step 1: Get the course_id for "how-downs-work" course
DO $$
DECLARE
  v_course_id UUID;
  v_lesson_id UUID;
BEGIN
  -- Find the existing course
  SELECT id INTO v_course_id FROM courses WHERE slug = 'how-downs-work' LIMIT 1;

  IF v_course_id IS NULL THEN
    RAISE NOTICE '❌ Course "how-downs-work" not found! Please create the course first.';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Found course: %', v_course_id;

  -- Generate a UUID for the lesson (we'll use this specific ID)
  v_lesson_id := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid;

  -- Insert the first lesson: "Introduction to Downs"
  INSERT INTO lessons (
    id,
    course_id,
    title,
    slug,
    description,
    video_id,
    video_url,
    thumbnail_url,
    duration_seconds,
    order_index,
    is_free,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    v_lesson_id,
    v_course_id,
    'Introduction to Downs',
    'introduction-to-downs',
    'Learn the basic concept of downs and why it matters in football. Understand why teams get 4 chances to move 10 yards and what happens if they succeed or fail.',
    'introduction-to-downs', -- This should match your video filename in R2/Cloudflare
    'https://placeholder-video-url.com/introduction-to-downs.mp4', -- Placeholder until you upload actual video
    '/images/lessons/introduction-to-downs.jpg',
    420, -- 7 minutes
    1,
    true, -- FREE LESSON - anyone can watch
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_free = EXCLUDED.is_free,
    is_published = EXCLUDED.is_published,
    updated_at = NOW();

  RAISE NOTICE '✅ Lesson created with ID: %', v_lesson_id;
  RAISE NOTICE '🔗 Use this URL for Watch Free Lesson button:';
  RAISE NOTICE '   /courses/how-downs-work/lessons/%', v_lesson_id;

  -- Insert lesson 2: The 10-Yard Rule
  INSERT INTO lessons (
    id,
    course_id,
    title,
    slug,
    description,
    video_id,
    video_url,
    duration_seconds,
    order_index,
    is_free,
    is_published
  ) VALUES (
    gen_random_uuid(),
    v_course_id,
    'The 10-Yard Rule',
    'ten-yard-rule',
    'Discover why 10 yards is the magic number in football and how it creates strategic decisions on every play.',
    'ten-yard-rule',
    'https://placeholder-video-url.com/ten-yard-rule.mp4',
    360, -- 6 minutes
    2,
    true,
    true
  )
  ON CONFLICT (course_id, slug) DO NOTHING;

  -- Insert lesson 3: What Happens on 4th Down
  INSERT INTO lessons (
    id,
    course_id,
    title,
    slug,
    description,
    video_id,
    video_url,
    duration_seconds,
    order_index,
    is_free,
    is_published
  ) VALUES (
    gen_random_uuid(),
    v_course_id,
    'What Happens on 4th Down',
    'fourth-down-decisions',
    'Learn about the critical decisions teams make on 4th down: punt, go for it, or kick a field goal.',
    'fourth-down-decisions',
    'https://placeholder-video-url.com/fourth-down-decisions.mp4',
    480, -- 8 minutes
    3,
    false, -- Premium lesson
    true
  )
  ON CONFLICT (course_id, slug) DO NOTHING;

  RAISE NOTICE '';
  RAISE NOTICE '========================';
  RAISE NOTICE '✅ SUCCESS! 3 lessons created for "How Downs Work" course';
  RAISE NOTICE '========================';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Steps:';
  RAISE NOTICE '1. Copy the lesson UUID above';
  RAISE NOTICE '2. Update hero-section.tsx to use: /courses/how-downs-work/lessons/a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  RAISE NOTICE '3. Upload videos to your R2/Cloudflare storage with matching video_ids';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Videos needed:';
  RAISE NOTICE '   - introduction-to-downs.mp4 (FREE)';
  RAISE NOTICE '   - ten-yard-rule.mp4 (FREE)';
  RAISE NOTICE '   - fourth-down-decisions.mp4 (PREMIUM)';
END $$;

-- Verify the lessons were created
SELECT
  l.id,
  l.title,
  l.slug,
  l.is_free,
  l.order_index,
  c.title as course_title
FROM lessons l
JOIN courses c ON c.id = l.course_id
WHERE c.slug = 'how-downs-work'
ORDER BY l.order_index;
