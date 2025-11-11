-- Add quizzes for all 10 lessons
-- Uses slug lookups to find lesson IDs dynamically

-- Quiz 1: How Downs Work
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'What is the main objective in football downs?',
  '["Score a touchdown on every play", "Gain 10 yards in 4 downs to get a new set of downs", "Keep possession for as long as possible", "Prevent the other team from scoring"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'how-downs-work'
ON CONFLICT DO NOTHING;

-- Quiz 2: Scoring Touchdowns
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'How many points is a touchdown worth?',
  '["3 points", "6 points", "7 points", "8 points"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'scoring-touchdowns'
ON CONFLICT DO NOTHING;

-- Quiz 3: Field Layout Basics
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'How long is a standard football field from end zone to end zone?',
  '["100 yards", "120 yards", "80 yards", "110 yards"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'field-layout-basics'
ON CONFLICT DO NOTHING;

-- Quiz 4: Offensive Positions
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'Which position is responsible for calling plays and throwing passes?',
  '["Running Back", "Quarterback", "Wide Receiver", "Center"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'offensive-positions'
ON CONFLICT DO NOTHING;

-- Quiz 5: Defensive Positions
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'What is the primary role of the defensive line?',
  '["Cover receivers", "Rush the quarterback and stop the run", "Return kicks", "Call the plays"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'defensive-positions'
ON CONFLICT DO NOTHING;

-- Quiz 6: Quarterback 101
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'What does a quarterback do during the "snap"?',
  '["Throws the ball immediately", "Receives the ball from the center to start the play", "Kicks the ball", "Tackles the defender"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'quarterback-101'
ON CONFLICT DO NOTHING;

-- Quiz 7: Special Teams Basics
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'When does a team typically use their punter?',
  '["On 4th down to kick the ball away", "After scoring a touchdown", "On 1st down", "During kickoff"]'::jsonb,
  0
FROM lessons l
WHERE l.slug = 'special-teams-basics'
ON CONFLICT DO NOTHING;

-- Quiz 8: Understanding Penalties
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'What happens when an offensive player commits a "false start"?',
  '["The play continues", "5-yard penalty against offense", "Automatic first down", "Touchdown is awarded"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'understanding-penalties'
ON CONFLICT DO NOTHING;

-- Quiz 9: Timeouts and Clock Management
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'How many timeouts does each team get per half?',
  '["2", "3", "4", "5"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'timeouts-and-clock'
ON CONFLICT DO NOTHING;

-- Quiz 10: NFL Seasons and Playoffs
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
)
SELECT
  l.id,
  'What is the championship game of the NFL called?',
  '["The Finals", "Super Bowl", "Championship Bowl", "NFL Cup"]'::jsonb,
  1
FROM lessons l
WHERE l.slug = 'nfl-seasons-playoffs'
ON CONFLICT DO NOTHING;

-- Success message
DO $$
DECLARE
  quiz_count INT;
BEGIN
  SELECT COUNT(*) INTO quiz_count FROM lesson_quizzes;

  RAISE NOTICE '✅ All lesson quizzes added successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Total quizzes in database: %', quiz_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Quiz list:';
  RAISE NOTICE '  1. How Downs Work - What is the main objective?';
  RAISE NOTICE '  2. Scoring Touchdowns - How many points is a TD?';
  RAISE NOTICE '  3. Field Layout Basics - How long is the field?';
  RAISE NOTICE '  4. Offensive Positions - Who throws passes?';
  RAISE NOTICE '  5. Defensive Positions - What does D-line do?';
  RAISE NOTICE '  6. Quarterback 101 - What happens at snap?';
  RAISE NOTICE '  7. Special Teams - When to punt?';
  RAISE NOTICE '  8. Understanding Penalties - False start penalty?';
  RAISE NOTICE '  9. Timeouts - How many per half?';
  RAISE NOTICE '  10. NFL Seasons - Championship game name?';
  RAISE NOTICE '';
  RAISE NOTICE '🎮 Quizzes appear 5 seconds before video ends';
END $$;
