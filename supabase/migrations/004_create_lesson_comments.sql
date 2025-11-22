-- Migration: Create lesson_comments table with RLS policies
-- Date: 2025-11-22
-- Description: Enables threaded comments and discussions on lessons

-- 1. Create lesson_comments table
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_lesson ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON lesson_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON lesson_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON lesson_comments(created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Anyone can view comments (public read)
CREATE POLICY "Comments are viewable by everyone"
ON lesson_comments FOR SELECT
USING (true);

-- Authenticated users can create comments (must match their user_id)
CREATE POLICY "Users can create comments"
ON lesson_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
ON lesson_comments FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own comments, admins can delete any comment
CREATE POLICY "Users can delete own comments"
ON lesson_comments FOR DELETE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 5. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lesson_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for updated_at
CREATE TRIGGER set_lesson_comments_updated_at
BEFORE UPDATE ON lesson_comments
FOR EACH ROW
EXECUTE FUNCTION update_lesson_comments_updated_at();

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'lesson_comments table created successfully with RLS policies';
END $$;
