-- Fix lessons table schema for existing databases
-- This adds missing columns from the schema consolidation

-- Add video_id column if it doesn't exist (primary video identifier)
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_id VARCHAR(255);

-- Add is_free column if it doesn't exist (allows free access without subscription)
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT FALSE;

-- Make video_url nullable (it was NOT NULL before, which caused errors)
ALTER TABLE lessons
ALTER COLUMN video_url DROP NOT NULL;

-- Rename video_duration_seconds to duration_seconds if old column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lessons' AND column_name = 'video_duration_seconds'
  ) THEN
    ALTER TABLE lessons RENAME COLUMN video_duration_seconds TO duration_seconds;
  END IF;
END $$;

-- Add duration_seconds if neither column exists
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;

-- Add role column to profiles if it doesn't exist (required by RLS policies)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' NOT NULL;

-- For existing lessons, set video_id from video_url if video_id is null
UPDATE lessons
SET video_id = video_url
WHERE video_id IS NULL AND video_url IS NOT NULL;

-- Make video_id NOT NULL after populating it
ALTER TABLE lessons
ALTER COLUMN video_id SET NOT NULL;

-- Add comment
COMMENT ON COLUMN lessons.video_id IS 'Primary video identifier for R2/YouTube lookup';
COMMENT ON COLUMN lessons.video_url IS 'Optional: direct URL or same as video_id';
COMMENT ON COLUMN lessons.is_free IS 'Allows free access to lesson without premium subscription';
COMMENT ON COLUMN profiles.role IS 'User role: user, admin, etc. Used by RLS policies';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Lessons table schema updated successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes applied:';
  RAISE NOTICE '  ✅ Added video_id column (primary identifier)';
  RAISE NOTICE '  ✅ Added is_free column (free lesson flag)';
  RAISE NOTICE '  ✅ Made video_url nullable';
  RAISE NOTICE '  ✅ Standardized to duration_seconds column';
  RAISE NOTICE '  ✅ Added role column to profiles';
  RAISE NOTICE '';
  RAISE NOTICE '🎬 Your existing lessons will continue to work!';
END $$;
