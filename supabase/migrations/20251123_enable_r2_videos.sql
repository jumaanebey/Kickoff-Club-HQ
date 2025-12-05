-- Enable Cloudflare R2 for all lessons
-- This migration sets the video_id and clears the video_url for all lessons

UPDATE lessons SET video_id = 'how-downs-work', video_url = NULL WHERE slug = 'how-downs-work';
UPDATE lessons SET video_id = 'scoring-touchdowns', video_url = NULL WHERE slug = 'scoring-touchdowns';
UPDATE lessons SET video_id = 'field-layout-basics', video_url = NULL WHERE slug = 'field-layout-basics';
UPDATE lessons SET video_id = 'offensive-positions', video_url = NULL WHERE slug = 'offensive-positions';
UPDATE lessons SET video_id = 'defensive-positions', video_url = NULL WHERE slug = 'defensive-positions';
UPDATE lessons SET video_id = 'understanding-penalties', video_url = NULL WHERE slug = 'understanding-penalties';
UPDATE lessons SET video_id = 'special-teams-basics', video_url = NULL WHERE slug = 'special-teams-basics';
UPDATE lessons SET video_id = 'timeouts-and-clock', video_url = NULL WHERE slug = 'timeouts-and-clock';
UPDATE lessons SET video_id = 'nfl-seasons-playoffs', video_url = NULL WHERE slug = 'nfl-seasons-playoffs';
UPDATE lessons SET video_id = 'quarterback-101', video_url = NULL WHERE slug = 'quarterback-101';
