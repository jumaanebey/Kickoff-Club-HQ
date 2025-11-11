-- Fix course titles to be on one line
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new

UPDATE courses SET title = 'Special Teams Basics' WHERE slug = 'special-teams-basics';
UPDATE courses SET title = 'NFL Seasons and Playoffs' WHERE slug = 'nfl-seasons-playoffs';
UPDATE courses SET title = 'Defensive Positions' WHERE slug = 'defensive-positions';
UPDATE courses SET title = 'Timeouts and Clock Management' WHERE slug = 'timeouts-and-clock';
UPDATE courses SET title = 'Understanding Penalties' WHERE slug = 'understanding-penalties';

-- Verify the updates
SELECT slug, title FROM courses WHERE slug IN ('special-teams-basics', 'nfl-seasons-playoffs', 'defensive-positions', 'timeouts-and-clock', 'understanding-penalties');
