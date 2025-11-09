-- Add featured columns to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_order INTEGER;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured, featured_order) WHERE is_featured = true;

-- Example: Mark first 4 courses as featured (you can change these IDs in Supabase dashboard)
-- UPDATE courses SET is_featured = true, featured_order = 1 WHERE slug = 'qb-fundamentals';
-- UPDATE courses SET is_featured = true, featured_order = 2 WHERE slug = 'wr-routes';
-- UPDATE courses SET is_featured = true, featured_order = 3 WHERE slug = 'defensive-basics';
-- UPDATE courses SET is_featured = true, featured_order = 4 WHERE slug = 'rb-vision';
