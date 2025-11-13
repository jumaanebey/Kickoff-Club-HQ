-- Add Tags and Activity Feed
-- Content tagging system and social activity feed

-- Tags table - defines available tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Hex color code
  usage_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Course tags - many-to-many relationship
CREATE TABLE course_tags (
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (course_id, tag_id)
);

-- Lesson tags - many-to-many relationship
CREATE TABLE lesson_tags (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (lesson_id, tag_id)
);

-- Activity feed - social feed of user actions
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'course_completed', 'achievement_earned', 'streak_milestone', 'review_posted'
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB, -- Additional data (course_id, achievement_id, etc.)
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  like_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activity likes - users can like activity feed items
CREATE TABLE activity_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activity_feed(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(activity_id, user_id)
);

-- User follows - social connections
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (follower_id != following_id),
  UNIQUE(follower_id, following_id)
);

-- Add follower counts to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0 NOT NULL CHECK (follower_count >= 0),
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0 NOT NULL CHECK (following_count >= 0);

-- Create indexes
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);

CREATE INDEX idx_course_tags_course ON course_tags(course_id);
CREATE INDEX idx_course_tags_tag ON course_tags(tag_id);

CREATE INDEX idx_lesson_tags_lesson ON lesson_tags(lesson_id);
CREATE INDEX idx_lesson_tags_tag ON lesson_tags(tag_id);

CREATE INDEX idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_type ON activity_feed(activity_type);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_feed_public ON activity_feed(is_public, created_at DESC);

CREATE INDEX idx_activity_likes_activity ON activity_likes(activity_id);
CREATE INDEX idx_activity_likes_user ON activity_likes(user_id);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
DECLARE
  affected_tag_id UUID;
BEGIN
  affected_tag_id := COALESCE(NEW.tag_id, OLD.tag_id);

  UPDATE tags
  SET usage_count = (
    (SELECT COUNT(*) FROM course_tags WHERE tag_id = affected_tag_id) +
    (SELECT COUNT(*) FROM lesson_tags WHERE tag_id = affected_tag_id)
  )
  WHERE id = affected_tag_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_tag_changed
  AFTER INSERT OR DELETE ON course_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

CREATE TRIGGER lesson_tag_changed
  AFTER INSERT OR DELETE ON lesson_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_tag_usage_count();

-- Function to update activity like count
CREATE OR REPLACE FUNCTION update_activity_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE activity_feed
  SET like_count = (
    SELECT COUNT(*) FROM activity_likes WHERE activity_id = COALESCE(NEW.activity_id, OLD.activity_id)
  )
  WHERE id = COALESCE(NEW.activity_id, OLD.activity_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_like_changed
  AFTER INSERT OR DELETE ON activity_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_activity_like_count();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for followed user
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    -- Increment following count for follower
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count for unfollowed user
    UPDATE profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
    -- Decrement following count for unfollower
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_follow_changed
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_counts();

-- RLS Policies
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Tags - everyone can view
CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  USING (TRUE);

-- Course/Lesson tags - everyone can view
CREATE POLICY "Anyone can view course tags"
  ON course_tags FOR SELECT
  USING (TRUE);

CREATE POLICY "Anyone can view lesson tags"
  ON lesson_tags FOR SELECT
  USING (TRUE);

-- Activity feed - public activities visible to all, private only to user/followers
CREATE POLICY "Anyone can view public activity"
  ON activity_feed FOR SELECT
  USING (
    is_public = TRUE
    OR auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM user_follows
      WHERE following_id = activity_feed.user_id AND follower_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own activity"
  ON activity_feed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON activity_feed FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity"
  ON activity_feed FOR DELETE
  USING (auth.uid() = user_id);

-- Activity likes - users can manage their own likes
CREATE POLICY "Users can view activity likes"
  ON activity_likes FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can like activities"
  ON activity_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike activities"
  ON activity_likes FOR DELETE
  USING (auth.uid() = user_id);

-- User follows - users can manage their own follows
CREATE POLICY "Anyone can view follows"
  ON user_follows FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Comments
COMMENT ON TABLE tags IS 'Tags for categorizing courses and lessons';
COMMENT ON TABLE course_tags IS 'Many-to-many: courses and tags';
COMMENT ON TABLE lesson_tags IS 'Many-to-many: lessons and tags';
COMMENT ON TABLE activity_feed IS 'Social feed of user achievements and completions';
COMMENT ON TABLE activity_likes IS 'Users can like activity feed items';
COMMENT ON TABLE user_follows IS 'Social connections between users';

-- Insert default tags
INSERT INTO tags (name, slug, description, color) VALUES
('Passing', 'passing', 'Throwing and passing techniques', '#3B82F6'),
('Defense', 'defense', 'Defensive strategies and formations', '#EF4444'),
('Offense', 'offense', 'Offensive plays and schemes', '#10B981'),
('Special Teams', 'special-teams', 'Kicking, punting, and returns', '#F59E0B'),
('Beginner Friendly', 'beginner-friendly', 'Great for newcomers', '#8B5CF6'),
('Advanced Strategy', 'advanced-strategy', 'Complex game concepts', '#EC4899'),
('Quarterback', 'quarterback', 'QB-specific content', '#06B6D4'),
('Running Back', 'running-back', 'RB techniques and drills', '#14B8A6'),
('Wide Receiver', 'wide-receiver', 'WR routes and catching', '#F97316'),
('Offensive Line', 'offensive-line', 'O-line blocking techniques', '#84CC16')
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Tags and activity feed created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ tags - Content categorization';
  RAISE NOTICE '  ✅ course_tags & lesson_tags - Tagging system';
  RAISE NOTICE '  ✅ activity_feed - Social activity stream';
  RAISE NOTICE '  ✅ activity_likes - Like activities';
  RAISE NOTICE '  ✅ user_follows - Social connections';
  RAISE NOTICE '  ✅ 10 default tags created';
  RAISE NOTICE '';
  RAISE NOTICE '🏷️ Content is now organized with tags!';
  RAISE NOTICE '📱 Users can follow each other and see activity!';
END $$;
