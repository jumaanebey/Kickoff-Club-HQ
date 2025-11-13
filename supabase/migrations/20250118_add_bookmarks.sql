-- Add Bookmarks and Favorites Feature
-- Allows users to bookmark specific moments in videos and favorite courses

-- Lesson bookmarks table - save specific timestamps in lessons
CREATE TABLE lesson_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  timestamp_seconds INTEGER NOT NULL CHECK (timestamp_seconds >= 0),
  title VARCHAR(255), -- Optional: user's title for this bookmark
  note TEXT, -- Optional: user's notes about this moment
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Course favorites table - users can favorite courses for quick access
CREATE TABLE course_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, course_id) -- One favorite per user per course
);

-- Create indexes for better query performance
CREATE INDEX idx_lesson_bookmarks_user_id ON lesson_bookmarks(user_id);
CREATE INDEX idx_lesson_bookmarks_lesson_id ON lesson_bookmarks(lesson_id);
CREATE INDEX idx_lesson_bookmarks_created ON lesson_bookmarks(created_at DESC);

CREATE INDEX idx_course_favorites_user_id ON course_favorites(user_id);
CREATE INDEX idx_course_favorites_course_id ON course_favorites(course_id);
CREATE INDEX idx_course_favorites_created ON course_favorites(created_at DESC);

-- Trigger for updated_at timestamp on bookmarks
CREATE TRIGGER update_lesson_bookmarks_updated_at BEFORE UPDATE ON lesson_bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on bookmark tables
ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_favorites ENABLE ROW LEVEL SECURITY;

-- Lesson bookmarks - users can only manage their own bookmarks
CREATE POLICY "Users can view their own lesson bookmarks"
  ON lesson_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson bookmarks"
  ON lesson_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson bookmarks"
  ON lesson_bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lesson bookmarks"
  ON lesson_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Course favorites - users can only manage their own favorites
CREATE POLICY "Users can view their own course favorites"
  ON course_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own course favorites"
  ON course_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own course favorites"
  ON course_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE lesson_bookmarks IS 'User bookmarks for specific video timestamps with optional notes';
COMMENT ON TABLE course_favorites IS 'User favorite courses for quick access';
COMMENT ON COLUMN lesson_bookmarks.timestamp_seconds IS 'Video timestamp in seconds where bookmark was created';
COMMENT ON COLUMN lesson_bookmarks.title IS 'Optional user-provided title for the bookmark';
COMMENT ON COLUMN lesson_bookmarks.note IS 'Optional user notes about this specific moment';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Bookmarks and favorites created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ lesson_bookmarks - Save specific video moments with notes';
  RAISE NOTICE '  ✅ course_favorites - Favorite courses for quick access';
  RAISE NOTICE '';
  RAISE NOTICE '🔖 Users can now bookmark key moments in videos!';
END $$;
