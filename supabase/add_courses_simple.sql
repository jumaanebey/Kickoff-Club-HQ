-- Add courses WITHOUT category field (simpler version)
-- Run this in Supabase SQL Editor

INSERT INTO courses (
    title, 
    slug, 
    description, 
    instructor_name,
    instructor_bio,
    difficulty_level, 
    tier_required, 
    is_published,
    duration_minutes
) VALUES 
(
    'Football Fundamentals', 
    'football-fundamentals', 
    'Master the basics of football. Learn about downs, scoring, field positions, and game flow. Perfect for complete beginners.', 
    'Coach Mike',
    'Former college football coach with 15 years of experience.',
    'beginner', 
    'free', 
    true,
    45
),
(
    'Understanding Downs & Plays', 
    'understanding-downs-plays', 
    'Deep dive into the down system. Learn what downs are, how they work, and why they matter.', 
    'Coach Sarah',
    'NFL analyst and football educator.',
    'beginner', 
    'free', 
    true,
    30
),
(
    'Field Positions Explained', 
    'field-positions-explained', 
    'Learn every position on the field, their roles, and how they work together.', 
    'Coach Mike',
    'Former college football coach with 15 years of experience.',
    'intermediate', 
    'basic', 
    true,
    60
),
(
    'Offensive Strategies', 
    'offensive-strategies', 
    'Advanced offensive tactics, play calling, and strategy.', 
    'Coach Tony',
    'Offensive coordinator with 20 years of coaching experience.',
    'advanced', 
    'premium', 
    true,
    90
),
(
    'Defensive Fundamentals', 
    'defensive-fundamentals', 
    'Understanding defensive formations, coverage schemes, and how to stop the offense.', 
    'Coach Sarah',
    'NFL analyst and football educator.',
    'intermediate', 
    'basic', 
    true,
    75
);

-- Verify they were added
SELECT id, title, difficulty_level, tier_required, is_published 
FROM courses 
ORDER BY created_at DESC 
LIMIT 10;
