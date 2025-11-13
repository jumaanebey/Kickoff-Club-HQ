-- Add Course Thumbnails
-- Updates all courses with their new thumbnail URLs

UPDATE courses
SET thumbnail_url = '/images/courses/how-downs-work.png'
WHERE slug = 'how-downs-work';

UPDATE courses
SET thumbnail_url = '/images/courses/field-layout-scoring.png'
WHERE slug = 'field-layout-scoring';

UPDATE courses
SET thumbnail_url = '/images/courses/quarterback-fundamentals.png'
WHERE slug = 'quarterback-fundamentals';

UPDATE courses
SET thumbnail_url = '/images/courses/wide-receiver-routes.png'
WHERE slug = 'wide-receiver-routes';

UPDATE courses
SET thumbnail_url = '/images/courses/running-back-techniques.png'
WHERE slug = 'running-back-techniques';

UPDATE courses
SET thumbnail_url = '/images/courses/defensive-line-fundamentals.png'
WHERE slug = 'defensive-line-fundamentals';

UPDATE courses
SET thumbnail_url = '/images/courses/linebacker-reads-reactions.png'
WHERE slug = 'linebacker-reads-reactions';

UPDATE courses
SET thumbnail_url = '/images/courses/understanding-penalties.png'
WHERE slug = 'understanding-penalties';

UPDATE courses
SET thumbnail_url = '/images/courses/special-teams-mastery.png'
WHERE slug = 'special-teams-mastery';

UPDATE courses
SET thumbnail_url = '/images/courses/nfl-seasons-playoffs.png'
WHERE slug = 'nfl-seasons-playoffs';

-- Verify all courses have thumbnails
DO $$
DECLARE
  missing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM courses
  WHERE thumbnail_url IS NULL AND is_published = true;

  IF missing_count > 0 THEN
    RAISE NOTICE 'Warning: % published courses still missing thumbnails', missing_count;
  ELSE
    RAISE NOTICE 'Success: All published courses now have thumbnails!';
  END IF;
END $$;
