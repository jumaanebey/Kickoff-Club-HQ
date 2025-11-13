-- Add Discussion System
-- Lesson comments with threading, replies, and likes

-- Lesson comments table - parent comments on lessons
CREATE TABLE lesson_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE NOT NULL, -- Instructors can pin important comments
  is_edited BOOLEAN DEFAULT FALSE NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  reply_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment replies table - threaded replies to comments
CREATE TABLE comment_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES lesson_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment likes table - users can like comments and replies
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES lesson_comments(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES comment_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (
    (comment_id IS NOT NULL AND reply_id IS NULL) OR
    (comment_id IS NULL AND reply_id IS NOT NULL)
  ),
  UNIQUE(user_id, comment_id),
  UNIQUE(user_id, reply_id)
);

-- Create indexes for performance
CREATE INDEX idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX idx_lesson_comments_user_id ON lesson_comments(user_id);
CREATE INDEX idx_lesson_comments_created ON lesson_comments(created_at DESC);
CREATE INDEX idx_lesson_comments_pinned ON lesson_comments(is_pinned, lesson_id);

CREATE INDEX idx_comment_replies_comment_id ON comment_replies(comment_id);
CREATE INDEX idx_comment_replies_user_id ON comment_replies(user_id);
CREATE INDEX idx_comment_replies_created ON comment_replies(created_at ASC);

CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_reply_id ON comment_likes(reply_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_lesson_comments_updated_at BEFORE UPDATE ON lesson_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comment_replies_updated_at BEFORE UPDATE ON comment_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update comment like count
  IF NEW.comment_id IS NOT NULL OR OLD.comment_id IS NOT NULL THEN
    UPDATE lesson_comments
    SET like_count = (
      SELECT COUNT(*) FROM comment_likes WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id)
    )
    WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  END IF;

  -- Update reply like count
  IF NEW.reply_id IS NOT NULL OR OLD.reply_id IS NOT NULL THEN
    UPDATE comment_replies
    SET like_count = (
      SELECT COUNT(*) FROM comment_likes WHERE reply_id = COALESCE(NEW.reply_id, OLD.reply_id)
    )
    WHERE id = COALESCE(NEW.reply_id, OLD.reply_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_changed
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_like_count();

-- Function to update reply count on comment
CREATE OR REPLACE FUNCTION update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lesson_comments
  SET reply_count = (
    SELECT COUNT(*) FROM comment_replies WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id)
  )
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_reply_changed
  AFTER INSERT OR DELETE ON comment_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reply_count();

-- Row Level Security (RLS) Policies

ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Comments - anyone can view, authenticated users can create
CREATE POLICY "Anyone can view lesson comments"
  ON lesson_comments FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create comments"
  ON lesson_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON lesson_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON lesson_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Replies - anyone can view, authenticated users can create
CREATE POLICY "Anyone can view comment replies"
  ON comment_replies FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create replies"
  ON comment_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies"
  ON comment_replies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies"
  ON comment_replies FOR DELETE
  USING (auth.uid() = user_id);

-- Likes - users can manage their own likes
CREATE POLICY "Users can view their own likes"
  ON comment_likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create likes"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE lesson_comments IS 'Discussion comments on lessons';
COMMENT ON TABLE comment_replies IS 'Threaded replies to comments';
COMMENT ON TABLE comment_likes IS 'User likes on comments and replies';
COMMENT ON COLUMN lesson_comments.is_pinned IS 'Instructors can pin important comments';
COMMENT ON COLUMN lesson_comments.is_edited IS 'Tracks if comment was edited after posting';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Discussion system created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ lesson_comments - Discussion comments on lessons';
  RAISE NOTICE '  ✅ comment_replies - Threaded reply system';
  RAISE NOTICE '  ✅ comment_likes - Like comments and replies';
  RAISE NOTICE '  ✅ Automatic like/reply count tracking';
  RAISE NOTICE '';
  RAISE NOTICE '💬 Students can now discuss lessons!';
END $$;
