-- Fix podcast audio URLs to match actual filenames
-- Run this against your Supabase database to fix the podcast playback issue

UPDATE podcasts
SET audio_url = '/podcasts/episode-03-game-clock.m4a'
WHERE episode_number = 3;

UPDATE podcasts
SET audio_url = '/podcasts/episode-06-touchdown-rules.m4a'
WHERE episode_number = 6;

UPDATE podcasts
SET audio_url = '/podcasts/episode-07-strategy-blueprint.m4a'
WHERE episode_number = 7;

UPDATE podcasts
SET audio_url = '/podcasts/episode-08-coaching-strategy.m4a'
WHERE episode_number = 8;

UPDATE podcasts
SET audio_url = '/podcasts/episode-10-penalty-cost.m4a'
WHERE episode_number = 10;
