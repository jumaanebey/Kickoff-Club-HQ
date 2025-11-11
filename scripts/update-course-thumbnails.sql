-- Update course thumbnails to match available images
-- Run this in Supabase SQL Editor

UPDATE courses SET thumbnail_url = '/images/courses/how-downs-work.png' WHERE slug = 'how-downs-work';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.png' WHERE slug = 'scoring-touchdowns';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.png' WHERE slug = 'field-layout-basics';
UPDATE courses SET thumbnail_url = '/images/courses/quarterback-fundamentals.png' WHERE slug = 'offensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/defensive-line-fundamentals.png' WHERE slug = 'defensive-positions';
UPDATE courses SET thumbnail_url = '/images/courses/quarterback-fundamentals.png' WHERE slug = 'quarterback-101';
UPDATE courses SET thumbnail_url = '/images/courses/special-teams-mastery.png' WHERE slug = 'special-teams-basics';
UPDATE courses SET thumbnail_url = '/images/courses/field-layout-scoring.png' WHERE slug = 'timeouts-and-clock';
UPDATE courses SET thumbnail_url = '/images/courses/understanding-penalties.png' WHERE slug = 'understanding-penalties';
UPDATE courses SET thumbnail_url = '/images/courses/nfl-seasons-playoffs.png' WHERE slug = 'nfl-seasons-playoffs';
