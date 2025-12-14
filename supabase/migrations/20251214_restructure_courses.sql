-- ============================================
-- KICKOFF CLUB HQ - Course Restructure
-- Replaces 15 fake courses with 3 real courses
-- ============================================

-- Step 1: Create the 3 new courses with fixed UUIDs
-- Using fixed UUIDs so we can reference them for lesson assignment

-- Course 1: Getting Started (FREE)
INSERT INTO courses (
    id,
    title,
    slug,
    description,
    instructor_name,
    instructor_bio,
    difficulty_level,
    tier_required,
    is_published,
    category,
    duration_minutes,
    thumbnail_url,
    order_index,
    is_featured
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'Getting Started',
    'getting-started',
    'Your first steps into football. Learn the basics - downs, scoring, and how the field works. Perfect for complete beginners. No prior knowledge needed.',
    'Kickoff Club',
    'Making football simple for everyone.',
    'beginner',
    'free',
    true,
    'general',
    15,
    '/images/courses/getting-started.jpg',
    1,
    true
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    tier_required = EXCLUDED.tier_required,
    is_published = EXCLUDED.is_published,
    order_index = EXCLUDED.order_index,
    is_featured = EXCLUDED.is_featured;

-- Course 2: Positions Explained (BASIC)
INSERT INTO courses (
    id,
    title,
    slug,
    description,
    instructor_name,
    instructor_bio,
    difficulty_level,
    tier_required,
    is_published,
    category,
    duration_minutes,
    thumbnail_url,
    order_index,
    is_featured
) VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'Positions Explained',
    'positions-explained',
    'Meet the players. Learn what each position does - offense, defense, and the quarterback. Finally understand who does what on the field.',
    'Kickoff Club',
    'Making football simple for everyone.',
    'beginner',
    'basic',
    true,
    'general',
    15,
    '/images/courses/positions-explained.jpg',
    2,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    tier_required = EXCLUDED.tier_required,
    is_published = EXCLUDED.is_published,
    order_index = EXCLUDED.order_index;

-- Course 3: Rules & Strategy (BASIC)
INSERT INTO courses (
    id,
    title,
    slug,
    description,
    instructor_name,
    instructor_bio,
    difficulty_level,
    tier_required,
    is_published,
    category,
    duration_minutes,
    thumbnail_url,
    order_index,
    is_featured
) VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'Rules & Strategy',
    'rules-and-strategy',
    'Understand the rules that matter. Penalties, special teams, clock management, and how the NFL season works. Everything you need to follow any game.',
    'Kickoff Club',
    'Making football simple for everyone.',
    'beginner',
    'basic',
    true,
    'general',
    20,
    '/images/courses/rules-strategy.jpg',
    3,
    false
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    tier_required = EXCLUDED.tier_required,
    is_published = EXCLUDED.is_published,
    order_index = EXCLUDED.order_index;


-- Step 2: Reassign lessons to new courses
-- Getting Started (FREE): How Downs Work, Scoring Touchdowns, Field Layout Basics
UPDATE lessons SET
    course_id = 'a1111111-1111-1111-1111-111111111111',
    is_free = true,
    order_index = 1
WHERE slug = 'how-downs-work';

UPDATE lessons SET
    course_id = 'a1111111-1111-1111-1111-111111111111',
    is_free = true,
    order_index = 2
WHERE slug = 'scoring-touchdowns';

UPDATE lessons SET
    course_id = 'a1111111-1111-1111-1111-111111111111',
    is_free = true,
    order_index = 3
WHERE slug = 'field-layout-basics';

-- Positions Explained (BASIC): Offensive Positions, Defensive Positions, Quarterback 101
UPDATE lessons SET
    course_id = 'b2222222-2222-2222-2222-222222222222',
    is_free = false,
    order_index = 1
WHERE slug = 'offensive-positions';

UPDATE lessons SET
    course_id = 'b2222222-2222-2222-2222-222222222222',
    is_free = false,
    order_index = 2
WHERE slug = 'defensive-positions';

UPDATE lessons SET
    course_id = 'b2222222-2222-2222-2222-222222222222',
    is_free = false,
    order_index = 3
WHERE slug = 'quarterback-101';

-- Rules & Strategy (BASIC): Penalties, Special Teams, Clock Management, NFL Seasons
UPDATE lessons SET
    course_id = 'c3333333-3333-3333-3333-333333333333',
    is_free = false,
    order_index = 1
WHERE slug = 'understanding-penalties';

UPDATE lessons SET
    course_id = 'c3333333-3333-3333-3333-333333333333',
    is_free = false,
    order_index = 2
WHERE slug = 'special-teams-basics';

UPDATE lessons SET
    course_id = 'c3333333-3333-3333-3333-333333333333',
    is_free = false,
    order_index = 3
WHERE slug = 'timeouts-and-clock';

UPDATE lessons SET
    course_id = 'c3333333-3333-3333-3333-333333333333',
    is_free = false,
    order_index = 4
WHERE slug = 'nfl-seasons-playoffs';


-- Step 3: Delete old fake courses (keep only our 3 new ones)
DELETE FROM courses
WHERE id NOT IN (
    'a1111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    'c3333333-3333-3333-3333-333333333333'
);


-- Step 4: Verify the restructure
-- Run these to confirm:
-- SELECT id, title, slug, tier_required, order_index FROM courses ORDER BY order_index;
-- SELECT l.title, l.slug, l.order_index, l.is_free, c.title as course FROM lessons l JOIN courses c ON l.course_id = c.id ORDER BY c.order_index, l.order_index;

