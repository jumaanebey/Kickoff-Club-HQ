-- First, let's check what categories are allowed
SELECT 
    enumlabel as allowed_category
FROM pg_enum
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'course_category'
)
ORDER BY enumlabel;

-- Then check your existing courses
SELECT id, title, category, difficulty_level, tier_required, is_published, created_at
FROM courses
ORDER BY created_at DESC;

-- Count total courses
SELECT COUNT(*) as total_courses FROM courses;
