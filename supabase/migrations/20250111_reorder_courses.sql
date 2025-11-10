-- Reorder courses to make "How Downs Work" first
-- and ensure all free courses are beginner level

-- First, reset all order indices to make room
UPDATE courses SET order_index = order_index + 100;

-- Set "How Downs Work" to order_index 1 (first position)
UPDATE courses
SET order_index = 1,
    difficulty_level = 'beginner'
WHERE slug = 'how-downs-work';

-- Set "Field Layout & Scoring" to order_index 2
UPDATE courses
SET order_index = 2,
    difficulty_level = 'beginner'
WHERE slug = 'field-layout-scoring';

-- Set "NFL Seasons & Playoffs" to order_index 3
UPDATE courses
SET order_index = 3,
    difficulty_level = 'beginner'
WHERE slug = 'nfl-seasons-playoffs';

-- Reorder remaining courses starting from index 4
-- (keeping their relative order but starting after the free courses)
WITH ordered_courses AS (
  SELECT id, slug,
         ROW_NUMBER() OVER (ORDER BY order_index) + 3 as new_order
  FROM courses
  WHERE order_index > 100
)
UPDATE courses c
SET order_index = oc.new_order
FROM ordered_courses oc
WHERE c.id = oc.id;

-- Ensure all tier_required='free' courses are marked as beginner
UPDATE courses
SET difficulty_level = 'beginner'
WHERE tier_required = 'free';

-- Verify the changes
SELECT title, slug, order_index, difficulty_level, tier_required
FROM courses
ORDER BY order_index
LIMIT 10;
