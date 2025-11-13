-- Add one lesson to each course that doesn't have lessons yet
-- This will make all courses visible on the courses page with clickable videos

-- 1. Field Layout & Scoring
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '168567b2-538e-45f6-beab-17bb1de9761a', -- Field Layout & Scoring course
  'Field Layout & Scoring',
  'field-layout-scoring',
  'Understand the football field, end zones, and how teams score points. Learn about touchdowns, field goals, extra points, and two-point conversions.',
  'field-layout-basics',
  600, -- 10 minutes
  1,
  true,
  true
);

-- 2. Wide Receiver Routes
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '4b271bd6-056e-42a1-8fca-d1eecfbd7269', -- Wide Receiver Routes course
  'Wide Receiver Routes',
  'wide-receiver-routes',
  'Master the route tree. Learn how to run crisp routes, create separation, and become a reliable target.',
  'offensive-positions',
  1200, -- 20 minutes
  1,
  true,
  false
);

-- 3. Quarterback Fundamentals
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '0b0dbcfd-fad1-42c2-9165-a980897760dd', -- Quarterback Fundamentals course
  'Quarterback 101',
  'quarterback-101',
  'The most important position in football - what quarterbacks do and why they matter. Learn proper footwork, throwing mechanics, and reading defenses.',
  'quarterback-101',
  1500, -- 25 minutes
  1,
  true,
  false
);

-- 4. Running Back Techniques
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '3536be67-d663-4b85-9948-71ef71bc3946', -- Running Back Techniques course
  'Running Back Techniques',
  'running-back-techniques',
  'Learn vision, patience, and explosion. Understand gap schemes, pass protection, and how to be a dual-threat back.',
  'offensive-positions',
  1320, -- 22 minutes
  1,
  true,
  false
);

-- 5. Defensive Line Fundamentals
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '8678dfcf-8c58-4742-a266-9a0881793298', -- Defensive Line Fundamentals course
  'Defensive Line Fundamentals',
  'defensive-line-fundamentals',
  'Master the trenches. Learn hand placement, leverage, gap responsibility, and pass rush moves. Dominate the line of scrimmage.',
  'defensive-positions',
  1440, -- 24 minutes
  1,
  true,
  false
);

-- 6. Linebacker Reads & Reactions
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  'eab823f0-d976-4ac5-804b-0e881bc8988e', -- Linebacker Reads & Reactions course
  'Linebacker Reads & Reactions',
  'linebacker-reads-reactions',
  'The QB of the defense. Learn to read offensive formations, fill gaps, and make plays sideline to sideline.',
  'defensive-positions',
  1680, -- 28 minutes
  1,
  true,
  false
);

-- 7. Understanding Penalties
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  'ceed2e16-ab68-4bf6-8b43-3165be55a9d3', -- Understanding Penalties course
  'Understanding Penalties',
  'understanding-penalties',
  'Never be confused by a flag again. Learn all major penalties, why they are called, and how they impact the game.',
  'understanding-penalties',
  900, -- 15 minutes
  1,
  true,
  true
);

-- 8. Special Teams Mastery
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '14bf90da-fa1f-4abd-80b5-fc707ad7df8c', -- Special Teams Mastery course
  'Special Teams Basics',
  'special-teams-basics',
  'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.',
  'special-teams-basics',
  1080, -- 18 minutes
  1,
  true,
  false
);

-- 9. NFL Seasons & Playoffs
INSERT INTO lessons (
  id,
  course_id,
  title,
  slug,
  description,
  video_id,
  duration_seconds,
  order_index,
  is_published,
  is_free
) VALUES (
  gen_random_uuid(),
  '8fef89e5-5b5a-4ea8-9eb7-7f2e76923043', -- NFL Seasons & Playoffs course
  'NFL Seasons & Playoffs',
  'nfl-seasons-playoffs',
  'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship.',
  'nfl-seasons-playoffs',
  720, -- 12 minutes
  1,
  true,
  true
);
