-- Fix all course descriptions to remove newlines
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/zejensivaohvtkzufdou/sql/new

UPDATE courses SET description = 'Master the fundamental concept of football: 4 downs to gain 10 yards. This is the strategy engine that makes football unique. Learn why this simple rule creates infinite complexity and excitement.' WHERE slug = 'how-downs-work';

UPDATE courses SET description = 'Learn how teams score the most points in football. Understand touchdowns, extra points, two-point conversions, and what it takes to put points on the board.' WHERE slug = 'scoring-touchdowns';

UPDATE courses SET description = 'Understand the football field structure, yard lines, and key areas of play. Learn to read the field like a pro and never be confused about field position again.' WHERE slug = 'field-layout-basics';

UPDATE courses SET description = 'Learn about the quarterback, running backs, receivers, and offensive line. Understand what each position does and how they work together to move the ball.' WHERE slug = 'offensive-positions';

UPDATE courses SET description = 'Master defensive line, linebackers, cornerbacks, and safeties. Learn how each position stops the offense and creates turnovers.' WHERE slug = 'defensive-positions';

UPDATE courses SET description = 'The most important position in football - what quarterbacks do and why they matter. Learn proper footwork, throwing mechanics, and reading defenses.' WHERE slug = 'quarterback-101';

UPDATE courses SET description = 'The third phase of football. Learn kicking, punting, returns, and coverage. Understand how special teams win championships.' WHERE slug = 'special-teams-basics';

UPDATE courses SET description = 'Master game clock strategy, timeouts, and time management tactics. Learn how coaches manipulate the clock to win games.' WHERE slug = 'timeouts-and-clock';

UPDATE courses SET description = 'Never be confused by a flag again. Learn all major penalties, why they are called, and how they impact the game. Includes real game examples.' WHERE slug = 'understanding-penalties';

UPDATE courses SET description = 'Understand how the NFL season works, playoff seeding, Super Bowl path, and what it takes to win a championship. Perfect for new fans.' WHERE slug = 'nfl-seasons-playoffs';

-- Verify all updates
SELECT slug, title, description FROM courses ORDER BY order_index;
