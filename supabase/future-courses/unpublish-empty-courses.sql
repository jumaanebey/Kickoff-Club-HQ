-- Unpublish courses without lessons
-- Run this in Supabase SQL Editor
-- These courses are saved for future development

UPDATE courses
SET is_published = false
WHERE id IN (
  '4f7fd835-bf97-4823-8180-4690e15a10b1',  -- Understanding Downs & Distance
  '260712f7-5644-445e-b343-d86a96f380cd',  -- Field Positions Masterclass
  '7123b877-d6fb-43ed-b30a-0af4185b4ec5',  -- Offensive Strategy Guide
  '1f131798-6a0e-4097-89a4-4beccc8889f7',  -- Defensive Schemes Explained
  'f6136a95-f863-4b37-8cc2-d7c4febeba49',  -- Special Teams: The Third Phase
  'a3003876-6680-4487-adf0-92cec233de21',  -- Quarterback Elite Training
  '3539b056-6fa4-4182-91df-ec06d308ba79',  -- Linebacker: Captain of Defense
  '6d3c00eb-0cb8-45be-8351-2fcc75362f1e',  -- Wide Receiver Route Tree
  'bc102660-4684-4446-8fc0-bacb785824cd',  -- Common Penalties Explained
  '73358242-e0c6-4725-877f-3d2c8eabc5b0',  -- Clock Management Mastery
  '439212cb-ae01-4f54-a50a-3e0741796e75',  -- Offensive Formations 101
  'ffbeedde-2b3e-4ed4-a00b-ba5bf30bc243',  -- Defensive Coverages: Cover 1-4
  'de66c3fd-8a65-4916-ad51-4bd588e371f0',  -- History of Football
  '8a6af65d-8498-4ab8-a667-c158f7430a8d'   -- Football Equipment Guide
);

-- Verify the update
SELECT title, is_published
FROM courses
ORDER BY is_published DESC, title;
