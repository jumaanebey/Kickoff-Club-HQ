-- Create initialize_user_squad function
-- Called during user sign-up to set up initial squad units

CREATE OR REPLACE FUNCTION initialize_user_squad(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Initialize all 5 unit types for the new user
  INSERT INTO user_squad_units (
    user_id,
    unit_type,
    readiness,
    is_training,
    total_training_sessions,
    level
  ) VALUES
    (p_user_id, 'offensive_line', 0, false, 0, 1),
    (p_user_id, 'skill_positions', 0, false, 0, 1),
    (p_user_id, 'defensive_line', 0, false, 0, 1),
    (p_user_id, 'secondary', 0, false, 0, 1),
    (p_user_id, 'special_teams', 0, false, 0, 1)
  ON CONFLICT (user_id, unit_type) DO NOTHING;

  -- Set initial team_readiness on profiles table
  UPDATE profiles
  SET team_readiness = 0
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
