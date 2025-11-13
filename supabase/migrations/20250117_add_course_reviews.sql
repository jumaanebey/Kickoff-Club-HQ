-- Add Course Reviews and Ratings Feature
-- Allows users to rate and review courses they've completed

-- Course reviews table - stores user ratings and reviews
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  is_verified_completion BOOLEAN DEFAULT FALSE NOT NULL, -- TRUE if user completed the course
  helpful_count INTEGER DEFAULT 0 NOT NULL, -- How many users found this helpful
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, course_id) -- One review per user per course
);

-- Review helpfulness tracking - users can mark reviews as helpful
CREATE TABLE review_helpfulness (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES course_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL, -- TRUE = helpful, FALSE = not helpful
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(review_id, user_id) -- One vote per user per review
);

-- Add average rating and review count to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (average_rating >= 0 AND average_rating <= 5),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0 NOT NULL CHECK (review_count >= 0);

-- Create indexes for better query performance
CREATE INDEX idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX idx_course_reviews_user_id ON course_reviews(user_id);
CREATE INDEX idx_course_reviews_rating ON course_reviews(rating);
CREATE INDEX idx_course_reviews_created ON course_reviews(created_at DESC);
CREATE INDEX idx_course_reviews_helpful ON course_reviews(helpful_count DESC);

CREATE INDEX idx_review_helpfulness_review_id ON review_helpfulness(review_id);
CREATE INDEX idx_review_helpfulness_user_id ON review_helpfulness(user_id);

CREATE INDEX idx_courses_average_rating ON courses(average_rating DESC);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_course_reviews_updated_at BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user completed the course before reviewing
CREATE OR REPLACE FUNCTION check_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has completed the course
  NEW.is_verified_completion := EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = NEW.user_id
      AND course_id = NEW.course_id
      AND completed_at IS NOT NULL
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verify_completion_before_review
  BEFORE INSERT OR UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_course_completion();

-- Function to update course average rating and review count
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3,2);
  total_reviews INTEGER;
BEGIN
  -- Calculate average rating for the course
  SELECT
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM course_reviews
  WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);

  -- Update the courses table
  UPDATE courses
  SET
    average_rating = avg_rating,
    review_count = total_reviews
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_review_created
  AFTER INSERT ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

CREATE TRIGGER course_review_updated
  AFTER UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

CREATE TRIGGER course_review_deleted
  AFTER DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

-- Function to update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
DECLARE
  helpful_total INTEGER;
BEGIN
  -- Count how many users marked this review as helpful
  SELECT COUNT(*) INTO helpful_total
  FROM review_helpfulness
  WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    AND is_helpful = TRUE;

  -- Update the review
  UPDATE course_reviews
  SET helpful_count = helpful_total
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_helpfulness_changed
  AFTER INSERT OR UPDATE OR DELETE ON review_helpfulness
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Row Level Security (RLS) Policies

-- Enable RLS on review tables
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;

-- Course reviews - anyone can view, users can create/update their own
CREATE POLICY "Anyone can view course reviews"
  ON course_reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create their own course reviews"
  ON course_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course reviews"
  ON course_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own course reviews"
  ON course_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Review helpfulness - users can view and manage their own votes
CREATE POLICY "Anyone can view review helpfulness counts"
  ON review_helpfulness FOR SELECT
  USING (TRUE);

CREATE POLICY "Users can create their own helpfulness votes"
  ON review_helpfulness FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own helpfulness votes"
  ON review_helpfulness FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own helpfulness votes"
  ON review_helpfulness FOR DELETE
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE course_reviews IS 'User ratings and reviews for courses';
COMMENT ON TABLE review_helpfulness IS 'Tracks which users found reviews helpful';
COMMENT ON COLUMN course_reviews.is_verified_completion IS 'TRUE if user completed the course before reviewing';
COMMENT ON COLUMN course_reviews.helpful_count IS 'Number of users who found this review helpful';
COMMENT ON COLUMN courses.average_rating IS 'Average rating from all course reviews (0.00 to 5.00)';
COMMENT ON COLUMN courses.review_count IS 'Total number of reviews for this course';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Course reviews and ratings created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'New features:';
  RAISE NOTICE '  ✅ course_reviews - Users can rate and review courses';
  RAISE NOTICE '  ✅ review_helpfulness - Users can mark reviews as helpful';
  RAISE NOTICE '  ✅ average_rating column added to courses table';
  RAISE NOTICE '  ✅ review_count column added to courses table';
  RAISE NOTICE '  ✅ Automatic verification of course completion';
  RAISE NOTICE '';
  RAISE NOTICE '⭐ Users can rate courses 1-5 stars!';
END $$;
