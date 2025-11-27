-- Add courses to production database
-- Copy and paste this into your Supabase SQL Editor

INSERT INTO courses (
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
    thumbnail_url
) VALUES 
-- 1. Football Fundamentals -> general
(
    'Football Fundamentals',
    'football-fundamentals',
    'Master the basics of football. Learn about downs, scoring, field positions, and game flow. Perfect for complete beginners.',
    'Coach Mike',
    'Former college football coach with 15 years of experience teaching beginners.',
    'beginner',
    'free',
    true,
    'general',
    45,
    '/images/courses/fundamentals.jpg'
),
-- 2. Understanding Downs -> general
(
    'Understanding Downs & Plays',
    'understanding-downs-plays',
    'Deep dive into the down system. Learn what downs are, how they work, and why they matter in football strategy.',
    'Coach Sarah',
    'NFL analyst and football educator specializing in game mechanics.',
    'beginner',
    'free',
    true,
    'general',
    30,
    '/images/courses/downs.jpg'
),
-- 3. Field Positions -> general
(
    'Field Positions Explained',
    'field-positions-explained',
    'Learn every position on the field, their roles, and how they work together. From quarterback to defensive backs.',
    'Coach Mike',
    'Former college football coach with 15 years of experience teaching beginners.',
    'intermediate',
    'basic',
    true,
    'general',
    60,
    '/images/courses/positions.jpg'
),
-- 4. Offensive Strategies -> general
(
    'Offensive Strategies',
    'offensive-strategies',
    'Advanced offensive tactics, play calling, and strategy. Learn how teams move the ball down the field.',
    'Coach Tony',
    'Offensive coordinator with 20 years of coaching experience.',
    'advanced',
    'premium',
    true,
    'general',
    90,
    '/images/courses/offense.jpg'
),
-- 5. Defensive Fundamentals -> defense
(
    'Defensive Fundamentals',
    'defensive-fundamentals',
    'Understanding defensive formations, coverage schemes, and how to stop the offense.',
    'Coach Sarah',
    'NFL analyst and football educator specializing in game mechanics.',
    'intermediate',
    'basic',
    true,
    'defense',
    75,
    '/images/courses/defense.jpg'
);

-- Verify courses were added
SELECT id, title, difficulty_level, tier_required, is_published 
FROM courses 
ORDER BY created_at DESC 
LIMIT 5;
