-- Add Lesson Quizzes Feature
-- Allows instructors to add quiz questions to lessons and track user performance

-- Quiz questions table - stores questions for each lesson
CREATE TABLE lesson_quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  points INTEGER DEFAULT 1 NOT NULL CHECK (points > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Quiz answer options - stores multiple choice options for each question
CREATE TABLE lesson_quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES lesson_quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE NOT NULL,
  explanation TEXT, -- Optional: explains why this answer is correct/incorrect
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User quiz attempts - tracks when users take quizzes
CREATE TABLE lesson_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0 NOT NULL,
  max_score INTEGER DEFAULT 0 NOT NULL,
  percentage INTEGER DEFAULT 0 NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  passed BOOLEAN DEFAULT FALSE NOT NULL, -- TRUE if score >= 70%
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id) -- Users can only have one attempt per lesson
);

-- User quiz answers - stores individual question answers
CREATE TABLE lesson_quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES lesson_quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES lesson_quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES lesson_quiz_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN DEFAULT FALSE NOT NULL,
  points_earned INTEGER DEFAULT 0 NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_quiz_questions_lesson_id ON lesson_quiz_questions(lesson_id);
CREATE INDEX idx_quiz_questions_order ON lesson_quiz_questions(lesson_id, order_index);

CREATE INDEX idx_quiz_options_question_id ON lesson_quiz_options(question_id);
CREATE INDEX idx_quiz_options_order ON lesson_quiz_options(question_id, order_index);

CREATE INDEX idx_quiz_attempts_user_id ON lesson_quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_lesson_id ON lesson_quiz_attempts(lesson_id);
CREATE INDEX idx_quiz_attempts_passed ON lesson_quiz_attempts(passed);

CREATE INDEX idx_quiz_answers_attempt_id ON lesson_quiz_answers(attempt_id);
CREATE INDEX idx_quiz_answers_question_id ON lesson_quiz_answers(question_id);

-- Triggers for updated_at timestamp
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON lesson_quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate quiz attempt score and percentage
CREATE OR REPLACE FUNCTION calculate_quiz_score()
RETURNS TRIGGER AS $$
DECLARE
  total_score INTEGER;
  max_possible INTEGER;
  pass_threshold INTEGER;
BEGIN
  -- Calculate total score from all answers
  SELECT COALESCE(SUM(points_earned), 0) INTO total_score
  FROM lesson_quiz_answers
  WHERE attempt_id = NEW.id;

  -- Calculate max possible score
  SELECT COALESCE(SUM(points), 0) INTO max_possible
  FROM lesson_quiz_questions
  WHERE lesson_id = NEW.lesson_id;

  -- Update attempt with calculated values
  NEW.score := total_score;
  NEW.max_score := max_possible;

  -- Calculate percentage (avoid division by zero)
  IF max_possible > 0 THEN
    NEW.percentage := (total_score * 100) / max_possible;
  ELSE
    NEW.percentage := 0;
  END IF;

  -- Passing grade is 70%
  NEW.passed := NEW.percentage >= 70;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_attempt_score_updated
  BEFORE INSERT OR UPDATE ON lesson_quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_quiz_score();

-- Row Level Security (RLS) Policies

-- Enable RLS on all quiz tables
ALTER TABLE lesson_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quiz_answers ENABLE ROW LEVEL SECURITY;

-- Quiz questions and options - anyone can view for published lessons
CREATE POLICY "Anyone can view quiz questions for published lessons"
  ON lesson_quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE id = lesson_quiz_questions.lesson_id
        AND is_published = TRUE
    )
  );

CREATE POLICY "Anyone can view quiz options for published lessons"
  ON lesson_quiz_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM lesson_quiz_questions q
      JOIN lessons l ON l.id = q.lesson_id
      WHERE q.id = lesson_quiz_options.question_id
        AND l.is_published = TRUE
    )
  );

-- Quiz attempts - users can view and create their own attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON lesson_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz attempts"
  ON lesson_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz attempts"
  ON lesson_quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz answers - users can view and create their own answers
CREATE POLICY "Users can view their own quiz answers"
  ON lesson_quiz_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lesson_quiz_attempts
      WHERE id = lesson_quiz_answers.attempt_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own quiz answers"
  ON lesson_quiz_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lesson_quiz_attempts
      WHERE id = lesson_quiz_answers.attempt_id
        AND user_id = auth.uid()
    )
  );

-- Comments for documentation
COMMENT ON TABLE lesson_quiz_questions IS 'Quiz questions for each lesson';
COMMENT ON TABLE lesson_quiz_options IS 'Multiple choice options for quiz questions';
COMMENT ON TABLE lesson_quiz_attempts IS 'User attempts at lesson quizzes';
COMMENT ON TABLE lesson_quiz_answers IS 'Individual answers for each quiz attempt';

COMMENT ON COLUMN lesson_quiz_attempts.passed IS 'TRUE if score >= 70%';
COMMENT ON COLUMN lesson_quiz_options.is_correct IS 'Marks the correct answer option';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Lesson quiz tables created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New tables:';
  RAISE NOTICE '  ✅ lesson_quiz_questions - Quiz questions per lesson';
  RAISE NOTICE '  ✅ lesson_quiz_options - Multiple choice options';
  RAISE NOTICE '  ✅ lesson_quiz_attempts - User quiz attempts (70%% to pass)';
  RAISE NOTICE '  ✅ lesson_quiz_answers - Individual question answers';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Users need 70%% or higher to pass lesson quizzes!';
END $$;
