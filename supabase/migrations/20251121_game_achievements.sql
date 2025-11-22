-- Insert Game Achievements
insert into public.achievements (name, slug, description, points, category, is_active, badge_icon)
values
  ('Blitz Rookie', 'blitz-rush-rookie', 'Score 500 points in Blitz Rush', 100, 'games', true, 'Zap'),
  ('Blitz Master', 'blitz-rush-master', 'Score 2000 points in Blitz Rush', 500, 'games', true, 'Zap'),
  ('QB Rookie', 'qb-precision-rookie', 'Score 500 points in QB Precision', 100, 'games', true, 'Target'),
  ('QB Elite', 'qb-precision-elite', 'Score 1500 points in QB Precision', 500, 'games', true, 'Target'),
  ('Rhythm Rookie', 'snap-reaction-rookie', 'Score 500 points in Snap Reaction', 100, 'games', true, 'Music'),
  ('Rhythm Master', 'snap-reaction-master', 'Score 2000 points in Snap Reaction', 500, 'games', true, 'Music')
on conflict (slug) do nothing;
