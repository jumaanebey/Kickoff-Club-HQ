-- First, let's see what we have currently
SELECT title, difficulty_level, tier_required
FROM courses
ORDER BY difficulty_level, tier_required;

-- If you want to proceed with the updates, run these:

-- Step 1: Move premium courses from beginner to intermediate
-- UPDATE courses
-- SET difficulty_level = 'intermediate'
-- WHERE difficulty_level = 'beginner'
-- AND tier_required = 'premium';

-- Step 2: Move all intermediate courses to advanced
-- UPDATE courses
-- SET difficulty_level = 'advanced'
-- WHERE difficulty_level = 'intermediate';
