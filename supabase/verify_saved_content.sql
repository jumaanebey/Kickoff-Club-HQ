-- Verify saved_content table setup
-- Run this in Supabase SQL Editor to check if everything is configured correctly

-- 1. Check if table exists and view its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'saved_content'
ORDER BY ordinal_position;

-- 2. Check if indexes exist
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'saved_content';

-- 3. Check if RLS is enabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'saved_content';

-- 4. Check RLS policies
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'saved_content';

-- 5. Test the view
SELECT * FROM user_saved_content LIMIT 5;

-- If everything looks good, you're all set!
-- The error you saw just means the migration was already run.
