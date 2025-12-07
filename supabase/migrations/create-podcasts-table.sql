-- Create podcasts table for podcast episode management
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration TEXT NOT NULL,
  guest TEXT,
  publish_date DATE NOT NULL,
  category TEXT,
  transcript TEXT,
  shownotes JSONB,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_podcasts_published ON podcasts(is_published, publish_date DESC);
CREATE INDEX idx_podcasts_slug ON podcasts(slug);
CREATE INDEX idx_podcasts_episode_number ON podcasts(episode_number);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_podcasts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER podcasts_updated_at
  BEFORE UPDATE ON podcasts
  FOR EACH ROW
  EXECUTE FUNCTION update_podcasts_updated_at();

-- Insert the 10 existing podcast episodes
INSERT INTO podcasts (episode_number, title, slug, description, audio_url, duration, guest, publish_date, category, transcript, shownotes, cover_image_url) VALUES
(1, 'The 4 Downs Thing Everyone Talks About', 'four-downs-explained', 'We break down the most fundamental concept in football - the four-down system. Perfect for complete beginners who want to understand why teams have four chances to move the ball.', '/podcasts/episode-01-four-downs.m4a', '28:45', 'Dad & Daughter', '2024-01-15', 'Fundamentals', 'Full transcript of episode discussing the four-down system, field progression, and why it matters.', '{"topics": ["What is a down?", "Why four downs?", "Turnover on downs", "First down markers"], "timestamps": ["00:00 - Introduction", "02:15 - What is a down?", "08:30 - The 10-yard rule", "15:45 - Punting on 4th down", "22:00 - Strategy discussion"]}', '/images/podcast-covers/episode-01.jpg'),

(2, 'Can We Talk About Fantasy Football?', 'fantasy-football-basics', 'Your complete beginner guide to Fantasy Football. Learn how it works, why millions play it, and how it can actually help you understand real football better.', '/podcasts/episode-02-fantasy-football.m4a', '32:15', 'Two Roommates', '2024-01-22', 'Strategy', 'Comprehensive discussion about Fantasy Football fundamentals, player selection, and how it enhances football understanding.', '{"topics": ["What is Fantasy Football?", "How to draft players", "Scoring systems", "Using fantasy to learn real football"], "timestamps": ["00:00 - Intro to Fantasy", "05:20 - Draft basics", "12:40 - Scoring explained", "20:15 - Strategy tips", "28:00 - Wrapup"]}', '/images/podcast-covers/episode-02.jpg'),

(3, 'What''s the Deal With the Clock?', 'clock-management-explained', 'Time is everything in football. We explain the play clock, game clock, timeouts, the two-minute warning, and why clock management can win or lose games.', '/podcasts/episode-03-game-clock.m4a', '25:30', 'Coach & Student', '2024-01-29', 'Fundamentals', 'Deep dive into football timing rules, clock stoppages, and strategic time management.', '{"topics": ["Game clock vs play clock", "When the clock stops", "Two-minute warning", "Timeouts strategy", "Spiking the ball"], "timestamps": ["00:00 - Introduction", "03:45 - Two different clocks", "10:20 - Clock stoppages", "16:50 - Strategic timeouts", "22:00 - Summary"]}', '/images/podcast-covers/episode-03.jpg'),

(4, 'Wait, That''s Illegal?! Understanding Penalties', 'penalties-explained', 'Yellow flags everywhere! Learn about the most common penalties, what they mean, and why refs throw those yellow flags all the time.', '/podcasts/episode-04-penalties.m4a', '30:00', 'Friends Watching Game', '2024-02-05', 'Fundamentals', 'Complete guide to football penalties, from offsides to pass interference, explained simply.', '{"topics": ["Offsides", "False start", "Holding", "Pass interference", "Personal fouls"], "timestamps": ["00:00 - Intro", "04:15 - Pre-snap penalties", "12:30 - Offensive penalties", "19:45 - Defensive penalties", "26:00 - Conclusion"]}', '/images/podcast-covers/episode-04.jpg'),

(5, 'How Does Scoring Even Work?', 'scoring-system-explained', 'Touchdowns, field goals, safeties, extra points - we break down every way to score points in football and why they have different values.', '/podcasts/episode-05-scoring.m4a', '27:20', 'Dad & Daughter', '2024-02-12', 'Fundamentals', 'Detailed explanation of all scoring methods in football and the strategy behind each.', '{"topics": ["Touchdown (6 points)", "Extra point vs 2-point conversion", "Field goals (3 points)", "Safety (2 points)", "Rare scoring plays"], "timestamps": ["00:00 - Overview", "02:50 - Touchdowns", "10:15 - Field goals", "17:30 - Safeties", "23:00 - Strategy"]}', '/images/podcast-covers/episode-05.jpg'),

