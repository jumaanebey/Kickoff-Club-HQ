-- Match Simulation Functions

-- Function to simulate a match based on team readiness
CREATE OR REPLACE FUNCTION simulate_match(
  p_user_id UUID,
  p_game_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_season user_seasons;
  v_avg_readiness INTEGER;
  v_user_score INTEGER;
  v_opponent_score INTEGER;
  v_won BOOLEAN;
  v_coins_earned INTEGER;
  v_xp_earned INTEGER;
  v_kp_earned INTEGER;
  v_match_id UUID;
  v_game RECORD;
BEGIN
  -- Get current season
  SELECT * INTO v_season FROM user_seasons
  WHERE user_id = p_user_id
  ORDER BY season_number DESC
  LIMIT 1;

  IF v_season IS NULL THEN
    RETURN json_build_object('error', 'no_active_season');
  END IF;

  -- Calculate average team readiness
  SELECT COALESCE(AVG(readiness), 0)::INTEGER INTO v_avg_readiness
  FROM user_squad_units
  WHERE user_id = p_user_id;

  -- Check if team is ready enough
  IF v_avg_readiness < v_season.min_readiness_for_matches THEN
    RETURN json_build_object(
      'error', 'insufficient_readiness',
      'required', v_season.min_readiness_for_matches,
      'current', v_avg_readiness
    );
  END IF;

  -- Get game details
  SELECT * INTO v_game FROM games WHERE id = p_game_id;

  IF v_game IS NULL THEN
    RETURN json_build_object('error', 'game_not_found');
  END IF;

  -- Simulate score based on readiness (higher readiness = better chance to score)
  -- Base score: 0-35 points, modified by readiness
  v_user_score := FLOOR(RANDOM() * 28) + 7; -- 7-35 base
  v_user_score := v_user_score + FLOOR((v_avg_readiness - 50) / 10); -- +/- based on readiness

  -- Opponent score (simulated as moderate difficulty)
  v_opponent_score := FLOOR(RANDOM() * 28) + 7;

  -- Cap scores at realistic values
  v_user_score := LEAST(GREATEST(v_user_score, 0), 49);
  v_opponent_score := LEAST(GREATEST(v_opponent_score, 0), 42);

  -- Determine winner
  v_won := v_user_score > v_opponent_score;

  -- Calculate rewards based on performance
  IF v_won THEN
    v_coins_earned := 100 + (v_user_score - v_opponent_score) * 5;
    v_xp_earned := 50 + (v_user_score - v_opponent_score) * 2;
    v_kp_earned := 25;
  ELSE
    v_coins_earned := 25; -- Small consolation prize
    v_xp_earned := 10;
    v_kp_earned := 5;
  END IF;

  -- Create match result
  INSERT INTO user_match_results (
    user_id,
    season_id,
    game_id,
    user_score,
    opponent_score,
    won,
    coins_earned,
    xp_earned,
    knowledge_points_earned,
    team_readiness
  ) VALUES (
    p_user_id,
    v_season.id,
    p_game_id,
    v_user_score,
    v_opponent_score,
    v_won,
    v_coins_earned,
    v_xp_earned,
    v_kp_earned,
    v_avg_readiness
  ) RETURNING id INTO v_match_id;

  -- Update season stats
  UPDATE user_seasons
  SET games_played = games_played + 1,
      games_won = games_won + (CASE WHEN v_won THEN 1 ELSE 0 END),
      games_lost = games_lost + (CASE WHEN v_won THEN 0 ELSE 1 END),
      total_coins_earned = total_coins_earned + v_coins_earned,
      total_xp_earned = total_xp_earned + v_xp_earned
  WHERE id = v_season.id;

  -- Award rewards to profile
  UPDATE profiles
  SET coins = coins + v_coins_earned,
      xp = xp + v_xp_earned,
      knowledge_points = knowledge_points + v_kp_earned
  WHERE id = p_user_id;

  -- Reduce all unit readiness by 10-20% after match (fatigue)
  UPDATE user_squad_units
  SET readiness = GREATEST(readiness - (10 + FLOOR(RANDOM() * 10)), 0)
  WHERE user_id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'match_id', v_match_id,
    'user_score', v_user_score,
    'opponent_score', v_opponent_score,
    'won', v_won,
    'coins_earned', v_coins_earned,
    'xp_earned', v_xp_earned,
    'kp_earned', v_kp_earned,
    'team_readiness', v_avg_readiness
  );
END;
$$;

-- Function to generate play-by-play for a match
CREATE OR REPLACE FUNCTION generate_play_by_play(
  p_user_score INTEGER,
  p_opponent_score INTEGER,
  p_team_readiness INTEGER
)
RETURNS JSON[]
LANGUAGE plpgsql
AS $$
DECLARE
  v_plays JSON[] := ARRAY[]::JSON[];
  v_user_tds INTEGER;
  v_opponent_tds INTEGER;
  v_user_fgs INTEGER;
  v_opponent_fgs INTEGER;
  v_quarter INTEGER;
  v_play_types TEXT[] := ARRAY['run', 'pass', 'sack', 'interception', 'fumble'];
  v_play JSON;
BEGIN
  -- Calculate TDs and FGs from scores
  v_user_tds := p_user_score / 7;
  v_user_fgs := (p_user_score % 7) / 3;
  v_opponent_tds := p_opponent_score / 7;
  v_opponent_fgs := (p_opponent_score % 7) / 3;

  -- Generate scoring plays
  FOR i IN 1..v_user_tds LOOP
    v_quarter := LEAST(FLOOR(RANDOM() * 4) + 1, 4);
    v_play := json_build_object(
      'quarter', v_quarter,
      'type', 'touchdown',
      'team', 'user',
      'description', CASE FLOOR(RANDOM() * 3)
        WHEN 0 THEN 'Touchdown! Long pass to the end zone!'
        WHEN 1 THEN 'Touchdown! Powerful rushing attack scores!'
        ELSE 'Touchdown! Beautiful play execution!'
      END
    );
    v_plays := array_append(v_plays, v_play);
  END LOOP;

  FOR i IN 1..v_opponent_tds LOOP
    v_quarter := LEAST(FLOOR(RANDOM() * 4) + 1, 4);
    v_play := json_build_object(
      'quarter', v_quarter,
      'type', 'touchdown',
      'team', 'opponent',
      'description', 'Opponent scores a touchdown.'
    );
    v_plays := array_append(v_plays, v_play);
  END LOOP;

  FOR i IN 1..v_user_fgs LOOP
    v_quarter := LEAST(FLOOR(RANDOM() * 4) + 1, 4);
    v_play := json_build_object(
      'quarter', v_quarter,
      'type', 'field_goal',
      'team', 'user',
      'description', 'Field goal is good! 3 points!'
    );
    v_plays := array_append(v_plays, v_play);
  END LOOP;

  FOR i IN 1..v_opponent_fgs LOOP
    v_quarter := LEAST(FLOOR(RANDOM() * 4) + 1, 4);
    v_play := json_build_object(
      'quarter', v_quarter,
      'type', 'field_goal',
      'team', 'opponent',
      'description', 'Opponent kicks a field goal.'
    );
    v_plays := array_append(v_plays, v_play);
  END LOOP;

  RETURN v_plays;
END;
$$;
