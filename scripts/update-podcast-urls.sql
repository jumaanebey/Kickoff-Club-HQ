-- Update podcast audio URLs to point to Cloudflare R2
-- Run this in Supabase SQL Editor

UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-01.m4a' WHERE episode_number = 1;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-02.m4a' WHERE episode_number = 2;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-03.m4a' WHERE episode_number = 3;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-04.m4a' WHERE episode_number = 4;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-05.m4a' WHERE episode_number = 5;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-06.m4a' WHERE episode_number = 6;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-07.m4a' WHERE episode_number = 7;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-08.m4a' WHERE episode_number = 8;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-09.m4a' WHERE episode_number = 9;
UPDATE podcasts SET audio_url = 'https://pub-823743a9ea649b7611fbc9b83a1de4c1.r2.dev/podcasts/episode-10.m4a' WHERE episode_number = 10;

-- Verify the updates
SELECT episode_number, title, audio_url FROM podcasts ORDER BY episode_number;
