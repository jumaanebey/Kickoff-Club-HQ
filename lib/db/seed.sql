-- Seed Data for Kickoff Club HQ
-- Sample courses to get started

-- Insert sample courses
INSERT INTO courses (title, slug, description, category, difficulty_level, duration_minutes, tier_required, instructor_name, instructor_bio, is_published, order_index) VALUES

('How Downs Work', 'how-downs-work', 'Master the fundamental concept of football: 4 downs to gain 10 yards. This is the strategy engine that makes football unique. Learn why this simple rule creates infinite complexity and excitement.', 'general', 'beginner', 12, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 1),

('Field Layout & Scoring', 'field-layout-scoring', 'Understand the football field, end zones, and how teams score points. Learn about touchdowns, field goals, extra points, and two-point conversions. Essential knowledge for every fan.', 'general', 'beginner', 10, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 2),

('Quarterback Fundamentals', 'quarterback-fundamentals', 'Dive deep into the QB position. Learn proper footwork, throwing mechanics, reading defenses, and making pre-snap adjustments. Become the field general your team needs.', 'quarterback', 'intermediate', 25, 'basic', 'Coach Jake Morrison', 'Former NFL QB and QB coach', true, 3),

('Wide Receiver Routes', 'wide-receiver-routes', 'Master the route tree. Learn how to run crisp routes, create separation, and become a reliable target. Includes drills you can practice at home.', 'wide_receiver', 'beginner', 20, 'basic', 'Coach DeAndre Thompson', '8-year NFL receiver veteran', true, 4),

('Running Back Techniques', 'running-back-techniques', 'Learn vision, patience, and explosion. Understand gap schemes, pass protection, and how to be a dual-threat back. Film study included.', 'running_back', 'intermediate', 22, 'basic', 'Coach Terrell Davis', 'Former Pro Bowl running back', true, 5),

('Defensive Line Fundamentals', 'defensive-line-fundamentals', 'Master the trenches. Learn hand placement, leverage, gap responsibility, and pass rush moves. Dominate the line of scrimmage.', 'defense', 'intermediate', 24, 'premium', 'Coach Michael Strahan', '15-year NFL defensive end', true, 6),

('Linebacker Reads & Reactions', 'linebacker-reads-reactions', 'The QB of the defense. Learn to read offensive formations, fill gaps, and make plays sideline to sideline. Advanced defensive concepts.', 'defense', 'advanced', 28, 'premium', 'Coach Ray Lewis', 'NFL Hall of Fame linebacker', true, 7),

('Understanding Penalties', 'understanding-penalties', 'Never be confused by a flag again. Learn all major penalties, why they&apos;re called, and how they impact the game. Includes real game examples.', 'general', 'beginner', 15, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 8),

('Special Teams Mastery', 'special-teams-mastery', 'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.', 'special_teams', 'intermediate', 18, 'basic', 'Coach Justin Tucker', 'All-Pro NFL kicker', true, 9),

('NFL Seasons & Playoffs', 'nfl-seasons-playoffs', 'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship. Perfect for new fans.', 'general', 'beginner', 12, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 10);

-- Sample lessons for first course (How Downs Work)
INSERT INTO lessons (course_id, title, slug, description, video_url, video_duration_seconds, order_index, is_published)
SELECT
  c.id,
  'Introduction to Downs',
  'introduction-to-downs',
  'Learn the basic concept of downs and why it matters',
  'https://example.com/video1.mp4',
  420,
  1,
  true
FROM courses c WHERE c.slug = 'how-downs-work';

INSERT INTO lessons (course_id, title, slug, description, video_url, video_duration_seconds, order_index, is_published)
SELECT
  c.id,
  'The 10-Yard Rule',
  'ten-yard-rule',
  'Why 10 yards? How it creates strategy',
  'https://example.com/video2.mp4',
  360,
  2,
  true
FROM courses c WHERE c.slug = 'how-downs-work';

-- Add comments
COMMENT ON TABLE courses IS 'Contains all sample courses for testing';
