ALTER TABLE profiles ADD COLUMN IF NOT EXISTS knowledge_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 100, ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS knowledge_point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

ALTER TABLE knowledge_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_buildings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own KP transactions" ON knowledge_point_transactions;
DROP POLICY IF EXISTS "Users can insert their own KP transactions" ON knowledge_point_transactions;
DROP POLICY IF EXISTS "Users can view their own buildings" ON user_buildings;
DROP POLICY IF EXISTS "Users can insert their own buildings" ON user_buildings;
DROP POLICY IF EXISTS "Users can update their own buildings" ON user_buildings;

CREATE POLICY "Users can view their own KP transactions" ON knowledge_point_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own KP transactions" ON knowledge_point_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own buildings" ON user_buildings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own buildings" ON user_buildings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own buildings" ON user_buildings FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS mission_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('complete_lessons','make_predictions','watch_videos','login_streak','earn_coins','spend_coins','answer_questions','share_app','train_units','collect_buildings')),
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  coin_reward INTEGER DEFAULT 50,
  xp_reward INTEGER DEFAULT 100,
  target_value INTEGER NOT NULL,
  duration_hours INTEGER DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES mission_templates(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view mission templates" ON mission_templates;
DROP POLICY IF EXISTS "Users can view their own missions" ON user_missions;
DROP POLICY IF EXISTS "Users can update their own missions" ON user_missions;
DROP POLICY IF EXISTS "Service can insert user missions" ON user_missions;

CREATE POLICY "Anyone can view mission templates" ON mission_templates FOR SELECT USING (true);
CREATE POLICY "Users can view their own missions" ON user_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own missions" ON user_missions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service can insert user missions" ON user_missions FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS user_squad_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL CHECK (unit_type IN ('quarterback', 'runningback', 'receiver', 'lineman', 'linebacker', 'safety', 'cornerback', 'kicker')),
  overall_rating INTEGER DEFAULT 50,
  attack_stat INTEGER DEFAULT 50,
  defense_stat INTEGER DEFAULT 50,
  speed_stat INTEGER DEFAULT 50,
  training_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, unit_type)
);

CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  stat_to_train TEXT NOT NULL CHECK (stat_to_train IN ('attack', 'defense', 'speed', 'overall')),
  stat_increase INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completes_at TIMESTAMPTZ NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_number INTEGER DEFAULT 1,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_lost INTEGER DEFAULT 0,
  points_for INTEGER DEFAULT 0,
  points_against INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_match_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season_id UUID REFERENCES user_seasons(id) ON DELETE CASCADE,
  opponent_name TEXT NOT NULL,
  user_score INTEGER NOT NULL,
  opponent_score INTEGER NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss')),
  coins_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_squad_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_match_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own squad" ON user_squad_units;
DROP POLICY IF EXISTS "Users can update their own squad" ON user_squad_units;
DROP POLICY IF EXISTS "Users can view their own training sessions" ON training_sessions;
DROP POLICY IF EXISTS "Users can manage their own training sessions" ON training_sessions;
DROP POLICY IF EXISTS "Users can view their own seasons" ON user_seasons;
DROP POLICY IF EXISTS "Users can manage their own seasons" ON user_seasons;
DROP POLICY IF EXISTS "Users can view their own match results" ON user_match_results;
DROP POLICY IF EXISTS "Users can insert their own match results" ON user_match_results;

CREATE POLICY "Users can view their own squad" ON user_squad_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own squad" ON user_squad_units FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own training sessions" ON training_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own training sessions" ON training_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own seasons" ON user_seasons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own seasons" ON user_seasons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own match results" ON user_match_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own match results" ON user_match_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION add_knowledge_points(p_user_id UUID, p_amount INTEGER, p_source TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_new_balance INTEGER;
BEGIN
  UPDATE profiles SET knowledge_points = knowledge_points + p_amount WHERE id = p_user_id RETURNING knowledge_points INTO v_new_balance;
  INSERT INTO knowledge_point_transactions (user_id, amount, balance_after, source) VALUES (p_user_id, p_amount, v_new_balance, p_source);
  RETURN v_new_balance;
END; $$;

