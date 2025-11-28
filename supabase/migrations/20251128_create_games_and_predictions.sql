-- Migration: Create Games and Predictions Tables
-- Created: 2025-11-28
-- Purpose: Enable game predictions feature for mobile app
--
-- This migration creates:
-- - games table: Stores NFL games and their results
-- - predictions table: Stores user predictions and outcomes

-- ============================================================================
-- CREATE TABLE: games
-- ============================================================================

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Game Information
  week INTEGER NOT NULL,
  season INTEGER NOT NULL,
  game_date TIMESTAMPTZ NOT NULL,

  -- Teams
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  home_team_logo VARCHAR(255),
  away_team_logo VARCHAR(255),

  -- Scores (NULL before game is final)
  home_score INTEGER,
  away_score INTEGER,

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'final', 'postponed'
  is_final BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_week CHECK (week >= 1 AND week <= 22),
  CONSTRAINT valid_season CHECK (season >= 2020),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'in_progress', 'final', 'postponed'))
);

-- ============================================================================
-- CREATE TABLE: predictions
-- ============================================================================

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,

  -- Prediction Details
  predicted_winner VARCHAR(10) NOT NULL, -- 'home' or 'away'
  coins_wagered INTEGER NOT NULL DEFAULT 10,

  -- Results (NULL until game is final)
  is_correct BOOLEAN,
  coins_won INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_predicted_winner CHECK (predicted_winner IN ('home', 'away')),
  CONSTRAINT valid_coins_wagered CHECK (coins_wagered > 0),
  CONSTRAINT unique_user_game_prediction UNIQUE (user_id, game_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Games indexes
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
CREATE INDEX IF NOT EXISTS idx_games_week_season ON games(season, week);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_final ON games(is_final) WHERE is_final = FALSE;

-- Predictions indexes
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_game_id ON predictions(game_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_predictions_is_correct ON predictions(is_correct) WHERE is_correct IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Games policies (all users can view games)
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  USING (true);

-- Only admins can manage games (handled by service role)
CREATE POLICY "Service role can manage games"
  ON games FOR ALL
  USING (auth.role() = 'service_role');

-- Predictions policies
CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM predictions
      WHERE user_id = auth.uid() AND game_id = NEW.game_id
    )
  );

CREATE POLICY "Users can update own predictions"
  ON predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Games: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_games_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS games_updated_at_trigger ON games;
CREATE TRIGGER games_updated_at_trigger
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_games_updated_at();

-- Predictions: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_predictions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at_trigger ON predictions;
CREATE TRIGGER predictions_updated_at_trigger
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_predictions_updated_at();

-- ============================================================================
-- HELPER FUNCTION: Finalize Game Results
-- ============================================================================

-- This function is called when a game is finalized to update all predictions
CREATE OR REPLACE FUNCTION finalize_game_predictions(game_id_param UUID)
RETURNS void AS $$
DECLARE
  game_record RECORD;
  actual_winner VARCHAR(10);
BEGIN
  -- Get game details
  SELECT * INTO game_record FROM games WHERE id = game_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  IF game_record.home_score IS NULL OR game_record.away_score IS NULL THEN
    RAISE EXCEPTION 'Game scores not set';
  END IF;

  -- Determine actual winner
  IF game_record.home_score > game_record.away_score THEN
    actual_winner := 'home';
  ELSE
    actual_winner := 'away';
  END IF;

  -- Update all predictions for this game
  UPDATE predictions
  SET
    is_correct = (predicted_winner = actual_winner),
    coins_won = CASE
      WHEN predicted_winner = actual_winner THEN coins_wagered * 2
      ELSE 0
    END
  WHERE game_id = game_id_param;

  -- Award coins to winners
  UPDATE profiles p
  SET coins = p.coins + pred.coins_won
  FROM predictions pred
  WHERE pred.user_id = p.id
    AND pred.game_id = game_id_param
    AND pred.is_correct = true;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT ON games TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON predictions TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_game_predictions(UUID) TO authenticated;

-- ============================================================================
-- SEED DATA: Sample Games
-- ============================================================================

-- Insert some sample upcoming games for testing
INSERT INTO games (week, season, game_date, home_team, away_team, status) VALUES
  (13, 2025, NOW() + INTERVAL '2 days', 'Kansas City Chiefs', 'Las Vegas Raiders', 'scheduled'),
  (13, 2025, NOW() + INTERVAL '3 days', 'Dallas Cowboys', 'New York Giants', 'scheduled'),
  (13, 2025, NOW() + INTERVAL '4 days', 'San Francisco 49ers', 'Seattle Seahawks', 'scheduled'),
  (13, 2025, NOW() + INTERVAL '5 days', 'Buffalo Bills', 'Miami Dolphins', 'scheduled'),
  (13, 2025, NOW() + INTERVAL '6 days', 'Philadelphia Eagles', 'Washington Commanders', 'scheduled')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Usage:
-- 1. Mobile app displays upcoming games from the games table
-- 2. Users create predictions by inserting into predictions table
-- 3. When game is final, call finalize_game_predictions() to determine winners
-- 4. Winners automatically receive doubled coins
--
-- Prediction Multiplier: Currently 2x (can be adjusted in finalize_game_predictions)
