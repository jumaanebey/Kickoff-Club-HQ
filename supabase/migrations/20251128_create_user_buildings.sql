-- Migration: Create User Buildings Table
-- Created: 2025-11-28
-- Purpose: Enable HQ building system for mobile app
--
-- This table tracks buildings owned by users in their Football HQ, supporting:
-- - Building placement and levels
-- - Production mechanics (KP, Coins)
-- - Building upgrades

-- ============================================================================
-- CREATE TABLE: user_buildings
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  building_type VARCHAR(50) NOT NULL,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,

  -- Production mechanics (optional, for resource-generating buildings)
  production_type VARCHAR(20), -- 'kp' (knowledge points) or 'coins'
  production_rate INTEGER DEFAULT 0, -- Amount produced per hour
  production_max INTEGER DEFAULT 100, -- Maximum storage capacity
  production_current INTEGER DEFAULT 0, -- Current accumulated production
  last_collected TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_building_type CHECK (
    building_type IN ('film-room', 'practice-field', 'stadium', 'locker-room', 'draft-room', 'concession')
  ),
  CONSTRAINT valid_production_type CHECK (
    production_type IS NULL OR production_type IN ('kp', 'coins')
  ),
  CONSTRAINT valid_level CHECK (level >= 0),
  CONSTRAINT valid_position CHECK (position_x >= 0 AND position_y >= 0),
  CONSTRAINT valid_production CHECK (production_current >= 0 AND production_current <= production_max)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_buildings_user_id ON user_buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_buildings_type ON user_buildings(building_type);
CREATE INDEX IF NOT EXISTS idx_user_buildings_position ON user_buildings(user_id, position_x, position_y);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own buildings
CREATE POLICY "Users can view own buildings"
  ON user_buildings FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own buildings
CREATE POLICY "Users can insert own buildings"
  ON user_buildings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own buildings
CREATE POLICY "Users can update own buildings"
  ON user_buildings FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own buildings
CREATE POLICY "Users can delete own buildings"
  ON user_buildings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update updated_at timestamp on changes
CREATE OR REPLACE FUNCTION update_user_buildings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_buildings_updated_at_trigger ON user_buildings;
CREATE TRIGGER user_buildings_updated_at_trigger
  BEFORE UPDATE ON user_buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_buildings_updated_at();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON user_buildings TO anon, authenticated;

-- ============================================================================
-- NOTES
-- ============================================================================

-- Building Types:
--   film-room: Watch lessons, produces KP
--   practice-field: Complete drills, produces coins
--   stadium: Boosts predictions
--   locker-room: Store achievements
--   draft-room: Collect player cards
--   concession: Buy exclusive merch
--
-- Level 0 means the building slot exists but hasn't been built yet
-- Higher levels unlock better production rates and features
