-- Fix ALL missing columns in one go
-- Run this in Supabase SQL Editor

-- Fix courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- Fix lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS video_id TEXT;

-- Fix knowledge_point_transactions table
ALTER TABLE knowledge_point_transactions
ADD COLUMN IF NOT EXISTS reason TEXT;

-- All done!
