-- Golden Seed: Ensures 15 core courses always exist
-- Run this to fix "missing courses" issues

INSERT INTO courses (
    title, 
    slug, 
    description, 
    instructor_name,
    instructor_bio,
    difficulty_level, 
    tier_required, 
    is_published,
    category,
    duration_minutes,
    thumbnail_url
) VALUES 
-- 1. Fundamentals
(
    'Football Fundamentals 101', 
    'football-fundamentals-101', 
    'Master the basics of football. Learn about downs, scoring, field positions, and game flow. Perfect for complete beginners.', 
    'Coach Mike',
    'Former college football coach with 15 years of experience teaching beginners.',
    'beginner', 
    'free', 
    true,
    'fundamentals',
    45,
    '/images/courses/fundamentals.jpg'
),
-- 2. Downs & Plays
(
    'Understanding Downs & Distance', 
    'understanding-downs-distance', 
    'Deep dive into the down system. Learn what downs are, how they work, and why they matter in football strategy.', 
    'Coach Sarah',
    'NFL analyst and football educator specializing in game mechanics.',
    'beginner', 
    'free', 
    true,
    'rules',
    30,
    '/images/courses/downs.jpg'
),
-- 3. Positions
(
    'Field Positions Masterclass', 
    'field-positions-masterclass', 
    'Learn every position on the field, their roles, and how they work together. From quarterback to defensive backs.', 
    'Coach Mike',
    'Former college football coach with 15 years of experience teaching beginners.',
    'intermediate', 
    'basic', 
    true,
    'positions',
    60,
    '/images/courses/positions.jpg'
),
-- 4. Offense
(
    'Offensive Strategy Guide', 
    'offensive-strategy-guide', 
    'Advanced offensive tactics, play calling, and strategy. Learn how teams move the ball down the field.', 
    'Coach Tony',
    'Offensive coordinator with 20 years of coaching experience.',
    'advanced', 
    'premium', 
    true,
    'strategy',
    90,
    '/images/courses/offense.jpg'
),
-- 5. Defense
(
    'Defensive Schemes Explained', 
    'defensive-schemes-explained', 
    'Understanding defensive formations, coverage schemes, and how to stop the offense.', 
    'Coach Sarah',
    'NFL analyst and football educator specializing in game mechanics.',
    'intermediate', 
    'basic', 
    true,
    'defense',
    75,
    '/images/courses/defense.jpg'
),
-- 6. Special Teams
(
    'Special Teams: The Third Phase', 
    'special-teams-third-phase', 
    'Kickoffs, punts, and field goals. Why special teams can win or lose games.', 
    'Coach Bill',
    'Special Teams Coordinator.',
    'beginner', 
    'free', 
    true,
    'fundamentals',
    40,
    '/images/courses/special-teams.jpg'
),
-- 7. Quarterback
(
    'Quarterback Elite Training', 
    'quarterback-elite-training', 
    'Reading defenses, footwork, and throwing mechanics.', 
    'Coach Tony',
    'Offensive coordinator.',
    'advanced', 
    'premium', 
    true,
    'positions',
    120,
    '/images/courses/qb.jpg'
),
-- 8. Linebacker
(
    'Linebacker: Captain of Defense', 
    'linebacker-captain-defense', 
    'Run stopping, pass coverage, and leadership on defense.', 
    'Coach Ray',
    'Hall of Fame Linebacker.',
    'intermediate', 
    'basic', 
    true,
    'positions',
    55,
    '/images/courses/lb.jpg'
),
-- 9. Wide Receiver
(
    'Wide Receiver Route Tree', 
    'wide-receiver-route-tree', 
    'Master the route tree: Slant, Post, Corner, Fly, and more.', 
    'Coach Jerry',
    'WR Coach.',
    'intermediate', 
    'basic', 
    true,
    'positions',
    50,
    '/images/courses/wr.jpg'
),
-- 10. Penalties
(
    'Common Penalties Explained', 
    'common-penalties-explained', 
    'Holding, Offside, Pass Interference. What they mean and the signals referees use.', 
    'Ref Tom',
    'Senior Official.',
    'beginner', 
    'free', 
    true,
    'rules',
    35,
    '/images/courses/penalties.jpg'
),
-- 11. Clock Management
(
    'Clock Management Mastery', 
    'clock-management-mastery', 
    'When to call timeouts, the two-minute drill, and spiking the ball.', 
    'Coach Tony',
    'Offensive Coordinator.',
    'advanced', 
    'premium', 
    true,
    'strategy',
    45,
    '/images/courses/clock.jpg'
),
-- 12. Formations
(
    'Offensive Formations 101', 
    'offensive-formations-101', 
    'I-Formation, Shotgun, Pistol, Spread. Learn the setups.', 
    'Coach Mike',
    'Former College Coach.',
    'intermediate', 
    'basic', 
    true,
    'strategy',
    60,
    '/images/courses/formations.jpg'
),
-- 13. Coverages
(
    'Defensive Coverages: Cover 1-4', 
    'defensive-coverages-cover-1-4', 
    'Zone vs Man. Cover 1, 2, 3, and 4 explained simply.', 
    'Coach Sarah',
    'NFL Analyst.',
    'advanced', 
    'premium', 
    true,
    'defense',
    80,
    '/images/courses/coverages.jpg'
),
-- 14. History
(
    'History of Football', 
    'history-of-football', 
    'From the early days to the modern NFL. How the game evolved.', 
    'Historian Dan',
    'Football Historian.',
    'beginner', 
    'free', 
    true,
    'fundamentals',
    90,
    '/images/courses/history.jpg'
),
-- 15. Equipment
(
    'Football Equipment Guide', 
    'football-equipment-guide', 
    'Helmets, pads, cleats. What players wear and why.', 
    'Equipment Mgr Joe',
    'Pro Equipment Manager.',
    'beginner', 
    'free', 
    true,
    'fundamentals',
    25,
    '/images/courses/equipment.jpg'
)
ON CONFLICT (slug) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    instructor_name = EXCLUDED.instructor_name,
    difficulty_level = EXCLUDED.difficulty_level,
    tier_required = EXCLUDED.tier_required,
    is_published = EXCLUDED.is_published,
    category = EXCLUDED.category,
    duration_minutes = EXCLUDED.duration_minutes;
