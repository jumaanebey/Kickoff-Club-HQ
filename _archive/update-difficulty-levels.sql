-- Move premium courses from beginner to intermediate
UPDATE courses
SET difficulty_level = 'intermediate'
WHERE difficulty_level = 'beginner'
AND tier_required = 'premium';

-- Move all intermediate courses to advanced
UPDATE courses
SET difficulty_level = 'advanced'
WHERE difficulty_level = 'intermediate';
