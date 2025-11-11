-- Update all course thumbnails to .jpg format
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new

UPDATE courses SET thumbnail_url = '/images/courses/how-downs-work.jpg' WHERE slug = 'how-downs-work';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.jpg' WHERE slug = 'scoring-touchdowns';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.jpg' WHERE slug = 'field-layout-basics';
UPDATE courses SET thumbnail_url = '/images/courses/quarterback-fundamentals.jpg' WHERE slug = 'offensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/defensive-line-fundamentals.jpg' WHERE slug = 'defensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/quarterback-fundamentals.jpg' WHERE slug = 'quarterback-101';
UPDATE courses SET thumbnail_url = '/images/courses/special-teams-mastery.jpg' WHERE slug = 'special-teams-basics';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.jpg' WHERE slug = 'timeouts-and-clock';
UPDATE courses SET thumbnail_url = '/images/courses/understanding-penalties.jpg' WHERE slug = 'understanding-penalties';
UPDATE courses SET thumbnail_url = '/images/courses/nfl-seasons-playoffs.jpg' WHERE slug = 'nfl-seasons-playoffs';

-- Verify the updates
SELECT slug, title, thumbnail_url FROM courses ORDER BY order_index;
