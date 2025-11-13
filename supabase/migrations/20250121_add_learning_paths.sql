-- Add Learning Paths
-- Curated course sequences to guide user learning journeys

-- Learning paths table - defines structured learning tracks
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  difficulty_level difficulty_level NOT NULL,
  estimated_hours INTEGER DEFAULT 0 NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  enrolled_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Learning path courses - courses in each path
CREATE TABLE learning_path_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_required BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(learning_path_id, course_id)
);

-- User learning paths - tracks user enrollment in paths
CREATE TABLE user_learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_course_id UUID REFERENCES courses(id),
  UNIQUE(user_id, learning_path_id)
);

-- Course prerequisites - require courses before advanced ones
CREATE TABLE course_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  prerequisite_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (course_id != prerequisite_course_id),
  UNIQUE(course_id, prerequisite_course_id)
);

-- Create indexes
CREATE INDEX idx_learning_paths_published ON learning_paths(is_published);
CREATE INDEX idx_learning_paths_slug ON learning_paths(slug);
CREATE INDEX idx_learning_paths_order ON learning_paths(order_index);

CREATE INDEX idx_learning_path_courses_path_id ON learning_path_courses(learning_path_id);
CREATE INDEX idx_learning_path_courses_course_id ON learning_path_courses(course_id);
CREATE INDEX idx_learning_path_courses_order ON learning_path_courses(learning_path_id, order_index);

CREATE INDEX idx_user_learning_paths_user_id ON user_learning_paths(user_id);
CREATE INDEX idx_user_learning_paths_path_id ON user_learning_paths(learning_path_id);

CREATE INDEX idx_course_prerequisites_course ON course_prerequisites(course_id);
CREATE INDEX idx_course_prerequisites_prereq ON course_prerequisites(prerequisite_course_id);

-- Triggers
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment path enrollment count
CREATE OR REPLACE FUNCTION increment_path_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE learning_paths
  SET enrolled_count = enrolled_count + 1
  WHERE id = NEW.learning_path_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER path_enrollment_created AFTER INSERT ON user_learning_paths
  FOR EACH ROW EXECUTE FUNCTION increment_path_enrollment();

-- RLS Policies
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published learning paths"
  ON learning_paths FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Anyone can view learning path courses"
  ON learning_path_courses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM learning_paths WHERE id = learning_path_courses.learning_path_id AND is_published = TRUE)
  );

CREATE POLICY "Users can view their own learning path enrollments"
  ON user_learning_paths FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in learning paths"
  ON user_learning_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own path progress"
  ON user_learning_paths FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view course prerequisites"
  ON course_prerequisites FOR SELECT
  USING (TRUE);

-- Comments
COMMENT ON TABLE learning_paths IS 'Curated learning tracks (e.g., QB Fundamentals Track)';
COMMENT ON TABLE learning_path_courses IS 'Courses included in each learning path';
COMMENT ON TABLE user_learning_paths IS 'User enrollment and progress in learning paths';
COMMENT ON TABLE course_prerequisites IS 'Required courses before accessing advanced courses';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Learning paths created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ learning_paths - Curated course sequences';
  RAISE NOTICE '  ✅ learning_path_courses - Courses in each path';
  RAISE NOTICE '  ✅ user_learning_paths - User path enrollment/progress';
  RAISE NOTICE '  ✅ course_prerequisites - Course requirements';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Guide users through structured learning journeys!';
END $$;