CREATE OR REPLACE FUNCTION subtract_knowledge_points(p_user_id UUID, p_amount INTEGER, p_source TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_new_balance INTEGER; v_current_balance INTEGER;
BEGIN
  SELECT knowledge_points INTO v_current_balance FROM profiles WHERE id = p_user_id;
  IF v_current_balance < p_amount THEN RAISE EXCEPTION 'Insufficient Knowledge Points'; END IF;
  UPDATE profiles SET knowledge_points = knowledge_points - p_amount WHERE id = p_user_id RETURNING knowledge_points INTO v_new_balance;
  INSERT INTO knowledge_point_transactions (user_id, amount, balance_after, source) VALUES (p_user_id, -p_amount, v_new_balance, p_source);
  RETURN v_new_balance;
END; $$;

CREATE OR REPLACE FUNCTION refill_energy(p_user_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_current_energy INTEGER; v_last_update TIMESTAMPTZ; v_minutes_passed INTEGER; v_energy_to_add INTEGER; v_new_energy INTEGER;
BEGIN
  SELECT energy, last_energy_update INTO v_current_energy, v_last_update FROM profiles WHERE id = p_user_id;
  v_minutes_passed := EXTRACT(EPOCH FROM (NOW() - v_last_update)) / 60;
  v_energy_to_add := FLOOR(v_minutes_passed / 5);
  v_new_energy := LEAST(v_current_energy + v_energy_to_add, 100);
  IF v_new_energy != v_current_energy THEN UPDATE profiles SET energy = v_new_energy, last_energy_update = NOW() WHERE id = p_user_id; END IF;
  RETURN v_new_energy;
END; $$;

CREATE OR REPLACE FUNCTION assign_daily_missions(p_user_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_common_missions UUID[]; v_rare_missions UUID[]; v_epic_missions UUID[]; v_legendary_missions UUID[]; v_assigned_missions JSON[] := '{}'; v_mission UUID; v_expires_at TIMESTAMPTZ;
BEGIN
  v_expires_at := NOW() + INTERVAL '24 hours';
  DELETE FROM user_missions WHERE user_id = p_user_id AND expires_at < NOW();
  SELECT ARRAY_AGG(id) INTO v_common_missions FROM mission_templates WHERE rarity = 'common';
  SELECT ARRAY_AGG(id) INTO v_rare_missions FROM mission_templates WHERE rarity = 'rare';
  SELECT ARRAY_AGG(id) INTO v_epic_missions FROM mission_templates WHERE rarity = 'epic';
  SELECT ARRAY_AGG(id) INTO v_legendary_missions FROM mission_templates WHERE rarity = 'legendary';
  FOR i IN 1..3 LOOP
    v_mission := v_common_missions[1 + floor(random() * array_length(v_common_missions, 1))];
    INSERT INTO user_missions (user_id, template_id, expires_at) VALUES (p_user_id, v_mission, v_expires_at) ON CONFLICT DO NOTHING;
  END LOOP;
  v_mission := v_rare_missions[1 + floor(random() * array_length(v_rare_missions, 1))];
  INSERT INTO user_missions (user_id, template_id, expires_at) VALUES (p_user_id, v_mission, v_expires_at) ON CONFLICT DO NOTHING;
  IF random() < 0.1 AND v_epic_missions IS NOT NULL THEN
    v_mission := v_epic_missions[1 + floor(random() * array_length(v_epic_missions, 1))];
    INSERT INTO user_missions (user_id, template_id, expires_at) VALUES (p_user_id, v_mission, v_expires_at) ON CONFLICT DO NOTHING;
  END IF;
  IF random() < 0.01 AND v_legendary_missions IS NOT NULL THEN
    v_mission := v_legendary_missions[1 + floor(random() * array_length(v_legendary_missions, 1))];
    INSERT INTO user_missions (user_id, template_id, expires_at) VALUES (p_user_id, v_mission, v_expires_at) ON CONFLICT DO NOTHING;
  END IF;
  RETURN json_build_object('success', true, 'message', 'Missions assigned');
END; $$;

CREATE OR REPLACE FUNCTION update_mission_progress(p_user_id UUID, p_mission_type TEXT, p_increment INTEGER DEFAULT 1)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE user_missions um SET progress = LEAST(progress + p_increment, mt.target_value), is_completed = (progress + p_increment >= mt.target_value) FROM mission_templates mt WHERE um.template_id = mt.id AND um.user_id = p_user_id AND mt.mission_type = p_mission_type AND um.is_completed = FALSE AND um.expires_at > NOW();
END; $$;

CREATE OR REPLACE FUNCTION claim_mission_reward(p_mission_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_user_id UUID; v_coin_reward INTEGER; v_xp_reward INTEGER; v_is_completed BOOLEAN; v_is_claimed BOOLEAN;
BEGIN
  SELECT user_id, is_completed, is_claimed INTO v_user_id, v_is_completed, v_is_claimed FROM user_missions WHERE id = p_mission_id;
  IF NOT v_is_completed THEN RAISE EXCEPTION 'Mission not completed yet'; END IF;
  IF v_is_claimed THEN RAISE EXCEPTION 'Mission reward already claimed'; END IF;
  SELECT mt.coin_reward, mt.xp_reward INTO v_coin_reward, v_xp_reward FROM user_missions um JOIN mission_templates mt ON um.template_id = mt.id WHERE um.id = p_mission_id;
  UPDATE profiles SET coins = coins + v_coin_reward, xp = xp + v_xp_reward WHERE id = v_user_id;
  UPDATE user_missions SET is_claimed = TRUE WHERE id = p_mission_id;
  INSERT INTO coin_transactions (user_id, amount, reason, balance_after) SELECT v_user_id, v_coin_reward, 'Mission Reward', coins FROM profiles WHERE id = v_user_id;
  RETURN json_build_object('success', true, 'coins_earned', v_coin_reward, 'xp_earned', v_xp_reward);
END; $$;

CREATE OR REPLACE FUNCTION initialize_user_squad(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO user_squad_units (user_id, unit_type, overall_rating, attack_stat, defense_stat, speed_stat) VALUES
    (p_user_id, 'quarterback', 50, 55, 45, 50),
    (p_user_id, 'runningback', 50, 50, 45, 60),
    (p_user_id, 'receiver', 50, 50, 40, 65),
    (p_user_id, 'lineman', 50, 60, 60, 35),
    (p_user_id, 'linebacker', 50, 45, 60, 50),
    (p_user_id, 'safety', 50, 40, 55, 60),
    (p_user_id, 'cornerback', 50, 40, 50, 65),
    (p_user_id, 'kicker', 50, 55, 30, 40)
  ON CONFLICT (user_id, unit_type) DO NOTHING;
  INSERT INTO user_seasons (user_id, season_number, is_active) VALUES (p_user_id, 1, TRUE) ON CONFLICT DO NOTHING;
END; $$;

CREATE OR REPLACE FUNCTION start_training_session(p_user_id UUID, p_unit_type TEXT, p_duration_minutes INTEGER)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_session_id UUID; v_stat_increase INTEGER;
BEGIN
  v_stat_increase := CASE WHEN p_duration_minutes = 15 THEN 1 WHEN p_duration_minutes = 30 THEN 3 WHEN p_duration_minutes = 60 THEN 6 WHEN p_duration_minutes = 120 THEN 15 ELSE 1 END;
  INSERT INTO training_sessions (user_id, unit_type, duration_minutes, stat_to_train, stat_increase, completes_at) VALUES (p_user_id, p_unit_type, p_duration_minutes, 'overall', v_stat_increase, NOW() + (p_duration_minutes || ' minutes')::INTERVAL) RETURNING id INTO v_session_id;
  RETURN v_session_id;
END; $$;

CREATE OR REPLACE FUNCTION complete_training_session(p_session_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_user_id UUID; v_unit_type TEXT; v_stat_increase INTEGER; v_claimed BOOLEAN; v_completes_at TIMESTAMPTZ;
BEGIN
  SELECT user_id, unit_type, stat_increase, claimed, completes_at INTO v_user_id, v_unit_type, v_stat_increase, v_claimed, v_completes_at FROM training_sessions WHERE id = p_session_id;
  IF v_claimed THEN RAISE EXCEPTION 'Training session already claimed'; END IF;
  IF v_completes_at > NOW() THEN RAISE EXCEPTION 'Training session not yet complete'; END IF;
  UPDATE user_squad_units SET overall_rating = LEAST(overall_rating + v_stat_increase, 99), training_points = training_points + v_stat_increase WHERE user_id = v_user_id AND unit_type = v_unit_type;
  UPDATE training_sessions SET claimed = TRUE WHERE id = p_session_id;
  RETURN json_build_object('success', true, 'stat_increase', v_stat_increase, 'unit_type', v_unit_type);
END; $$;

CREATE OR REPLACE FUNCTION simulate_match(p_user_id UUID, p_game_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_user_rating INTEGER; v_opponent_rating INTEGER; v_user_score INTEGER; v_opponent_score INTEGER; v_result TEXT; v_coins_earned INTEGER; v_xp_earned INTEGER; v_season_id UUID;
BEGIN
  SELECT AVG(overall_rating)::INTEGER INTO v_user_rating FROM user_squad_units WHERE user_id = p_user_id;
  v_opponent_rating := 60 + floor(random() * 20);
  v_user_score := v_user_rating * (0.3 + random() * 0.4);
  v_opponent_score := v_opponent_rating * (0.3 + random() * 0.4);
  v_result := CASE WHEN v_user_score > v_opponent_score THEN 'win' ELSE 'loss' END;
  v_coins_earned := CASE WHEN v_result = 'win' THEN 50 + floor(random() * 50) ELSE 10 + floor(random() * 20) END;
  v_xp_earned := CASE WHEN v_result = 'win' THEN 100 + floor(random() * 100) ELSE 25 + floor(random() * 50) END;
  SELECT id INTO v_season_id FROM user_seasons WHERE user_id = p_user_id AND is_active = TRUE LIMIT 1;
  INSERT INTO user_match_results (user_id, season_id, opponent_name, user_score, opponent_score, result, coins_earned, xp_earned) VALUES (p_user_id, v_season_id, 'AI Opponent', v_user_score, v_opponent_score, v_result, v_coins_earned, v_xp_earned);
  UPDATE user_seasons SET games_played = games_played + 1, games_won = games_won + CASE WHEN v_result = 'win' THEN 1 ELSE 0 END, games_lost = games_lost + CASE WHEN v_result = 'loss' THEN 1 ELSE 0 END, points_for = points_for + v_user_score, points_against = points_against + v_opponent_score WHERE id = v_season_id;
  UPDATE profiles SET coins = coins + v_coins_earned, xp = xp + v_xp_earned WHERE id = p_user_id;
  RETURN json_build_object('result', v_result, 'user_score', v_user_score, 'opponent_score', v_opponent_score, 'coins_earned', v_coins_earned, 'xp_earned', v_xp_earned);
END; $$;

INSERT INTO mission_templates (title, description, mission_type, rarity, coin_reward, xp_reward, target_value, duration_hours) VALUES
('First Lesson', 'Complete 1 lesson today', 'complete_lessons', 'common', 30, 50, 1, 24),
('Learning Session', 'Complete 3 lessons today', 'complete_lessons', 'common', 50, 100, 3, 24),
('Make a Prediction', 'Predict the outcome of 1 game', 'make_predictions', 'common', 40, 75, 1, 24),
('Video Watcher', 'Watch 2 video lessons', 'watch_videos', 'common', 35, 60, 2, 24),
('Daily Login', 'Login to the app', 'login_streak', 'common', 25, 40, 1, 24),
('Lesson Master', 'Complete 5 lessons today', 'complete_lessons', 'rare', 100, 200, 5, 24),
('Prediction Streak', 'Make 3 predictions today', 'make_predictions', 'rare', 80, 150, 3, 24),
('Coin Collector', 'Earn 100 coins today', 'earn_coins', 'rare', 75, 125, 100, 24),
('Big Spender', 'Spend 50 coins in the shop', 'spend_coins', 'rare', 60, 100, 50, 24),
('Quiz Master', 'Answer 10 quiz questions correctly', 'answer_questions', 'rare', 90, 175, 10, 24),
('Course Crusher', 'Complete 10 lessons today', 'complete_lessons', 'epic', 200, 400, 10, 24),
('Prediction Pro', 'Make 5 predictions today', 'make_predictions', 'epic', 150, 300, 5, 24),
('Coin Tycoon', 'Earn 300 coins today', 'earn_coins', 'epic', 180, 350, 300, 24),
('Training Camp', 'Complete 5 training sessions', 'train_units', 'epic', 160, 320, 5, 24),
('Ultimate Learner', 'Complete an entire course today', 'complete_lessons', 'legendary', 500, 1000, 15, 24),
('Fortune Seeker', 'Earn 1000 coins today', 'earn_coins', 'legendary', 400, 800, 1000, 24),
('HQ Manager', 'Collect from all buildings 3 times', 'collect_buildings', 'legendary', 350, 700, 3, 24)
ON CONFLICT DO NOTHING;

UPDATE profiles SET knowledge_points = COALESCE(knowledge_points, 0), energy = COALESCE(energy, 100), last_energy_update = COALESCE(last_energy_update, NOW()) WHERE knowledge_points IS NULL OR energy IS NULL;
