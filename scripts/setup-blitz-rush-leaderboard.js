// Script to create the blitz_rush_scores table in Supabase
// Run with: node scripts/setup-blitz-rush-leaderboard.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zejensivaohvtkzufdou.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.log(`
To create the blitz_rush_scores table, run this SQL in your Supabase Dashboard:

-- Create the blitz_rush_scores table
CREATE TABLE IF NOT EXISTS blitz_rush_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL DEFAULT 'Anonymous',
  score INTEGER NOT NULL,
  coins_collected INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_blitz_rush_scores_score ON blitz_rush_scores(score DESC);

-- Enable Row Level Security
ALTER TABLE blitz_rush_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read scores (for leaderboard)
CREATE POLICY "Anyone can view scores"
  ON blitz_rush_scores
  FOR SELECT
  USING (true);

-- Allow anyone to insert scores (anonymous game submissions)
CREATE POLICY "Anyone can submit scores"
  ON blitz_rush_scores
  FOR INSERT
  WITH CHECK (true);

-- Optional: Prevent scores over a reasonable maximum (anti-cheat)
ALTER TABLE blitz_rush_scores
  ADD CONSTRAINT reasonable_score CHECK (score >= 0 AND score <= 1000000);

`);
  process.exit(0);
}

async function setup() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('Creating blitz_rush_scores table...');

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS blitz_rush_scores (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        player_name VARCHAR(50) NOT NULL DEFAULT 'Anonymous',
        score INTEGER NOT NULL,
        coins_collected INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_blitz_rush_scores_score ON blitz_rush_scores(score DESC);

      ALTER TABLE blitz_rush_scores ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can view scores" ON blitz_rush_scores;
      CREATE POLICY "Anyone can view scores"
        ON blitz_rush_scores
        FOR SELECT
        USING (true);

      DROP POLICY IF EXISTS "Anyone can submit scores" ON blitz_rush_scores;
      CREATE POLICY "Anyone can submit scores"
        ON blitz_rush_scores
        FOR INSERT
        WITH CHECK (true);
    `
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Table created successfully!');
  }
}

setup();
