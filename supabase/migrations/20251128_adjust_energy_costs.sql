-- Migration: Adjust Energy Costs and Regeneration Rate
-- Created: 2025-11-28
-- Purpose: Make game more playable with 10-15 sessions per day
--
-- Changes:
-- - Training: 10 → 5 energy
-- - Match: 20 → 10 energy
-- - Regen: 1 per 5 min → 1 per 2 minutes (handled client-side)

-- ============================================================================
-- UPDATE FUNCTION: start_training (reduce cost from 10 to 5)
-- ============================================================================

CREATE OR REPLACE FUNCTION start_training(
  p_user_id UUID,
  p_unit_type VARCHAR(50)
)
RETURNS jsonb AS $$
DECLARE
  user_energy INTEGER;
  training_duration INTERVAL;
  completes_at_time TIMESTAMPTZ;
  new_session_id UUID;
BEGIN
  -- Check user's energy
  SELECT energy INTO user_energy FROM profiles WHERE id = p_user_id;

  IF user_energy IS NULL THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;

  IF user_energy < 5 THEN
    RETURN jsonb_build_object('error', 'Not enough energy');
  END IF;

  -- Training duration: 5 minutes
  training_duration := INTERVAL '5 minutes';
  completes_at_time := NOW() + training_duration;

  -- Create training session
  INSERT INTO unit_training_sessions (
    user_id,
    unit_type,
    completes_at,
    energy_cost
  ) VALUES (
    p_user_id,
    p_unit_type,
    completes_at_time,
    5
  ) RETURNING id INTO new_session_id;

  -- Deduct energy
  UPDATE profiles SET energy = energy - 5 WHERE id = p_user_id;

  -- Update mission progress for 'training' type
  PERFORM update_mission_progress(p_user_id, 'training'::mission_type, 1);

  RETURN jsonb_build_object(
    'success', true,
    'session_id', new_session_id,
    'completes_at', completes_at_time
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UPDATE FUNCTION: play_match (reduce cost from 20 to 10)
-- ============================================================================

CREATE OR REPLACE FUNCTION play_match(p_user_id UUID)
RETURNS jsonb AS $$
DECLARE
  user_profile RECORD;
  opponent_level INTEGER;
  opponent_readiness INTEGER;
  user_power NUMERIC;
  opponent_power NUMERIC;
  win_probability NUMERIC;
  user_wins BOOLEAN;
  user_score INTEGER;
  opponent_score INTEGER;
  coins_reward INTEGER;
  xp_reward INTEGER;
  kp_reward INTEGER;
BEGIN
  -- Check user's energy
  SELECT * INTO user_profile FROM profiles WHERE id = p_user_id;

  IF user_profile.energy < 10 THEN
    RETURN jsonb_build_object('error', 'Not enough energy (need 10)');
  END IF;

  -- Generate opponent (user level ±2)
  opponent_level := user_profile.level + (FLOOR(RANDOM() * 5) - 2);
  IF opponent_level < 1 THEN opponent_level := 1; END IF;
  opponent_readiness := opponent_level * 10 + FLOOR(RANDOM() * 20);

  -- Calculate win probability
  user_power := user_profile.team_readiness;
  opponent_power := opponent_readiness;
  win_probability := user_power / (user_power + opponent_power);

  -- Determine winner
  user_wins := RANDOM() < win_probability;

  -- Generate realistic football scores
  IF user_wins THEN
    user_score := 21 + FLOOR(RANDOM() * 15); -- 21-35
    opponent_score := FLOOR(RANDOM() * 21); -- 0-20
    coins_reward := 50;
    xp_reward := 25;
    kp_reward := 10;
  ELSE
    user_score := FLOOR(RANDOM() * 21); -- 0-20
    opponent_score := 21 + FLOOR(RANDOM() * 15); -- 21-35
    coins_reward := 10;
    xp_reward := 5;
    kp_reward := 0;
  END IF;

  -- Save match history
  INSERT INTO match_history (
    user_id,
    opponent_level,
    opponent_team_readiness,
    user_score,
    opponent_score,
    won,
    coins_earned,
    xp_earned,
    kp_earned
  ) VALUES (
    p_user_id,
    opponent_level,
    opponent_readiness,
    user_score,
    opponent_score,
    user_wins,
    coins_reward,
    xp_reward,
    kp_reward
  );

  -- Award rewards and deduct energy (changed from 20 to 10)
  UPDATE profiles SET
    coins = coins + coins_reward,
    xp = xp + xp_reward,
    knowledge_points = knowledge_points + kp_reward,
    energy = energy - 10
  WHERE id = p_user_id;

  -- Update mission progress for 'match' type (only if won)
  IF user_wins THEN
    PERFORM update_mission_progress(p_user_id, 'match'::mission_type, 1);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'won', user_wins,
    'user_score', user_score,
    'opponent_score', opponent_score,
    'opponent_level', opponent_level,
    'coins_earned', coins_reward,
    'xp_earned', xp_reward,
    'kp_earned', kp_reward
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- NOTES
-- ============================================================================

-- New Energy Economics:
-- - Training: 5 energy, 5 min duration, +5 readiness
-- - Match: 10 energy, instant result
-- - Regen: 1 energy per 2 minutes (120 seconds) - implemented client-side
-- - Max energy: 100
-- - Full refill: 200 minutes (3h 20m)
-- - Sessions per full bar: 20 training OR 10 matches
-- - Expected daily sessions: 10-15 (checking in every 2-3 hours)
