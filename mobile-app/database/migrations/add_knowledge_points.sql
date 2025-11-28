-- Migration: Add Knowledge Points system
-- Run this in your Supabase SQL Editor

-- Add knowledge_points column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS knowledge_points INTEGER DEFAULT 0;

-- Add energy column for drills (max 100, refills over time)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

-- Create knowledge_point_transactions table for tracking KP history
CREATE TABLE IF NOT EXISTS knowledge_point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source TEXT NOT NULL, -- e.g., 'Film Room Production', 'Mini-game win', 'Building upgrade'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create buildings table to store user's HQ buildings
CREATE TABLE IF NOT EXISTS user_buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  building_type TEXT NOT NULL CHECK (building_type IN ('film-room', 'practice-field', 'stadium', 'locker-room', 'draft-room', 'concession')),
  level INTEGER DEFAULT 1,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  unlocked BOOLEAN DEFAULT TRUE,
  production_current INTEGER DEFAULT 0,
  last_collected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, building_type)
);

-- RLS Policies for knowledge_point_transactions
ALTER TABLE knowledge_point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own KP transactions"
  ON knowledge_point_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KP transactions"
  ON knowledge_point_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_buildings
ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own buildings"
  ON user_buildings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buildings"
  ON user_buildings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buildings"
  ON user_buildings FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to add Knowledge Points
CREATE OR REPLACE FUNCTION add_knowledge_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update user's KP balance
  UPDATE profiles
  SET knowledge_points = knowledge_points + p_amount
  WHERE id = p_user_id
  RETURNING knowledge_points INTO v_new_balance;

  -- Record transaction
  INSERT INTO knowledge_point_transactions (user_id, amount, balance_after, source)
  VALUES (p_user_id, p_amount, v_new_balance, p_source);

  RETURN v_new_balance;
END;
$$;

-- Function to subtract Knowledge Points
CREATE OR REPLACE FUNCTION subtract_knowledge_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
  v_current_balance INTEGER;
BEGIN
  -- Check current balance
  SELECT knowledge_points INTO v_current_balance
  FROM profiles
  WHERE id = p_user_id;

  -- Ensure user has enough KP
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient Knowledge Points';
  END IF;

  -- Update user's KP balance
  UPDATE profiles
  SET knowledge_points = knowledge_points - p_amount
  WHERE id = p_user_id
  RETURNING knowledge_points INTO v_new_balance;

  -- Record transaction (negative amount)
  INSERT INTO knowledge_point_transactions (user_id, amount, balance_after, source)
  VALUES (p_user_id, -p_amount, v_new_balance, p_source);

  RETURN v_new_balance;
END;
$$;

-- Function to refill energy (call this periodically or when checking energy)
CREATE OR REPLACE FUNCTION refill_energy(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_energy INTEGER;
  v_last_update TIMESTAMPTZ;
  v_minutes_passed INTEGER;
  v_energy_to_add INTEGER;
  v_new_energy INTEGER;
BEGIN
  -- Get current energy and last update time
  SELECT energy, last_energy_update
  INTO v_current_energy, v_last_update
  FROM profiles
  WHERE id = p_user_id;

  -- Calculate minutes passed since last update
  v_minutes_passed := EXTRACT(EPOCH FROM (NOW() - v_last_update)) / 60;

  -- Energy refills at 1 point per 5 minutes (12 per hour)
  v_energy_to_add := FLOOR(v_minutes_passed / 5);

  -- Calculate new energy (max 100)
  v_new_energy := LEAST(v_current_energy + v_energy_to_add, 100);

  -- Update energy if it changed
  IF v_new_energy != v_current_energy THEN
    UPDATE profiles
    SET energy = v_new_energy,
        last_energy_update = NOW()
    WHERE id = p_user_id;
  END IF;

  RETURN v_new_energy;
END;
$$;

-- Initialize existing users with default values
UPDATE profiles
SET knowledge_points = 0,
    energy = 100,
    last_energy_update = NOW()
WHERE knowledge_points IS NULL;