(6, 'Touchdown Is Six Points... But Why?', 'why-six-points', 'Ever wondered why a touchdown is worth 6 points and not 5 or 7? We explore the history and logic behind football''s scoring system.', '/podcasts/episode-06-touchdown-rules.m4a', '29:10', 'History Buff & Newbie', '2024-02-19', 'Strategy', 'Historical deep dive into why football scoring values are what they are today.', '{"topics": ["History of scoring", "Why 6 for TD?", "Evolution of field goals", "Extra point changes", "Strategy implications"], "timestamps": ["00:00 - Introduction", "05:20 - Football history", "13:40 - Touchdown origins", "20:15 - Modern scoring", "25:30 - Wrapup"]}', '/images/podcast-covers/episode-06.jpg'),

(7, 'The Strategy Blueprint No One Explains', 'offensive-defensive-strategy', 'Offense vs Defense - learn the chess match happening on every play. Formations, play-calling, and why coaches make the decisions they do.', '/podcasts/episode-07-strategy-blueprint.m4a', '35:45', 'Coach & Analyst', '2024-02-26', 'Strategy', 'Advanced discussion of offensive and defensive strategies, formations, and play-calling philosophy.', '{"topics": ["Offensive formations", "Defensive schemes", "Play-action passes", "Blitz packages", "Reading defenses"], "timestamps": ["00:00 - Intro", "06:10 - Offense basics", "15:30 - Defense basics", "24:20 - The chess match", "31:00 - Summary"]}', '/images/podcast-covers/episode-07.jpg'),

(8, 'Why Is Everyone Yelling About the Coach?', 'coaching-decisions', 'Fourth-and-goal. Go for it or kick? We explain why coaching decisions seem crazy and how coaches actually think through these pressure situations.', '/podcasts/episode-08-coaching-strategy.m4a', '31:50', 'Former Player & Fan', '2024-03-04', 'Strategy', 'Inside look at coaching philosophy, decision-making under pressure, and famous coaching calls.', '{"topics": ["4th down decisions", "When to go for 2", "Timeout management", "Challenge flags", "Halftime adjustments"], "timestamps": ["00:00 - Opening", "04:30 - 4th down math", "13:20 - Two-point conversion", "21:40 - Clock decisions", "28:00 - Conclusion"]}', '/images/podcast-covers/episode-08.jpg'),

(9, 'Super Bowl... Make It Make Sense', 'super-bowl-explained', 'The biggest game in American sports. Learn how teams get there, what makes it special, and why the whole country watches.', '/podcasts/episode-09-super-bowl.m4a', '33:25', 'Two Roommates', '2024-03-11', 'Fundamentals', 'Complete guide to the Super Bowl, playoffs, and championship path.', '{"topics": ["Playoff structure", "Conference championships", "Super Bowl history", "Halftime show", "The spectacle"], "timestamps": ["00:00 - Intro", "05:45 - Regular season", "14:20 - Playoff brackets", "22:30 - Super Bowl traditions", "29:00 - Wrapup"]}', '/images/podcast-covers/episode-09.jpg'),

(10, 'I Think I Actually Get It Now!', 'putting-it-all-together', 'Our finale! We recap everything you''ve learned and give you the confidence to watch any game and actually know what''s happening.', '/podcasts/episode-10-penalty-cost.m4a', '37:15', 'Dad & Daughter', '2024-03-18', 'Fundamentals', 'Comprehensive review of all concepts covered in the series with confidence-building tips for watching games.', '{"topics": ["Recap of key concepts", "Watching your first game", "Common situations explained", "Building confidence", "Next steps"], "timestamps": ["00:00 - Introduction", "07:20 - The essentials", "16:45 - Game situations", "25:30 - Confidence building", "33:00 - Final thoughts"]}', '/images/podcast-covers/episode-10.jpg');

-- Enable Row Level Security
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can view published podcasts"
  ON podcasts
  FOR SELECT
  USING (is_published = true);

-- Create policy for authenticated users to view all
CREATE POLICY "Authenticated users can view all podcasts"
  ON podcasts
  FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON TABLE podcasts IS 'Podcast episodes for the Kickoff Club podcast series';
