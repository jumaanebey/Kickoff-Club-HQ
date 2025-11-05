-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  video_id VARCHAR(255) NOT NULL, -- R2 video filename (without .mp4)
  thumbnail_url TEXT,
  duration_seconds INT,
  order_index INT NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- Create lesson script sections table
CREATE TABLE IF NOT EXISTS lesson_script_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  timestamp VARCHAR(50) NOT NULL, -- Format: "0:00-0:15"
  content TEXT NOT NULL,
  on_screen TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lesson quizzes table (simpler than full quiz system)
CREATE TABLE IF NOT EXISTS lesson_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of option strings
  correct_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT false,
  watch_time_seconds INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  quiz_answered BOOLEAN DEFAULT false,
  quiz_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Add indexes for performance
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX idx_script_sections_lesson_id ON lesson_script_sections(lesson_id);
CREATE INDEX idx_script_sections_order ON lesson_script_sections(lesson_id, order_index);
CREATE INDEX idx_lesson_quizzes_lesson_id ON lesson_quizzes(lesson_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_script_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Lessons are viewable by everyone"
  ON lessons FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for script sections
CREATE POLICY "Script sections viewable with published lesson"
  ON lesson_script_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE lessons.id = lesson_script_sections.lesson_id
      AND lessons.is_published = true
    )
  );

CREATE POLICY "Admins can manage script sections"
  ON lesson_script_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for lesson quizzes
CREATE POLICY "Quizzes viewable with published lesson"
  ON lesson_quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE lessons.id = lesson_quizzes.lesson_id
      AND lessons.is_published = true
    )
  );

CREATE POLICY "Admins can manage quizzes"
  ON lesson_quizzes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for user lesson progress
CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lesson_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for lessons
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_updated_at();

-- Trigger for user lesson progress
CREATE TRIGGER update_user_lesson_progress_updated_at
  BEFORE UPDATE ON user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_updated_at();

-- Add comments for documentation
COMMENT ON TABLE lessons IS 'Video lessons for courses';
COMMENT ON TABLE lesson_script_sections IS 'Timestamped script sections for lessons';
COMMENT ON TABLE lesson_quizzes IS 'Quick quiz questions for lessons';
COMMENT ON TABLE user_lesson_progress IS 'User progress tracking for lessons';
