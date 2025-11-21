-- Update all course thumbnail URLs
-- Run this in Supabase SQL Editor

UPDATE courses SET thumbnail_url = '/images/courses/how-downs-work.png' WHERE slug = 'how-downs-work';
UPDATE courses SET thumbnail_url = '/images/courses/scoring-touchdowns.png' WHERE slug = 'scoring-touchdowns';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.png' WHERE slug = 'field-layout-basics';
UPDATE courses SET thumbnail_url = '/images/courses/offensive-positions.jpg' WHERE slug = 'offensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/defensive-positions.jpg' WHERE slug = 'defensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/quarterback-fundamentals.png' WHERE slug = 'quarterback-101';
UPDATE courses SET thumbnail_url = '/images/courses/special-teams-mastery.png' WHERE slug = 'special-teams-basics';
UPDATE courses SET thumbnail_url = '/images/courses/timeouts-and-clock.jpg' WHERE slug = 'timeouts-and-clock';
UPDATE courses SET thumbnail_url = '/images/courses/understanding-penalties.png' WHERE slug = 'understanding-penalties';
UPDATE courses SET thumbnail_url = '/images/courses/nfl-seasons-playoffs.png' WHERE slug = 'nfl-seasons-playoffs';

-- Verify the updates
SELECT slug, title, thumbnail_url FROM courses ORDER BY order_index;
