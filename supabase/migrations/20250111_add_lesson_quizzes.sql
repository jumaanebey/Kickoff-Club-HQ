-- Add quizzes for all remaining lessons
-- This ensures every video has an engaging quiz to test comprehension

-- Quiz for Lesson 3: Field Layout Basics
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000103',
  'How long is a standard football field from end zone to end zone?',
  '["100 yards", "120 yards", "80 yards", "110 yards"]'::jsonb,
  1 -- Index 1 = "120 yards" (100 yards playing field + 2 x 10 yard end zones)
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 4: Offensive Positions
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000104',
  'Which position is responsible for calling plays and throwing passes?',
  '["Running Back", "Quarterback", "Wide Receiver", "Center"]'::jsonb,
  1 -- Index 1 = "Quarterback"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 5: Defensive Positions
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000105',
  'What is the primary role of the defensive line?',
  '["Cover receivers", "Rush the quarterback and stop the run", "Return kicks", "Call the plays"]'::jsonb,
  1 -- Index 1 = "Rush the quarterback and stop the run"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 6: Quarterback 101
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000106',
  'What does a quarterback do during the "snap"?',
  '["Throws the ball immediately", "Receives the ball from the center to start the play", "Kicks the ball", "Tackles the defender"]'::jsonb,
  1 -- Index 1 = "Receives the ball from the center to start the play"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 7: Special Teams Basics
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000107',
  'When does a team typically use their punter?',
  '["On 4th down to kick the ball away", "After scoring a touchdown", "On 1st down", "During kickoff"]'::jsonb,
  0 -- Index 0 = "On 4th down to kick the ball away"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 8: Understanding Penalties
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000108',
  'What happens when an offensive player commits a "false start"?',
  '["The play continues", "5-yard penalty against offense", "Automatic first down", "Touchdown is awarded"]'::jsonb,
  1 -- Index 1 = "5-yard penalty against offense"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 9: Timeouts and Clock Management
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000109',
  'How many timeouts does each team get per half?',
  '["2", "3", "4", "5"]'::jsonb,
  1 -- Index 1 = "3"
) ON CONFLICT DO NOTHING;

-- Quiz for Lesson 10: NFL Seasons and Playoffs
INSERT INTO lesson_quizzes (
  lesson_id,
  question,
  options,
  correct_index
) VALUES (
  '00000000-0000-0000-0000-000000000110',
  'What is the championship game of the NFL called?',
  '["The Finals", "Super Bowl", "Championship Bowl", "NFL Cup"]'::jsonb,
  1 -- Index 1 = "Super Bowl"
) ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ All lesson quizzes added successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Quiz Summary:';
  RAISE NOTICE '  1. How Downs Work - ✓';
  RAISE NOTICE '  2. Scoring Touchdowns - ✓';
  RAISE NOTICE '  3. Field Layout Basics - ✓ NEW';
  RAISE NOTICE '  4. Offensive Positions - ✓ NEW';
  RAISE NOTICE '  5. Defensive Positions - ✓ NEW';
  RAISE NOTICE '  6. Quarterback 101 - ✓ NEW';
  RAISE NOTICE '  7. Special Teams Basics - ✓ NEW';
  RAISE NOTICE '  8. Understanding Penalties - ✓ NEW';
  RAISE NOTICE '  9. Timeouts and Clock Management - ✓ NEW';
  RAISE NOTICE '  10. NFL Seasons and Playoffs - ✓ NEW';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 All 10 lessons now have quizzes!';
  RAISE NOTICE '🎮 Quizzes will appear 5 seconds before video ends';
END $$;
