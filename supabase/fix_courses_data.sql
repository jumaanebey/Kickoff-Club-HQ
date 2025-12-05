-- Clean up bad data and ensure only golden courses exist
-- This script is safe to run repeatedly

-- 1. Delete courses that are NOT in our golden list (by slug)
DELETE FROM courses 
WHERE slug NOT IN (
    'football-fundamentals-101',
    'understanding-downs-distance',
    'field-positions-masterclass',
    'offensive-strategy-guide',
    'defensive-schemes-explained',
    'special-teams-third-phase',
    'quarterback-elite-training',
    'linebacker-captain-defense',
    'wide-receiver-route-tree',
    'common-penalties-explained',
    'clock-management-mastery',
    'offensive-formations-101',
    'defensive-coverages-cover-1-4',
    'history-of-football',
    'football-equipment-guide'
);

-- 2. Ensure is_featured column exists (idempotent)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_featured') THEN
        ALTER TABLE courses ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. Reset featured status
UPDATE courses SET is_featured = false;

-- 4. Set specific courses as featured
UPDATE courses 
SET is_featured = true 
WHERE slug IN (
    'football-fundamentals-101', 
    'quarterback-elite-training', 
    'defensive-schemes-explained'
);

-- 5. Verify count
SELECT count(*) as total_courses, sum(case when is_featured then 1 else 0 end) as featured_count FROM courses;
