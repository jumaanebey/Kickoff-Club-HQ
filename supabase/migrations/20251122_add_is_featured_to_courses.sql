-- Add is_featured column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update specific courses to be featured
UPDATE courses SET is_featured = true WHERE slug IN ('football-fundamentals-101', 'quarterback-elite-training', 'defensive-schemes-explained');
