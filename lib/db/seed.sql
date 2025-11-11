-- Seed Data for Kickoff Club HQ
-- 10 Courses matching R2 videos (1-10 in order)
-- Courses 1-3: Beginner & Free
-- Courses 4-10: Intermediate/Advanced & Premium

-- Delete existing sample data
DELETE FROM lessons;
DELETE FROM courses;

-- Insert 10 courses matching R2 videos
INSERT INTO courses (title, slug, description, category, difficulty_level, duration_minutes, tier_required, instructor_name, instructor_bio, is_published, order_index) VALUES

-- BEGINNER & FREE (Courses 1-3)
('How Downs Work', 'how-downs-work', 'Master the fundamental concept of football: 4 downs to gain 10 yards. This is the strategy engine that makes football unique. Learn why this simple rule creates infinite complexity and excitement.', 'general', 'beginner', 7, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 1),

('Scoring Touchdowns', 'scoring-touchdowns', 'Learn how teams score the most points in football. Understand touchdowns, extra points, two-point conversions, and what it takes to put points on the board.', 'general', 'beginner', 10, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 2),

('Field Layout Basics', 'field-layout-basics', 'Understand the football field structure, yard lines, and key areas of play. Learn to read the field like a pro and never be confused about field position again.', 'general', 'beginner', 10, 'free', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 3),

-- INTERMEDIATE & PREMIUM (Courses 4-10)
('Offensive Positions', 'offensive-positions', 'Learn about the quarterback, running backs, receivers, and offensive line. Understand what each position does and how they work together to move the ball.', 'general', 'intermediate', 25, 'premium', 'Coach Jake Morrison', 'Former NFL offensive coordinator', true, 4),

('Defensive Positions', 'defensive-positions', 'Master defensive line, linebackers, cornerbacks, and safeties. Learn how each position stops the offense and creates turnovers.', 'defense', 'intermediate', 20, 'premium', 'Coach Michael Strahan', '15-year NFL defensive end', true, 5),

('Quarterback 101', 'quarterback-101', 'The most important position in football - what quarterbacks do and why they matter. Learn proper footwork, throwing mechanics, and reading defenses.', 'quarterback', 'intermediate', 25, 'premium', 'Coach Tom Brady', 'NFL Hall of Fame QB', true, 6),

('Special Teams Basics', 'special-teams-basics', 'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.', 'special_teams', 'intermediate', 18, 'premium', 'Coach Justin Tucker', 'All-Pro NFL kicker', true, 7),

('Timeouts and Clock Management', 'timeouts-and-clock', 'Master game clock strategy, timeouts, and time management tactics. Learn how coaches manipulate the clock to win games.', 'general', 'intermediate', 15, 'premium', 'Coach Bill Belichick', 'Legendary NFL head coach', true, 8),

('Understanding Penalties', 'understanding-penalties', 'Never be confused by a flag again. Learn all major penalties, why they are called, and how they impact the game. Includes real game examples.', 'general', 'intermediate', 12, 'premium', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 9),

('NFL Seasons and Playoffs', 'nfl-seasons-playoffs', 'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship. Perfect for new fans.', 'general', 'intermediate', 12, 'premium', 'Coach Marcus Williams', 'Former college QB with 10+ years coaching experience', true, 10);

-- Insert ONE lesson per course (the video from R2)
INSERT INTO lessons (course_id, title, slug, description, video_id, duration_seconds, order_index, is_published)
SELECT c.id, c.title, c.slug, c.description, c.slug, c.duration_minutes * 60, 1, true
FROM courses c
ORDER BY c.order_index;

-- Add comments
COMMENT ON TABLE courses IS 'Contains all 10 courses matching R2 videos';
COMMENT ON TABLE lessons IS 'Each course has one video lesson from R2 bucket';
