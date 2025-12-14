-- Update course thumbnails to use existing images

UPDATE courses
SET thumbnail_url = '/images/courses/downs.jpg'
WHERE slug = 'getting-started';

UPDATE courses
SET thumbnail_url = '/images/courses/positions.jpg'
WHERE slug = 'positions-explained';

UPDATE courses
SET thumbnail_url = '/images/courses/special-teams.jpg'
WHERE slug = 'rules-and-strategy';
